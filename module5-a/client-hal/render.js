let websiteRoot = '/client-hal';

let capitalize = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

let renderBugUser = function(roleStatement, user){
  return `<p>${roleStatement}: 
    <a href="${websiteRoot}/user.html#${encodeURI(user.links.self.href)}" class="${roleStatement.toLowerCase().replace(' ', '-')}">
      ${capitalize(user.props.username)}
    </a></p>`;
};

let renderUser = function(user){
  return `<li class="list-group-item">
    <h4>${user.props.username}</h4>
    <h5>${user.props.email}</h5>
  </li>`;
};

let renderBug = function(bug){
  return `<li class="list-group-item">
      <h4><a class="bug-title" href="${websiteRoot}/bug.html#${encodeURI(bug.links.self.href)}">
      ${capitalize(bug.props.title)}
      </a></h4>
      <h5>${capitalize(bug.props.description)}</h5>
      ${_.map(bug.embedded.assignedTo, _.partial(renderBugUser, 'Assigned to')).join('')}
      ${_.map(bug.embedded.watchedBy, _.partial(renderBugUser, 'Watched by')).join('')}
    </li>`;
};

let renderPipeline = function(pipeline, pipelineName){
  return `<div class="col-md-3 bug-column">
    <h2><small>${pipelineName}</small></h2>
    <ul class="bugs-ul list-group">
      ${_.map(pipeline, renderBug).join('')}
    </ul>
  </div>`;
};
