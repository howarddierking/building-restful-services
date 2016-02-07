'use strict';

$(document).ready(function(){

  function listBugs(url, cb) {
    // Get json file
    $.getJSON(url, function(data) {
      // Target the array from the returned data
      let bugsArr = data.bugs;
      // Iterate over array, and display each bug url in an href
      for(let i = 0; i < bugsArr.length; i++) {
        $('.bugs-ul').append('<li class="list-group-item"><a href="' + bugsArr[i] + '"></a></li>');
        // Execute callback with bug link
        cb(bugsArr[i]);
      }
    });
  }

  function displayBugName(url) {
    // Get json file
    $.getJSON(url, function(data){
      console.log(data);
      // Target anchor tag
      let bugItemAnchor = $('.list-group-item a');
      // Display bug title in anchor tag
      bugItemAnchor.text(data.title);
    })
  }

  listBugs('http://localhost:8000/index.json', displayBugName);

});
