let websiteRoot = '/client-hal';

let capitalize = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

let renderBugUser = function(roleStatement, user){
  return '<p>' + roleStatement + ': '
    .concat('<a href="' + websiteRoot + '/user.html#') + encodeURI(user.links.self.href) + '" class="' + roleStatement.toLowerCase().replace(' ', '-') + '">'
    .concat(capitalize(user.props.username) + '</a></p>');
};

let renderBug = function(bug){
  return '<li class="list-group-item">'
    .concat('<h4><a class="bug-title" href="' + websiteRoot + '/bug.html#' + encodeURI(bug.links.self.href) + '">')
    .concat(capitalize(bug.props.title))
    .concat('</a></h4><h5>')
    .concat(capitalize(bug.props.description))
    .concat('</h5>')
    .concat(_.map(bug.embedded.assignedTo, _.partial(renderBugUser, 'Assigned to')).join(''))
    .concat(_.map(bug.embedded.watchedBy, _.partial(renderBugUser, 'Watched by')).join(''))
    .concat('</li>');
};

let renderPipeline = function(pipeline, pipelineName){
  return '<div class="col-md-3 bug-column"><h2><small>'
    .concat(pipelineName)
    .concat('</small></h2><ul class="bugs-ul list-group">')
    .concat(_.map(pipeline, renderBug).join(''))
    .concat('</ul></div>');
};
