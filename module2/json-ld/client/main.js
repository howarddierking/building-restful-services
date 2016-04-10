'use strict';
let extractID = function(val){
  return _.isObject(val) ? val['@id'] : val;
};

let getResource = function(url, callback){
  $.getJSON(url, callback)
};

let getBug = getResource;
let getUser = getResource;

let getPipelines = function(url, callback){
  getResource(url, function(data) {
    callback(_.pick(data, 'backlog', 'inProgress'));
  });
};

let capitalize = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

let displayUserDetail = function(userUrl, callback){
  getUser(userUrl, function(user){
    let userHeader = [
      '<li class="list-group-item">', 
      '<h4>' + user.username + '</h4>',
      '<h5>' + user.email + '</h5>'
    ].join('');

    let userFooter = '</li>';
    callback(null, [ userHeader, userFooter ].join(''));
  });
};

let displayBug = function(bugUrl, callback){
  let websiteRoot = 'http://m2.build-rest.net/json-ld';
  getBug(extractID(bugUrl), function(bug){
    async.series({
      assignedTo: function(callback){
        async.map(bug.assignedTo, 
          function(userUrl, mapCallback){
            getUser(extractID(userUrl), function(user){
              mapCallback(null, '<p>Assigned to: <a href="' + websiteRoot.concat('/user.html#').concat(encodeURI(extractID(userUrl))) + '" class="assigned-to">' + capitalize(user.username) + '</a></p>');
            });
          }, 
          function(err, results){
            callback(null, results.join(''));
          })
      },
      watchedBy: function(callback){
        async.map(bug.watchedBy, 
          function(userUrl, mapCallback){
            getUser(extractID(userUrl), function(user){
              mapCallback(null, '<p>Watched by: <a class="watched-by" href="' + websiteRoot.concat('/user.html#').concat(encodeURI(extractID(userUrl))) + '">' + capitalize(user.username) + '</a></p>');
            });
          }, 
          function(err, results){
            callback(null, results.join(''));
          })
      }
    },
    function(err, results){
      let bugHeader = ['<li class="list-group-item">',
        '<h4><a class="bug-title" href="' + websiteRoot.concat('/bug.html#').concat(encodeURI(extractID(bugUrl))) + '">',
        capitalize(bug.title),
        '</a></h4><h5>',
        capitalize(bug.description),
        '</h5>'].join('');

      let bugFooter = '</li>';

      callback(null, [ bugHeader, results.assignedTo, results.watchedBy, bugFooter ].join(''));
    });
  });
};
