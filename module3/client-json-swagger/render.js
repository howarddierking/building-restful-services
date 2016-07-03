let basePath = '/client-json-swagger';

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

let renderBug = function(bug){
  return client.default.get_bugs_bugId_swfr_json({bugId: bug.id})
  .then(function(response){
    return Q.fcall(function(){
      return `<li class="list-group-item">
        <h4>
          <a class="bug-title" href="${basePath}/bug.html#${bug.id}">${capitalize(response.obj.title)}</a>
        </h4>
        <h5>
          ${capitalize(response.obj.description)}
        </h5>`;
    })
    .then(function(m){
      return Q.all(response.obj.assignedTo.map(renderAssignee)).then(function(vals){
        return `${m}${vals.join('')}`;
      });
    })
    .then(function(m){
      return Q.all(response.obj.watchedBy.map(renderWatcher)).then(function(vals){
        return `${m}${vals.join('')}`;
      });
    })
    .then(function(m){
      return `${m}</li>`;
    });
  });
};      

let renderAssignee = function(assignee){
  return client.default.get_users_userId_swfr_json({ userId: assignee.id })
  .then(function(response){
    return `<p>Assigned to: 
    <a href="${basePath}/user.html#${assignee.id}" class="assigned-to">
      ${capitalize(response.obj.username)}
    </a></p>`;
  });
};

let renderWatcher = function(watcher){
  return client.default.get_users_userId_swfr_json({ userId: watcher.id })
  .then(function(response){
    return `<p>Watched by: 
    <a href="${basePath}/user.html#${watcher.id}" class="watched-by">
      ${capitalize(response.obj.username)}
    </a></p>`;
  });
}; 

let renderUser = function(user){
  return client.default.get_users_userId_swfr_json({ userId: user.id })
  .then(function(response){
    return `<li class="list-group-item">
      <h4>${response.obj.username}</h4>
      <h5>${response.obj.email}</h5>
    </li>`;
  });
}; 
