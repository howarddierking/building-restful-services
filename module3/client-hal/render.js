let websiteRoot = '/client-hal';

let capitalize = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

let renderPipeline = function(bugs, name){
  return Q.fcall(function(){
    return '<div class="col-md-3 bug-column"><h2><small>'
      .concat(name)
      .concat('</small></h2><ul class="bugs-ul list-group">')
  })
  .then(function(m){
    return Q.all(bugs.map(renderBug)).then(function(vals){
      return m.concat(vals.join(''));
    });
  })
  .then(function(m){
    return m.concat('</ul></div>');
  });
};

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
      .concat(websiteRoot + '/user.html#' + encodeURI(assigneeLink.href))
      .concat('" class="assigned-to">')
      .concat(capitalize(userResource.props.username))
      .concat('</a></p>');
  });
};

let renderWatcher = function(watcherLink){
  return watcherLink.fetch()
  .then(function(userResource){
    return '<p>Watched by: <a class="watched-by" href="'
      .concat(websiteRoot + '/user.html#' + encodeURI(watcherLink.href))
      .concat('">')
      .concat(capitalize(userResource.props.username))
      .concat('</a></p>');
  });
}; 
