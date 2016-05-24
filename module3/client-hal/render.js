let websiteRoot = '/client-hal';

let capitalize = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

let renderPipeline = function(bugs, name){
  return Q.fcall(function(){
    return `<div class="col-md-3 bug-column">
  <h2><small>${name}</small></h2>
  <ul class="bugs-ul list-group">`;
  })
  .then(function(m){
    return Q.all(bugs.map(renderBug)).then(function(vals){
      return `${m}${vals.join('')}`;
    });
  })
  .then(function(m){
    return `${m}</ul></div>`;
  });
};

let renderBug = function(bugLink){
  return bugLink.fetch()
  .then(function(bugResource){
    
    return Q.fcall(function(){
      return `<li class="list-group-item">
  <h4>
    <a class="bug-title" href="${websiteRoot}/bug.html#${encodeURI(bugLink.href)}">${capitalize(bugResource.props.title)}</a>
  </h4>
  <h5>
    ${capitalize(bugResource.props.description)}
  </h5>`;
    })
    .then(function(m){
      return Q.all(bugResource.links.assignedTo.map(renderAssignee)).then(function(vals){
        return `${m}${vals.join('')}`;
      });
    })
    .then(function(m){
      return Q.all(bugResource.links.watchedBy.map(renderWatcher)).then(function(vals){
        return `${m}${vals.join('')}`;
      });
    })
    .then(function(m){
      return `${m}</li>`;
    });
  });
};

let renderUser = function(userLink){
  return userLink.fetch()
  .then(function(userResource){
    return `<li class="list-group-item">
  <h4>${userResource.props.username}</h4>
  <h5>${userResource.props.email}</h5>
</li>`;
  });
}; 

let renderAssignee = function(assigneeLink){
  return assigneeLink.fetch()
  .then(function(userResource){
    return `<p>Assigned to: 
    <a href="${websiteRoot}/user.html#${encodeURI(assigneeLink.href)}" class="assigned-to">
      ${capitalize(userResource.props.username)}
    </a></p>`;
  });
};

let renderWatcher = function(watcherLink){
  return watcherLink.fetch()
  .then(function(userResource){
    return `<p>Watched by: 
    <a href="${websiteRoot}/user.html#${encodeURI(watcherLink.href)}" class="watched-by">
      ${capitalize(userResource.props.username)}
    </a></p>`;
  });
}; 
