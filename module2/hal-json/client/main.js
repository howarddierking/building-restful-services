'use strict';

let capitalize = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

let getResource = function(url) {
  let api = new Hyperagent.Resource(url);
  return api.fetch().then(function(root) {
    return root.links.bugs;
  });
};

let getBugInfo = function(array) {
  let bugUrlArray = [];
  array.forEach(function(bugUrl){
    let bug = new Hyperagent.Resource(bugUrl.props.href);
    bugUrlArray.push(bug.fetch());
  });
  return bugUrlArray;
};

let getWatchedByOrAssignedTo = function(array) {
  return Promise.all(array.map(function(userUrl){
    let api = new Hyperagent.Resource(userUrl.props.href);
    return api.fetch().then(function(userArray) {
      return userArray;
    });
  }));
};

let buildBugDash = function(promiseArray) {
  promiseArray.forEach(function(bugPromise, index){
    Promise.resolve(bugPromise).then(function(bug){
      $('.bugs-ul').append('<li class="list-group-item"></li>');
      let bugItem = $('.list-group-item:nth-child(' + (index + 1) + ')');
      bugItem.append('<h4><a class="bug-title">' + capitalize(bug.props.title) + '</a></h4>')
      .append('<h5>' + capitalize(bug.props.description) + '</h5>');

      Promise.resolve(getWatchedByOrAssignedTo(bug.links.assignedTo)).then(function(userArray){
        userArray.forEach(function(user) {
          bugItem.append('<p>Assigned to: <a class="assigned-to">' + capitalize(user.props.username) + '</a></p>');
        });
      });

      Promise.resolve(getWatchedByOrAssignedTo(bug.links.watchedBy)).then(function(userArray){
        userArray.forEach(function(user) {
          bugItem.append('<p>Watched by: <a class="watched-by">' + capitalize(user.props.username) + '</a></p>');
        });
      });
    });
  });
};

$(document).ready(function() {
  getResource('http://m2.build-rest.net/hal-json/index.json').then(function(bugs){
    return getBugInfo(bugs);
  }).then(function(promiseArray){
    buildBugDash(promiseArray);
  });
});
