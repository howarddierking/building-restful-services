let websiteRoot = 'http://m2.build-rest.net/hal-json';

let capitalize = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// inline index.html functions

let inline = {};

inline.renderBugUser = function(roleStatement, user){
  return '<p>' + roleStatement + ': '
    .concat('<a href="' + websiteRoot + '/user.html#') + encodeURI(user.links.self.href) + '" class="' + roleStatement.toLowerCase().replace(' ', '-') + '">'
    .concat(capitalize(user.props.username) + '</a></p>');
};

inline.renderBug = function(bug){
  return '<li class="list-group-item">'
    .concat('<h4><a class="bug-title" href="' + websiteRoot + '/bug.html#' + encodeURI(bug.links.self.href) + '">')
    .concat(capitalize(bug.props.title))
    .concat('</a></h4><h5>')
    .concat(capitalize(bug.props.description))
    .concat('</h5>')
    .concat(_.map(bug.embedded.assignedTo, _.partial(inline.renderBugUser, 'Assigned to')).join(''))
    .concat(_.map(bug.embedded.watchedBy, _.partial(inline.renderBugUser, 'Watched by')).join(''))
    .concat('</li>');
};

inline.renderPipeline = function(pipeline, pipelineName){
  return '<div class="col-md-3 bug-column"><h2><small>'
    .concat(pipelineName)
    .concat('</small></h2><ul class="bugs-ul list-group">')
    .concat(_.map(pipeline, inline.renderBug).join(''))
    .concat('</ul></div>');
};

// original functions

let renderBug = function(bugLink){
  return bugLink.fetch()
  .then(function(bugResource){
    
    return Q.fcall(function(){
      return '<li class="list-group-item">'
        .concat('<h4><a class="bug-title" href="')
        .concat(websiteRoot + '/bug.html#' + encodeURI(bugLink.href))
        .concat('">')
        .concat(capitalize(bugResource.props.title))
        .concat('</a></h4><h5>')
        .concat(capitalize(bugResource.props.description))
        .concat('</h5>');
    })
    .then(function(m){
      return Q.all(bugResource.links.assignedTo.map(renderAssignee)).then(function(vals){
        return m.concat(vals.join(''));
      });
    })
    .then(function(m){
      return Q.all(bugResource.links.watchedBy.map(renderWatcher)).then(function(vals){
        return m.concat(vals.join(''));
      });
    })
    .then(function(m){
      return m.concat('</li>');
    });
  });
};

let renderUser = function(userLink){
  return userLink.fetch()
  .then(function(userResource){
    return '<li class="list-group-item">'
      .concat('<h4>' + userResource.props.username + '</h4>')
      .concat('<h5>' + userResource.props.email + '</h5>')
      .concat('</li>')
  })
}; 

let renderAssignee = function(assigneeLink){
  return assigneeLink.fetch()
  .then(function(userResource){
    return '<p>Assigned to: <a href="'
      .concat(websiteRoot + 'user.html#' + encodeURI(assigneeLink.href))
      .concat('" class="assigned-to">')
      .concat(capitalize(userResource.props.username))
      .concat('</a></p>');
  });
};

let renderWatcher = function(watcherLink){
  return watcherLink.fetch()
  .then(function(userResource){
    return '<p>Watched by: <a class="watched-by" href="'
      .concat(websiteRoot + 'user.html#' + encodeURI(watcherLink.href))
      .concat('">')
      .concat(capitalize(userResource.props.username))
      .concat('</a></p>');
  });
};
