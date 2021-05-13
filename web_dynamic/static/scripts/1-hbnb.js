const $ = window.$;

// Wrapper for waiting page to complete loading.
document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
	// If any checkbox is clicked
	$('input[type="checkbox"]').click(function() {
	  
	  // Get the current checkbox being clicked.
	  let box = $( this );

	  if (box.is(':checked')) {
		


		box.parent().css("color", "#00ff00");
	  } else {
		box.parent().css("color", "#484848");
	  }
	});
  }
};
