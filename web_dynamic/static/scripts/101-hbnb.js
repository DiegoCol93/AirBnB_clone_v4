const $ = window.$;
const d = document;
const fetch = window.fetch;

let amenityIdList = [];
let amenityNamesList = [];

let cityIdList = [];
let stateIdList = [];

let stateCityNamesList = [];

// const urlBase = 'http://0.0.0.0:5001/api/v1';
const urlBase = 'http://127.0.0.1:5001/api/v1';

// Status response api fetch. - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
async function statusResponse (url) {
  const response = await fetch(url);
  const dict = await response.json();
  if (dict.status === 'OK') {
    $('#api_status').removeClass('unavailable');
    $('#api_status').addClass('available');
  } else {
    $('#api_status').removeClass('available');
    $('#api_status').addClass('unavailable');
  }
}

// Populates the reviews inside the places.- - - - - - - - - - - - - - - - - - - - - - |
function populateReviews (data, reviews) {
  data.forEach(review => {
    const li = d.createElement('LI');
    const h3 = d.createElement('H3');
    const p = d.createElement('P');

    h3.appendChild(d.createTextNode('From ' + review.user_id));
    h3.appendChild(d.createTextNode('From'));
    p.appendChild(d.createTextNode(review.text));
    li.appendChild(h3);
    li.appendChild(p);
    reviews.append(li);
  });
}

// Populates the place elements - - - - - - - - - - - - - - - - - - - - - - - - - - - |
function populatePlaces (data) {
  data.forEach(place => {
    // create Article tag
    const articleNode = d.createElement('ARTICLE');
    // Create title box div
    let outterDiv = d.createElement('DIV');
    let h2Aux = d.createElement('H2');
    let innerDiv = d.createElement('DIV');
    h2Aux.appendChild(d.createTextNode(place.name));
    innerDiv.appendChild(d.createTextNode('$' + place.price_by_night));
    outterDiv.appendChild(h2Aux);
    outterDiv.appendChild(innerDiv);
    articleNode.appendChild(outterDiv);
    outterDiv.classList.add('title_box');
    innerDiv.classList.add('price_by_night');
    // end of first div

    // Information div
    outterDiv = d.createElement('DIV');
    innerDiv = d.createElement('DIV');
    innerDiv.classList.add('max_guest');
    const guest = place.max_guest !== 1 ? 'Guests' : 'Guest';
    innerDiv.appendChild(d.createTextNode(guest + ' ' + place.max_guest));
    outterDiv.appendChild(innerDiv);

    innerDiv = d.createElement('DIV');
    innerDiv.classList.add('number_rooms');
    const room = place.max_guest !== 1 ? 'Rooms' : 'Room';
    innerDiv.appendChild(d.createTextNode(room + ' ' + place.number_rooms));
    outterDiv.appendChild(innerDiv);

    innerDiv = d.createElement('DIV');
    innerDiv.classList.add('number_bathrooms');
    const bathroom = place.max_guest !== 1 ? 'Bathrooms' : 'Bathroom';
    innerDiv.appendChild(d.createTextNode(bathroom + ' ' + place.number_bathrooms));
    outterDiv.appendChild(innerDiv);

    outterDiv.classList.add('information');
    articleNode.appendChild(outterDiv);

    // Description div
    outterDiv = d.createElement('DIV');
    outterDiv.classList.add('description');
    outterDiv.insertAdjacentHTML('beforeend', place.description);
    articleNode.appendChild(outterDiv);

    // Span for reviews counter.
    outterDiv = d.createElement('DIV');
    outterDiv.classList.add('amenities');
    // Space for adding display of amenity icons.
    innerDiv = d.createElement('DIV');
    innerDiv.classList.add('reviews');
    h2Aux = d.createElement('H2');
    const span = d.createElement('SPAN');
    h2Aux.appendChild(d.createTextNode('Reviews: '));
    innerDiv.appendChild(h2Aux);
    innerDiv.appendChild(d.createElement('UL'));
    span.appendChild(d.createTextNode('show'));
    span.setAttribute('class', 'showReviews');
    h2Aux.appendChild(span);
    outterDiv.appendChild(innerDiv);
    articleNode.appendChild(outterDiv);
    articleNode.setAttribute('data-id', place.id);

    $('.places')[0].appendChild(articleNode);
  });
}

// Request API's placesReviews own enpoint data. - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
function getReviewData (placeId, successCallBack) {
  $.ajax({
    url: urlBase + '/places/' + placeId + '/reviews',
    crossDomain: true,
    success: successCallBack,
    error: function () {
      console.log('Cannot get data');
    }
  });
}

// Request API's place data. - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
function getPlaceData (url, filters, successCallBack) {
  $.ajax({
    url: urlBase + '/places_search',
    crossDomain: true,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(filters),
    success: successCallBack,
    error: function () {
      console.log('Cannot get data');
    }
  });
}

// Wrapper for waiting page to complete loading. - - - - - - - - - - - - - - - - - - - |
document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
    // Amenitites onClick. - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
    $('DIV.amenities input[type="checkbox"]').click(function () {
      // Get the current checkbox being clicked.
      const box = $(this);
      if (box.is(':checked')) {
        // Populate amenity name list
        amenityNamesList.push(box.data('name'));
        // Populate amenity id list
        amenityIdList.push(box.data('id'));
        // box.parent().css("color", "#00ff00");
      } else {
        // box.parent().css("color", "#484848");
        amenityNamesList = amenityNamesList.filter(function (value, index, arr) {
          return value !== box.data('name');
          // return value !== box.next('span').text();
        });
        amenityIdList = amenityIdList.filter(function (value, index, arr) {
          return value !== box.data('id');
          // return value !== box.next('span').text();
        });
      }
      // console.log(amenityIdList);
      $('.amenities h4').text(amenityNamesList.join(', '));
    });

    // States onClick. - - - - - - - - - - - - - - - - - - - - - - - - - - |
    $('DIV.locations h2 input[type="checkbox"]').click(function () {
      // Get the current checkbox being clicked.
      const box = $(this);
      if (box.is(':checked')) {
        // Populate amenity name list
        stateCityNamesList.push(box.data('name'));
        // Populate amenity id list
        stateIdList.push(box.data('id'));
        // box.parent().css("color", "#00ff00");
      } else {
        // box.parent().css("color", "#484848");
        stateCityNamesList = stateCityNamesList.filter(function (value, index, arr) {
          return value !== box.data('name');
          // return value !== box.next('span').text();
        });
        stateIdList = stateIdList.filter(function (value, index, arr) {
          return value !== box.data('id');
          // return value !== box.next('span').text();
        });
      }
      // console.log(amenityIdList);
      $('.locations h4').text(stateCityNamesList.join(', '));
    });

    // Cities onClick. - - - - - - - - - - - - - - - - - - - - - - - - - - |
    $('DIV.locations li li input[type="checkbox"]').click(function () {
      // Get the current checkbox being clicked.
      const box = $(this);
      if (box.is(':checked')) {
        // Populate amenity name list
        stateCityNamesList.push(box.data('name'));
        // Populate amenity id list
        cityIdList.push(box.data('id'));
        // box.parent().css("color", "#00ff00");
      } else {
        // box.parent().css("color", "#484848");
        stateCityNamesList = stateCityNamesList.filter(function (value, index, arr) {
          return value !== box.data('name');
          // return value !== box.next('span').text();
        });
        cityIdList = cityIdList.filter(function (value, index, arr) {
          return value !== box.data('id');
          // return value !== box.next('span').text();
        });
      }
      // console.log(amenityIdList);
      $('.locations h4').text(stateCityNamesList.join(', '));
    });

    // Status light display call - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
    statusResponse(urlBase + '/status');
    // setInterval(statusResponse, 10000, url);

    // Call the getplacedata and populateplaces functions on first load once - - - - - - |
    getPlaceData('', {}, populatePlaces);

    // On click event on search button action. - - - - - - - - - - - - - - - - - - - - - |
    $('button').on('click', function () {
      $('.places').empty();
      getPlaceData('', { amenities: amenityIdList, cities: cityIdList, states: stateIdList }, populatePlaces);
    });

    $('.places').on('click', '.showReviews', function() {
      const placeReviewId= $(this).closest('article').attr('data-id');
      getReviewData(placeReviewId, populateReviews, $(this));
    });
  }
};
