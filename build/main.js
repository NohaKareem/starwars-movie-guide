"use strict";

(function () {
  "use strict";

  var resultsList = document.querySelector("#resultsList");
  var charIds = [];
  var FILM_URL = 'https://swapi.co/api/films/';
  var PEOPLE_URL = 'https://swapi.co/api/people/'; // get character ids to be used in app (from The Force Awakens film, with id 7)
  // and then load each character's data

  function loadChars() {
    axiosCall(FILM_URL + "7", function (response) {
      var charUrls = response.data.characters; // get character ids

      getIdsFromURL(charUrls, charIds); // load characters

      for (var i = 0; i < charIds.length; i++) {
        axiosCall(PEOPLE_URL + charIds[i], addCharsToList);
      }
    });
  } // display all characters on page


  function addCharsToList(response) {
    var listElement = document.createElement("li");
    listElement.innerHTML = "<a href=\"#\" class=\"charLink\">".concat(response.data.name, "</a>");
    resultsList.appendChild(listElement); // add listener to click event to load films for character,
    // provided films list has not been populated before

    listElement.addEventListener("click", function (_) {
      if (listElement.children.length <= 1) addFilmsToChar(listElement, response);
    });
  } // displays all films for a single character


  function addFilmsToChar(parentList, response) {
    var films = response.data.films;
    var subList = document.createElement("ul");
    var filmId = [];
    films.forEach(function (film) {
      // get film ids (method takes an array of urls as first argument)
      getIdsFromURL([film], filmId);
      var listElement = document.createElement("li"); //~movie poster alt
      // movie poster is found by id, which is the last pushed item to the filmId array

      listElement.innerHTML = "\n\t\t\t\t<a href=\"#\" class=\"charLink\">\n\t\t\t\t\t<img src=\"assets/images/films/".concat(filmId[filmId.length - 1], ".jpg\" class=\"thumbnail\" alt=\"Movie poster\"> \n\t\t\t\t\t<p>").concat(film, "</p>\t\n\t\t\t\t</a>");
      subList.appendChild(listElement); // add listener to click event to load film data

      listElement.addEventListener("click", function (_) {
        axiosCall(FILM_URL + filmId[0], function (_) {
          console.log('~retrieved film');
        });
      });
    });
    console.log(filmId);
    parentList.appendChild(subList);
  }
  /* helper methods */
  // generates axios call using url and handles response using responseMethod


  function axiosCall(url, responseMethod) {
    axios.get(url).then(function (response) {
      // console.log(response)
      responseMethod(response);
    })["catch"](function (error) {
      console.log(error);
    });
  } // gets ids from a list of urls and stores them the detination array, dstArr


  function getIdsFromURL(urls, dstArr) {
    urls.forEach(function (url) {
      var urlComponents = url.split('/'); // id is second to last split element (example url https://swapi.co/api/people/1/)

      dstArr.push(urlComponents[urlComponents.length - 2]);
    });
  }

  loadChars();
})();