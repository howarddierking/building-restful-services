'use strict';

$(document).ready(function(){

  function listBugs(url, cb) {
    // Get json file
    $.getJSON(url, function(data) {
      // Target the array from the returned data
      let bugsArray = data.bugs;
      let child;
      // Iterate over array, and display each bug url in an href
      for(let i = 0; i < bugsArray.length; i++) {
        // $('.bugs-ul').append('<li class="list-group-item"><a href="' + bugsArray[i] + '"></a></li>');
        $('.bugs-ul').append('<li class="list-group-item"></li>');
        // Execute callback with bug link
        child = i + 1;
        cb(bugsArray[i], child);
      }
    });
  }

  function displayBugName(url, child) {
    // Get json file
    $.getJSON(url, function(data){
      console.log(data);
      // Target anchor tag
      let bugItem = $('.list-group-item:nth-child(' + child + ')');
      // Display bug title and bug description
      bugItem.append('<a href="' + url + '">' + data.title + '</a></li>')
      .append('<p>' + data.description + '</p>');
    })
  }

  function getAssignments(url) {
    // code here
  };

  listBugs('http://localhost:8000/json-ld/index.json', displayBugName);

});
