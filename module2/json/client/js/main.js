'use strict';

let listBugs = function(url, cb) {
  // Get json file
  $.getJSON(url, function(data) {
    // Target the array from the returned data
    let bugsArray = data.bugs;
    // declare variable that will be used and passed later
    let child;
    // Iterate over array, and display each bug and execute callback
    for(let i = 0; i < bugsArray.length; i++) {
      $('.bugs-ul').append('<li class="list-group-item"></li>');
      // Execute callback with bug link and child
      child = i + 1;
      cb(bugsArray[i], child);
    }
  });
};

let displayBugInfo = function(url, child) {
  // Get json file
  $.getJSON(url, function(data){
    // Target li element
    let bugItem = $('.list-group-item:nth-child(' + child + ')');
    // Display bug title and bug description
    bugItem.append('<h4><a class="bug-title" id="' + url + '">' + capitalize(data.title) + '</a></h4>')
    .append('<h5>' + capitalize(data.description) + '</h5>');
    // save assignedTo users array to variable
    let assignedToArray = data.assignedTo;
    // iterate over assignedToArray and display users this bug is assigned to
    assignedToArray.forEach(function(personURL) {
      $.getJSON(personURL, function(data){
        bugItem.append('<p>Assigned to: <a class="assigned-to">' + capitalize(data.username) + '</a></p>');
      })
    });
    // save watchedBy users array to variable
    let watchedByArray = data.watchedBy;
    // iterate over watchedByArray and display users this bug is watched by
    watchedByArray.forEach(function(personURL) {
      $.getJSON(personURL, function(data){
        bugItem.append('<p>Watched by: <a class="watched-by">' + capitalize(data.username) + '</a></p>');
      })
    });
  })
};

let capitalize = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

let displayAssignedTo = function(name, cb) {
  // save url to user from passed in name parameter
  let userUrl = 'http://m2.build-rest.net/json/users/' + name + '.json';
  // display bugs assigned to user with callback execution
  $.getJSON(userUrl, function(data){
    $('.bug-colomn > h2 > small').html('Bugs assigned to ' + capitalize(name));
    //execute callback
    cb(data.assignments);
  })
};

let displayWatchedBY = function(name, cb) {
  // save url to user from passed in name parameter
  let userUrl = 'http://m2.build-rest.net/json/users/' + name + '.json';
  // display bugs watched by user with callback execution
  $.getJSON(userUrl, function(data){
    $('.bug-colomn > h2 > small').html('Bugs watched by ' + capitalize(name));
    //execute callback
    cb(data.watching);
  })
};

let listBugsAssignedToOrWatchedBy = function(array) {
  // iterates over array parameter of bug urls
  for(let i = 0; i < array.length; i++) {
    $('.bugs-ul').append('<li class="list-group-item"></li>');

    let bugUrl = array[i];
    let child = i + 1;

    $.getJSON(bugUrl, function(data) {
      let bugItem = $('.list-group-item:nth-child(' + child + ')');
      bugItem.append('<h4><a href="' + array[i] + '">' + capitalize(data.title) + '</a></h4>')
      .append('<h5>' + capitalize(data.description) + '</h5>');
    })
  }
};

let displaySingleBug = function(bugUrl) {
  $.getJSON(bugUrl, function(data) {
    $('.bugs-ul').append('<li class="list-group-item"></li>');

    let bug = $('.list-group-item:nth-child(1)');

    bug.append('<h4><a>' + capitalize(data.title) + '</a></h4>')
    .append('<h5>' + capitalize(data.description) + '</h5>');
  })
};

$(document).ready(function() {
  // display bugs on inital page load
  listBugs('http://m2.build-rest.net/json/index.json', displayBugInfo);

  // function to display assigned to bugs
  $('.bugs-ul').delegate('a.assigned-to', 'click', function(){
    $('.bugs-ul').empty();
    let userName = $(this).html().toLowerCase();
    displayAssignedTo(userName, listBugsAssignedToOrWatchedBy);
  });

  // function to display watched by bugs
  $('.bugs-ul').delegate('a.watched-by', 'click', function(){
    $('.bugs-ul').empty();
    let userName = $(this).html().toLowerCase();
    displayWatchedBY(userName, listBugsAssignedToOrWatchedBy);
  });

  // function to display single bug and full info
  $('.bugs-ul').delegate('a.bug-title', 'click', function(){
    $('.bugs-ul').empty();
    let bugUrl = $(this).attr('id');
    displaySingleBug(bugUrl);
  });

  // function to reset dashboard
  $('.btn-primary').click(function(){
    location.reload();
  });
});
