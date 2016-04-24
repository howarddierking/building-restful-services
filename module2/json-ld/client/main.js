'use strict';

let websiteRoot = 'http://m2.build-rest.net/json-ld';

let extractID = function(val){
  return _.isObject(val) ? val['@id'] : val;
};

let capitalize = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// original functions

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

// inline index.html functions

let inline = {};

inline.renderBugUser = function(roleStatement, user){
  return '<p>' + roleStatement + ': '
    .concat('<a href="' + websiteRoot + '/user.html#') + encodeURI(extractID(user)) + '" class="' + roleStatement.toLowerCase().replace(' ', '-') + '">'
    .concat(capitalize(user.username) + '</a></p>');
};

inline.renderBug = function(bug){
  return '<li class="list-group-item">'
    .concat('<h4><a class="bug-title" href="' + websiteRoot + '/bug.html#' + encodeURI(extractID(bug)) + '">')
    .concat(capitalize(bug.title))
    .concat('</a></h4><h5>')
    .concat(capitalize(bug.description))
    .concat('</h5>')
    .concat(_.map(bug.assignedTo, _.partial(inline.renderBugUser, 'Assigned to')).join(''))
    .concat(_.map(bug.watchedBy, _.partial(inline.renderBugUser, 'Watched by')).join(''))
    .concat('</li>');
};

inline.renderPipeline = function(pipeline, pipelineName){
  return '<div class="col-md-3 bug-column"><h2><small>'
    .concat(pipelineName)
    .concat('</small></h2><ul class="bugs-ul list-group">')
    .concat(_.map(pipeline, inline.renderBug).join(''))
    .concat('</ul></div>');
};
