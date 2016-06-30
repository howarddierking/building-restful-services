let websiteRoot = '/client-json';

let getResource = function(url, callback){
  $.getJSON(url, callback)
};

let getPipelines = function(url, callback){
  getResource(url, function(data) {
    callback(_.pick(data, 'backlog', 'inProgress'));
  });
};

let capitalize = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

let renderUser = function(user){
  return `<li class="list-group-item">
    <h4>${user.username}</h4>
    <h5>${user.email}</h5>
  </li>`;
};

let renderBugUser = function(roleStatement, user){
  return `<p>${roleStatement}: 
    <a href="${websiteRoot}/user.html#${encodeURI(user.self)}" class="${roleStatement.toLowerCase().replace(' ', '-')}">
      ${capitalize(user.username)}
    </a></p>`;
};

let renderBug = function(bug){
  return `<li class="list-group-item">
    <h4><a class="bug-title" href="${websiteRoot}/bug.html#${encodeURI(bug.self)}">
      ${capitalize(bug.title)}
    </a></h4>
    <h5>${capitalize(bug.description)}</h5>
    ${_.map(bug.assignedTo, _.partial(renderBugUser, 'Assigned to')).join('')}
    ${_.map(bug.watchedBy, _.partial(renderBugUser, 'Watched by')).join('')}
    </li>`;
};

let renderPipeline = function(pipeline, pipelineName){
  return `<div class="col-md-3 bug-column">
    <h2><small>${pipelineName}</small></h2>
    <ul class="bugs-ul list-group">
      ${_.map(pipeline, renderBug).join('')}
    </ul></div>`;
};
