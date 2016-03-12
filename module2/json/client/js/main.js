'use strict';

let bugsIndex = 'http://m2.build-rest.net/json/index.json';

let getResource = function(url, callback){
  $.getJSON(url, callback)
};

let getBug = getResource;
let getPerson = getBug;

let getPipelines = function(url, callback){
  getResource(url, function(data) {
    callback(_.pick(data, 'backlog', 'inProgress'));
  });
};

// superceded by render pipeline
// let listBugs = function(url, cb) {
  

//     // declare variable that will be used and passed later
//     let child;
//     // Iterate over array, and display each bug and execute callback
//     for(let i = 0; i < bugsArray.length; i++) {
//       $('.bugs-ul').append('<li class="list-group-item"></li>');
//       // Execute callback with bug link and child
//       child = i + 1;
//       cb(bugsArray[i], child);
//     }
//   });
// };


// // superceded by rednerPipelineBug
// let displayBugInfo = function(url, child) {
//   // Get json file
//   $.getJSON(url, function(data){
//     // Target li element
//     let bugItem = $('.list-group-item:nth-child(' + child + ')');
//     // Display bug title and bug description
//     bugItem.append('<h4><a class="bug-title" id="' + url + '">' + capitalize(data.title) + '</a></h4>')
//     .append('<h5>' + capitalize(data.description) + '</h5>');
//     // save assignedTo users array to variable
//     let assignedToArray = data.assignedTo;
//     // iterate over assignedToArray and display users this bug is assigned to
//     assignedToArray.forEach(function(personURL) {
//       $.getJSON(personURL, function(data){
//         bugItem.append('<p>Assigned to: <a class="assigned-to">' + capitalize(data.username) + '</a></p>');
//       })
//     });
//     // save watchedBy users array to variable
//     let watchedByArray = data.watchedBy;
//     // iterate over watchedByArray and display users this bug is watched by
//     watchedByArray.forEach(function(personURL) {
//       $.getJSON(personURL, function(data){
//         bugItem.append('<p>Watched by: <a class="watched-by">' + capitalize(data.username) + '</a></p>');
//       })
//     });
//   })
// };

let capitalize = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// let displayAssignedTo = function(name, cb) {
//   // save url to user from passed in name parameter
//   let userUrl = 'http://m2.build-rest.net/json/users/' + name + '.json';
//   // display bugs assigned to user with callback execution
//   $.getJSON(userUrl, function(data){
//     $('.bug-colomn > h2 > small').html('Bugs assigned to ' + capitalize(name));
//     //execute callback
//     cb(data.assignments);
//   })
// };

// let displayWatchedBY = function(name, cb) {
//   // save url to user from passed in name parameter
//   let userUrl = 'http://m2.build-rest.net/json/users/' + name + '.json';
//   // display bugs watched by user with callback execution
//   $.getJSON(userUrl, function(data){
//     $('.bug-colomn > h2 > small').html('Bugs watched by ' + capitalize(name));
//     //execute callback
//     cb(data.watching);
//   })
// };

// let listBugsAssignedToOrWatchedBy = function(array) {
//   // iterates over array parameter of bug urls
//   for(let i = 0; i < array.length; i++) {
//     $('.bugs-ul').append('<li class="list-group-item"></li>');

//     let bugUrl = array[i];
//     let child = i + 1;

//     $.getJSON(bugUrl, function(data) {
//       let bugItem = $('.list-group-item:nth-child(' + child + ')');
//       bugItem.append('<h4><a href="' + array[i] + '">' + capitalize(data.title) + '</a></h4>')
//       .append('<h5>' + capitalize(data.description) + '</h5>');
//     })
//   }
// };

// let displaySingleBug = function(bugUrl) {
//   $.getJSON(bugUrl, function(data) {
//     $('.bugs-ul').append('<li class="list-group-item"></li>');

//     let bug = $('.list-group-item:nth-child(1)');

//     bug.append('<h4><a>' + capitalize(data.title) + '</a></h4>')
//     .append('<h5>' + capitalize(data.description) + '</h5>');
//   })
// };

$(document).ready(function() {
  let container = $('#pipelines');

  getPipelines(bugsIndex, function(pipelines){
    _.each(pipelines, function(pipeline, key){
      // pipeline markup container head
      let pipelineMarkup = ['<div class="col-md-3 bug-colomn"><h2><small>', 
        key, 
        '</small></h2><ul class="bugs-ul list-group">'].join("");

      // pipeline bugs
      async.map(pipeline, function(bugUrl, callback){
        getBug(bugUrl, function(bug){
          // bug header
          let bugMarkup = ['<li class="list-group-item">',
            '<h4><a class="bug-title" id="' + bugUrl + '">',
            capitalize(bug.title),
            '</a></h4><h5>',
            capitalize(bug.description),
            '</h5>'].join("");

          async.series({
            assignedTo: function(callback){
              async.reduce(bug.assignedTo, "", function(memo, assignmentUrl, iterationComplete){
                getPerson(assignmentUrl, function(person){
                  let assignmentMarkup = [memo, 
                    '<p>Assigned to: <a class="assigned-to">',
                    capitalize(person.username),
                    '</a></p>'].join("");
                  iterationComplete(null, assignmentMarkup);
                });
              }, callback);
            }, 
            watchedBy: function(callback){
              async.reduce(bug.watchedBy, "", function(memo, watchedByUrl, iterationComplete){
                getPerson(watchedByUrl, function(person){
                  let watchedByMarkup = [memo, 
                    '<p>Watched by: <a class="watched-by">',
                    capitalize(person.username),
                    '</a></p>'].join("");
                  iterationComplete(null, watchedByMarkup);
                });
              }, callback);
            }
          },
          function(err, results){
            bugMarkup = [bugMarkup,
              results.assignedTo,
              results.watchedBy, 
              '</li>'].join('');
            callback(null, bugMarkup);
          });
        });
      }, function(err, results){
        // pipeline markup container tail
        pipelineMarkup = [pipelineMarkup, 
          _.reduce(results, function(memo, r){ return memo.concat(r) }),
          '</ul></div>'].join("");

        container.append(pipelineMarkup); 
      });      
    });
  });


  // // display bugs on inital page load
  // listBugs(bugsIndex, displayBugInfo);

  // // function to display assigned to bugs
  // $('.bugs-ul').delegate('a.assigned-to', 'click', function(){
  //   $('.bugs-ul').empty();
  //   let userName = $(this).html().toLowerCase();
  //   displayAssignedTo(userName, listBugsAssignedToOrWatchedBy);
  // });

  // // function to display watched by bugs
  // $('.bugs-ul').delegate('a.watched-by', 'click', function(){
  //   $('.bugs-ul').empty();
  //   let userName = $(this).html().toLowerCase();
  //   displayWatchedBY(userName, listBugsAssignedToOrWatchedBy);
  // });

  // // function to display single bug and full info
  // $('.bugs-ul').delegate('a.bug-title', 'click', function(){
  //   $('.bugs-ul').empty();
  //   let bugUrl = $(this).attr('id');
  //   displaySingleBug(bugUrl);
  // });

  // // function to reset dashboard
  // $('.btn-primary').click(function(){
  //   location.reload();
  // });
});
