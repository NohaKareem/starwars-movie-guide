"use strict";

(function () {
  "use strict";

  var resultsList = document.querySelector("#resultsList");
  var titleCon = document.querySelector("h3.title");
  var crawlCon = document.querySelector("p.crawl");
  var posterCon = document.querySelector(".posterCon");
  var contextMenu = document.querySelector(".contextMenu");
  var charIds = [];
  var FILM_URL = 'https://swapi.co/api/films/';
  var PEOPLE_URL = 'https://swapi.co/api/people/'; // get character ids to be used in app (from The Force Awakens film, with id 7)
  // and then load each character's data

  function loadChars() {
    axiosCall(FILM_URL + "7", function (response) {
      var charUrls = response.data.characters; // get character ids

      getIdsFromURL(charUrls, charIds); // load characters

      for (var i = 0; i < charIds.length; i++) {
        axiosCall(PEOPLE_URL + charIds[i], displayCharMenu);
      }
    });
  } // display all characters on page


  function displayCharMenu(response, charId) {
    var listElement = document.createElement("li");
    listElement.innerHTML = "\n\t\t\t<a href=\"#\" class=\"charLink\">\n\t\t\t\t<img src=\"assets/images/chars/".concat(charId, ".jpg\" class=\"thumbnail\" alt=\"").concat(response.data.name, " image \"> \n\t\t\t\t<p class=\"charName\">").concat(response.data.name, "</p>\n\t\t\t</a>");
    resultsList.appendChild(listElement); // add listener to click event to load films for character,
    // provided films list has not been populated before

    listElement.addEventListener("click", function (_) {
      if (listElement.children.length <= 1) displayCharProfile(response, charId);
    });
  } // displays character profile with character data and all films for a single character


  function displayCharProfile(response, charId) {
    // hide main character menu
    var charListCon = document.querySelector("#charList");
    charListCon.classList.add("hidden"); // show data section

    var dataCon = document.querySelector(".dataCon");
    dataCon.classList.remove("hidden");
    var posterCon = document.querySelector(".posterCon");
    posterCon.classList.remove("hidden"); // display character profile

    updatePoster("chars/".concat(charId), "".concat(response.data.name, " image"));
    crawlCon.innerHTML = "";
    titleCon.innerHTML = "".concat(response.data.name); // show all films for character

    displayContextMenu(response, true);
  } // displays movie profile with movie data and all characters for a single movie


  function displayMovieProfile(response, filmId) {
    console.log(response);
    titleCon.innerHTML = "".concat(response.data.title);
    updatePoster("films/".concat(filmId), "".concat(response.data.title, " poster"));
    crawlCon.innerHTML = "".concat(response.data.opening_crawl); // ~show all characters for film
    // displayContextMenu(response, false);
  }
  /* helper methods */
  // generates axios call using url and handles response using responseMethod


  function axiosCall(url, responseMethod) {
    axios.get(url).then(function (response) {
      var id = [];
      getIdsFromURL([url], id, true);
      responseMethod(response, id[0]);
    })["catch"](function (error) {
      console.log(error);
    });
  } // updates posterCon with new image given image source, imgSrc and img alt, imgAlt


  function updatePoster(imgSrc, imgAlt) {
    posterCon.innerHTML = "<img src=\"assets/images/".concat(imgSrc, ".jpg\" alt=\"").concat(imgAlt, "\" class=\"poster\">");
  } // gets ids from a list of urls and stores them the detination array, dstArr
  // lastIndex parameter determines whether to pick last element (as opposed to second to last element) in url 


  function getIdsFromURL(urls, dstArr, lastIndex) {
    urls.forEach(function (url) {
      var urlComponents = url.split('/'); // id is second to last split element (example url https://swapi.co/api/people/1/)

      var index = lastIndex ? urlComponents.length - 1 : urlComponents.length - 2;
      dstArr.push(urlComponents[index]);
    });
  } // displays a menu for all characters in a movie or movies for a character, given an axios response


  function displayContextMenu(response, isFilm) {
    var menuItem = isFilm ? response.data.films : response.data.characters;
    var subList = document.createElement("ul");
    subList.classList.add("grid");
    var ItemId = [];
    menuItem.forEach(function (item) {
      // get ids (method takes an array of urls as first argument)
      getIdsFromURL([item], ItemId);
      var listElement = document.createElement("li"); //~movie poster alt
      // image is found by id, which is the last pushed item to the ItemId array

      var currItemId = ItemId.length - 1;
      listElement.innerHTML = "\n\t\t\t\t<a href=\"#\" class=\"charLink\">\n\t\t\t\t\t<img src=\"assets/images/".concat(isFilm ? "films" : "chars", "/").concat(ItemId[currItemId], ".jpg\" class=\"thumbnail\" alt=\"").concat(isFilm ? "poster" : "image", "\"> \n\t\t\t\t</a>");
      subList.appendChild(listElement); // add listener to click event to load data

      listElement.addEventListener("click", function (_) {
        axiosCall((isFilm ? FILM_URL : PEOPLE_URL) + ItemId[currItemId], displayMovieProfile);
      });
    });
    contextMenu.innerHTML = ""; // reset menu

    contextMenu.appendChild(subList);
  }

  loadChars();
})();