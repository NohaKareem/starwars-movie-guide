(function() {
	"use strict";
	let resultsList = document.querySelector("#resultsList");
	let titleCon = document.querySelector("h3.title");
	let crawlCon = document.querySelector("p.crawl");
	let posterCon = document.querySelector(".posterCon");
	let charProfilePicCon = document.querySelector(".charProfilePicCon");
	let charName = document.querySelector(".charName");
	let contextMenu = document.querySelector(".contextMenu");
	let contextMenuTitle = document.querySelector(".contextMenuTitle");
	let burgerIcon = document.querySelector(".burgerIcon");
	let container = document.querySelector("#container");
	let charListCon = document.querySelector("#charList");

	let charIds = [];
	var movieTitles = [];
	const FILM_URL = 'https://swapi.co/api/films/'; 
	const PEOPLE_URL = 'https://swapi.co/api/people/';

	// get character ids to be used in app (from The Force Awakens film, with id 7)
	// and then load each character's data
	function loadChars() {
		axiosCall(FILM_URL + "7", function(response){	
			let charUrls = response.data.characters;

			// get character ids
			getIdsFromURL(charUrls, charIds);

			// load characters
			for(let i = 0; i < charIds.length; i++){
				axiosCall(PEOPLE_URL + charIds[i], displayCharMenu); 
			}
		}); 
	}

	// display all characters on page
	function displayCharMenu(response, charId) {
		let listElement = document.createElement("li");
		listElement.innerHTML = `
			<div class="charLink">
				<a href="#">
					<img src="assets/images/chars/${charId}.jpg" class="thumbnail" alt="${response.data.name} image "> 
					<p class="charName">${response.data.name}</p>
				</a>
			</div>`;
		resultsList.appendChild(listElement);	

		// add listener to click event to load films for character,
		// provided films list has not been populated before
		listElement.addEventListener("click", _ => {
			if(listElement.children.length <= 1)
				displayCharProfile(response, charId); 
		});
	}

	// displays character profile with character data and all films for a single character
	function displayCharProfile(response, charId) {
		// hide main character menu and show it as burger menu
		charListCon.classList.add("menuList");
		charListCon.classList.add("hidden");
		burgerIcon.classList.remove("hidden");
		container.classList.remove("threeGrid");
		container.classList.add("twoGrid");
		resetMovieDisplay();

		// show data section
		let dataCon = document.querySelector(".dataCon");
		dataCon.classList.remove("hidden");
		let posterCon = document.querySelector(".posterCon");
		posterCon.classList.remove("hidden");

		// display character profile
		updatePoster(`chars/${charId}`, `${response.data.name} image`, false);
		crawlCon.innerHTML = "";
		charName.innerHTML = `${response.data.name}`;

		// show all films for character
		contextMenuTitle.innerHTML = `${response.data.name}'s movies`;
		displayContextMenu(response, true);		
	}

	// displays movie profile with movie data and all characters for a single movie
	function displayMovieProfile(response, filmId) {
		titleCon.innerHTML = `${response.data.title}`;
		updatePoster(`films/${filmId}`, `${response.data.title} poster`, true);
		crawlCon.innerHTML = `${response.data.opening_crawl}`;
	}

	// displays movie titles
	function populateMovieTitles(response) {
		console.log(response.data.title)
		movieTitles.push(response.data.title);
		console.log(movieTitles)
	}

	// toggle burger menu
	function toggleBurgerMenu(e) {
		charListCon.classList.toggle("hidden");
		container.classList.toggle("threeGrid");
		burgerIcon.classList.toggle("burgerIconTransform");

		/**greensock animation */
		TweenLite.fromTo(charListCon, 1, {opacity: 0}, {opacity: 1, ease: "power3.out"});
	}

	
	/* helper methods */ 
	// generates axios call using url and handles response using responseMethod
	function axiosCall(url, responseMethod) {
		axios.get(url)
		.then(function(response) {
			var id = [];
			getIdsFromURL([url], id, true);
			responseMethod(response, id[0]);
		})
		.catch(function(error) {
			console.log(error);
		});
	}

	// updates posterCon with new image given image source, imgSrc and img alt, imgAlt.
	//  Updates as movie poster if isPoster is true, else updates as character profile pic
	function updatePoster(imgSrc, imgAlt, isPoster) {
		if (isPoster)
			posterCon.innerHTML = `<img src="assets/images/${imgSrc}.jpg" alt="${imgAlt}" class="poster">`;
		else {
			charProfilePicCon.innerHTML = `<img src="assets/images/${imgSrc}.jpg" alt="${imgAlt}" class="thumbnail charProfilePic">`;
		}
	}

	// gets ids from a list of urls and stores them the detination array, dstArr
	// lastIndex parameter determines whether to pick last element (as opposed to second to last element) in url 
	function getIdsFromURL(urls, dstArr, lastIndex) {
		urls.forEach((url) => {
			let urlComponents = url.split('/');

			// id is second to last split element (example url https://swapi.co/api/people/1/)
			let index = lastIndex ? urlComponents.length - 1 : urlComponents.length - 2;
			dstArr.push(urlComponents[index]);
		});
	}

	// displays a menu for all characters in a movie or movies for a character, given an axios response
	function displayContextMenu(response, isFilm) {
		let menuItem = isFilm ? response.data.films : response.data.characters;
		let subList = document.createElement("ul");
		subList.classList.add("grid");
		let ItemId = [];
		
		menuItem.forEach((item) => {
			// get ids (method takes an array of urls as first argument)
			getIdsFromURL([item], ItemId);
			let listElement = document.createElement("li"); 

			// image is found by id, which is the last pushed item to the ItemId array
			var currItemId = ItemId.length - 1; 

			// display context menu, with movie titles (if showing character profile)
			// if (isFilm) {
			// 	axiosCall(FILM_URL + ItemId[currItemId], populateMovieTitles);
			// }

			listElement.innerHTML = `
				<a href="#" class="charLink">
					<img src="assets/images/${isFilm ? "films" : "chars"}/${ItemId[currItemId]}.jpg" class="thumbnail" alt="${isFilm ? "poster" : "image"}"> 
				</a>`; 
			subList.appendChild(listElement);

		

			// add listener to click event to load data
			listElement.addEventListener("click", _ => {
				axiosCall((isFilm ? FILM_URL : PEOPLE_URL) + ItemId[currItemId], displayMovieProfile);
			});	
		});
		contextMenu.innerHTML = ""; // reset menu
		contextMenu.appendChild(subList);
	}

	function resetMovieDisplay() {
		titleCon.innerHTML = "";
		posterCon.innerHTML = "";
		crawlCon.innerHTML = "";
	}

	loadChars();

	// event handler registration
	burgerIcon.addEventListener("click", toggleBurgerMenu);
})();