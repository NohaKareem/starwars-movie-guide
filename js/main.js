(function() {
	"use strict";
	const resultsList = document.querySelector("#resultsList");
	const filmURL = 'https://swapi.co/api/films/';
	const peopleURL = 'https://swapi.co/api/people/';
	
	let charIds = [];

	// Helper method. Generates axios call using url and handles response using responseMethod
	function axiosCall(url, responseMethod) {
		axios.get(url)
		.then(function(response){
			responseMethod(response);
		})
		.catch(function(error) {
			console.log(error);
		});
	}

	// loads charachter ids to be used in app (charachters from The Force Awakens film, with id 7)
	function loadCharIds() {
			console.log('in load chars');
			axiosCall(filmURL + "7", function(response){	
				let charUrls = response.data.characters;
				console.log(charUrls)		
			for(let i = 0; i < charUrls.length; i++) {
				let urlComponents = charUrls[i].split('/');
				
				// charachter API id is second to last split character (example url https://swapi.co/api/people/1/)
				charIds[i] = urlComponents[urlComponents.length - 2];
			}
		}); 
	}

	// load charachters method (to be passed to axiosCall~)
	function loadChars(response) {
		for(let i = 0; i < response.data.results.length; i++){
			let listElement = document.createElement("li");
			listElement.appendChild(document.createTextNode(response.data.results[i].name));
			resultsList.appendChild(listElement);	
	}
		// console.table(response);
	}

	loadCharIds();
	axiosCall(peopleURL, loadChars); // load charachters

	// loadChars();

})();