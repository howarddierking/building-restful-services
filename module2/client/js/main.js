'use strict';

let listBugs = function(url, cb) {
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
};

let capitalize = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

let displayBugInfo = function(url, child) {
  // Get json file
  $.getJSON(url, function(data){
    // Target li element
    let bugItem = $('.list-group-item:nth-child(' + child + ')');
    // Display bug title and bug description
    bugItem.append('<h4><a href="' + url + '">' + capitalize(data.title) + '</a></h4>')
    .append('<h5>' + capitalize(data.description) + '</h5>');

    let assignedToArray = data.assignedTo;

    assignedToArray.forEach(function(personURL) {
      $.getJSON(personURL, function(data){
        bugItem.append('<p>Assigned to: <a class="person">' + capitalize(data.username) + '</a></p>');
      })
    });

    let watchedByArray = data.watchedBy;

    watchedByArray.forEach(function(personURL) {
      $.getJSON(personURL, function(data){
        bugItem.append('<p>Watched by: <a class="person">' + capitalize(data.username) + '</a></p>');
      })
    });
  })
};

$(document).ready(function() {
  // display bugs on page load
  listBugs('http://m2.build-rest.net/json/index.json', displayBugInfo);

  $(".person").click(function(){
    $(".bug-colomn").empty();
    console.log("clicked");
  });
});
