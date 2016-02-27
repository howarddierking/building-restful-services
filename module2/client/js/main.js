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

  function displayBugInfo(url, child) {
    // Get json file
    $.getJSON(url, function(data){
      console.log(data);
      // Target anchor tag
      let bugItem = $('.list-group-item:nth-child(' + child + ')');
      // Display bug title and bug description
      bugItem.append('<a href="' + url + '">' + data.title + '</a>')
      .append('<p>' + data.description + '</p>');

      let assignedToArray = data.assignedTo;

      assignedToArray.forEach(function(personURL) {
        $.getJSON(personURL, function(data){
          bugItem.append('<p>Assigned To: <a href="' + personURL + '">' + data.username + '</a></p>');
        })
      });

      let watchedByArray = data.watchedBy;

      watchedByArray.forEach(function(personURL) {
        $.getJSON(personURL, function(data){
          bugItem.append('<p>Watched By: <a href="' + personURL + '">' + data.username + '</a></p>');
        })
      });
    })
  }

listBugs('http://m2.build-rest.net/json/index.json', displayBugInfo);

});
