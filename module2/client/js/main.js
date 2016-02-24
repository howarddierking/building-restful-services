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
      let watchedOrAssigned = data;
      // Target anchor tag
      let bugItem = $('.list-group-item:nth-child(' + child + ')');
      // Display bug title and bug description
      bugItem.append('<a href="' + url + '">' + data.title + '</a></li>')
      .append('<p>' + data.description + '</p>');
    })
  }

  function listAssignments(url, name) {
    // Get json file
    $.getJSON(url, function(data){
      // Save array of bug links to variable
      let bugsArray = data.bugs;

      bugsArray.forEach(function(bugUrl){
        $.getJSON(bugUrl, function(data){

          let usersArray = data['assigned-to'];

          usersArray.forEach(function(userUrl){

            $.getJSON(userUrl, function(data){
              console.log(data);
            })
          })
        })
      })
    })
  }

  function listWatchedBy(url) {
    // Get json file
    $.getJSON(url, function(data){
      // Save array of bug links to variable
      let bugsArray = data.bugs;
      bugsArray.forEach(function(bugUrl){
        $.getJSON(bugUrl, function(data){
          console.log(data['watched-by']);
        })
      })
    })
  }

listBugs('http://m2.build-rest.net/json/index.json', displayBugName);

listAssignments('http://m2.build-rest.net/json/index.json');

// listWatchedBy('http://m2.build-rest.net/json/index.json');

});

// To-Do:
// Filter by name. Have a list of names in a side nav bar. On click, dashboard should reload with only bugs assinged to that person
// Filter by assigned-to. Same as above.
