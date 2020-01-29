(function() {
	"use strict";
	let resultsList = document.querySelector("#resultsList");
	let titleCon = document.querySelector("h3.title");
	let crawlCon = document.querySelector("p.crawl");
	let posterCon = document.querySelector(".posterCon");
	let contextMenu = document.querySelector(".contextMenu");
	let burgerIcon = document.querySelector(".burgerIcon");
	let container = document.querySelector("#container");
	let charListCon = document.querySelector("#charList");//container~

	let charIds = [];
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
			<a href="#" class="charLink">
				<img src="assets/images/chars/${charId}.jpg" class="thumbnail" alt="${response.data.name} image "> 
				<p class="charName">${response.data.name}</p>
			</a>`;
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
		charListCon.classList.add("menuList");//~gridCon
		charListCon.classList.add("hidden");//~gridCon
		burgerIcon.classList.remove("hidden");

		// show data section
		let dataCon = document.querySelector(".dataCon");
		dataCon.classList.remove("hidden");
		let posterCon = document.querySelector(".posterCon");
		posterCon.classList.remove("hidden");

		// display character profile
		updatePoster(`chars/${charId}`, `${response.data.name} image`);
		crawlCon.innerHTML = "";
		titleCon.innerHTML = `${response.data.name}`;

		// show all films for character
		displayContextMenu(response, true);		
	}

	// displays movie profile with movie data and all characters for a single movie
	function displayMovieProfile(response, filmId) {
		console.log(response);
		titleCon.innerHTML = `${response.data.title}`;
		updatePoster(`films/${filmId}`, `${response.data.title} poster`);
		crawlCon.innerHTML = `${response.data.opening_crawl}`;

		// ~show all characters for film
		// displayContextMenu(response, false);
	}

	// toggle burger menu
	function toggleBurgerMenu(e) {
		charListCon.classList.toggle("hidden");
		container.classList.toggle("threeGrid");
		burgerIcon.classList.toggle("burgerIconTransform");//~
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

	// updates posterCon with new image given image source, imgSrc and img alt, imgAlt
	function updatePoster(imgSrc, imgAlt) {
		posterCon.innerHTML = `<img src="assets/images/${imgSrc}.jpg" alt="${imgAlt}" class="poster">`
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
			let listElement = document.createElement("li"); //~movie poster alt

			// image is found by id, which is the last pushed item to the ItemId array
			var currItemId = ItemId.length - 1; 
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

	loadChars();

	// event handler registration
	burgerIcon.addEventListener("click", toggleBurgerMenu);
})();