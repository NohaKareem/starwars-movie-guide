(function() {
	"use strict";
	let resultsList = document.querySelector("#resultsList");
	let titleCon = document.querySelector("h2.title");
	let crawlCon = document.querySelector("p.crawl");
	let posterCon = document.querySelector(".posterCon");
	let contextMenu = document.querySelector(".contextMenu");
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
		// display character profile
		updatePoster(`chars/${charId}`, `${response.data.name} image`);
		crawlCon.innerHTML = "";
		titleCon.innerHTML = `${response.data.name}`;

		// display films
		let films = response.data.films;
		let subList = document.createElement("ul");
		let filmId = [];
		
		// posterCon.innerHTML = '';//~
		films.forEach((film) => {
			// get film ids (method takes an array of urls as first argument)
			getIdsFromURL([film], filmId);
			let listElement = document.createElement("li"); //~movie poster alt

			// movie poster is found by id, which is the last pushed item to the filmId array
			// posterCon.innerHTML += `
			var currFilmId = filmId.length - 1;
			listElement.innerHTML = `
				<a href="#" class="charLink">
					<img src="assets/images/films/${filmId[currFilmId]}.jpg" class="thumbnail" alt="Movie poster"> 
				</a>`;
			subList.appendChild(listElement);

			// add listener to click event to load film data //~
			listElement.addEventListener("click", _ => {
				axiosCall(FILM_URL + filmId[currFilmId], displayMovieProfile);
			});	
		});
		console.log(filmId)
		// parentList.appendChild(subList);
		contextMenu.innerHTML = ""; // reset menu
		contextMenu.appendChild(subList);
	}

	// displays movie profile with movie data and all characters for a single movie
	function displayMovieProfile(response, filmId) {
		console.log(response);
		titleCon.innerHTML = `${response.data.title}`;
		updatePoster(`films/${filmId}`, `${response.data.title} poster`);
		crawlCon.innerHTML = `${response.data.opening_crawl}`;
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

	loadChars();
})();