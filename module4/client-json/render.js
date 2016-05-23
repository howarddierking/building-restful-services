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

let renderBugUser = function(roleStatement, user){
  return '<p>' + roleStatement + ': '
    .concat('<a href="' + websiteRoot + '/user.html#') + encodeURI(user.self) + '" class="' + roleStatement.toLowerCase().replace(' ', '-') + '">'
    .concat(capitalize(user.username) + '</a></p>');
};

let renderBug = function(bug){
  return '<li class="list-group-item">'
    .concat('<h4><a class="bug-title" href="' + websiteRoot + '/bug.html#' + encodeURI(bug.self) + '">')
    .concat(capitalize(bug.title))
    .concat('</a></h4><h5>')
    .concat(capitalize(bug.description))
    .concat('</h5>')
    .concat(_.map(bug.assignedTo, _.partial(renderBugUser, 'Assigned to')).join(''))
    .concat(_.map(bug.watchedBy, _.partial(renderBugUser, 'Watched by')).join(''))
    .concat('</li>');
};

let renderPipeline = function(pipeline, pipelineName){
  return '<div class="col-md-3 bug-column"><h2><small>'
    .concat(pipelineName)
    .concat('</small></h2><ul class="bugs-ul list-group">')
    .concat(_.map(pipeline, renderBug).join(''))
    .concat('</ul></div>');
};
