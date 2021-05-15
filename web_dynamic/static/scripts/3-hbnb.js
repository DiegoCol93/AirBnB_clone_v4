const $ = window.$;
const fetch = window.fetch;
const d = document;
let amenityNamesList = [];
let amenityIdList = [];
// Wrapper for waiting page to complete loading.
document.onreadystatechange = function () {
  if (document.readyState === 'complete') {

    // Amenities Checkbox list display - - - - - - - - - - - - - - - - - - - - - - - |
    // If any checkbox is clicked
    $('input[type="checkbox"]').click(function () {
      // Get the current checkbox being clicked.
      let box = $(this);
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
          //	return value !== box.next('span').text();
        });
        amenityIdList = amenityIdList.filter(function (value, index, arr) {
          return value !== box.data('id');
          //	return value !== box.next('span').text();
        });
      }
      //console.log(amenityIdList);
      $('.amenities h4').text(amenityNamesList.join(', '));
    });

    // Status light display - - - - - - - - - - - - - - - - - - - - - - - - - - |
    async function statusResponse(url) {
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
    urlBase = 'http://0.0.0.0:5001/api/v1';
    statusResponse(urlBase + '/status');
    //setInterval(statusResponse, 10000, url);

    // Request using AJAX
    $.ajax({
      url: urlBase+'/places_search',
      crossDomain: true,
      type: 'post',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({}),
      success: function (data) {
        data.forEach(place => {
          // create Article tag
          let articleNode = d.createElement('ARTICLE');
          // Create title box div
          let outterDiv = d.createElement('DIV');
          let placeNameH2 = d.createElement('H2');
          let innerDiv = d.createElement('DIV');
          let txtNode = d.createTextNode(place.name);
          placeNameH2.appendChild(txtNode);
          txtNode = d.createTextNode(place.price_by_night);
          innerDiv.appendChild(txtNode);
          outterDiv.appendChild(placeNameH2);
          outterDiv.appendChild(innerDiv);
          articleNode.appendChild(outterDiv);
          outterDiv.classList.add('title_box');
          innerDiv.classList.add('price_by_night');
          // end of first div
          $('.places')[0].appendChild(articleNode);
          // Information div
          outterDiv = createElement('DIV');
          innerDiv = createElement('DIV');
          innerDiv.classList.add('max_guest');
          innerDiv.appendChild(place.max_guest);
          outterDiv.appendChild(innerDiv);

          innerDiv = createElement('DIV');
          innerDiv.classList.add('number_rooms');
          innerDiv.appendChild(place.numer_rooms);
          outterDiv.appendChild(innerDiv);

          innerDiv = createElement('DIV');
          innerDiv.classList.add('number_bathrooms');
          innerDiv.appendChild(place.numer_bathrooms);
          outterDiv.appendChild(innerDiv);

          outterDiv.classList.add('information');
          articleNode.appendChild(outterDiv);
          
          // information end

          // User div
          outterDiv = createElement('DIV');
          const b = createElement('B');
          txtNode = createTextNode('Owner:');
          b.appendChild(txtNode);
          outterDiv.appendChild(b);
          txtNode = createTextNode(place.user.first_name);
          outterDiv.appendChild(txtNode);

          articleNode.appendChild(outterDiv);
          


        });
      },
      error: function () {
        console.log('Cannot get data');
      }
    });

  }
};
