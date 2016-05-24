let websiteRoot = '/client-json';

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
    let val = `<li class="list-group-item">
  <h4>${user.username}</h4>
  <h5>${user.email}</h5>
</li>`;

    callback(null, val);
  });
};

let displayBug = function(bugUrl, callback){
  getBug(bugUrl, function(bug){
    async.series({
      assignedTo: function(callback){
        async.map(bug.assignedTo, 
          function(userUrl, mapCallback){
            getUser(userUrl, function(user){
              mapCallback(null, `<p>Assigned to: <a href="${websiteRoot}/user.html#${encodeURI(userUrl)}" class="assigned-to">${capitalize(user.username)}</a></p>`);
            });
          }, 
          function(err, results){
            callback(null, results.join(''));
          })
      },
      watchedBy: function(callback){
        async.map(bug.watchedBy, 
          function(userUrl, mapCallback){
            getUser(userUrl, function(user){
              mapCallback(null, `<p>Watched by: <a class="watched-by" href="${websiteRoot}/user.html#${encodeURI(userUrl)}">${capitalize(user.username)}</a></p>`);
            });
          }, 
          function(err, results){
            callback(null, results.join(''));
          })
      }
    },
    function(err, results){
      let val = `<li class="list-group-item">
  <h4>
    <a class="bug-title" href="${websiteRoot}/bug.html#${encodeURI(bugUrl)}">${capitalize(bug.title)}</a>
  </h4>
  <h5>
    ${capitalize(bug.description)}
  </h5>
  ${results.assignedTo}
  ${results.watchedBy}
</li>`;

      callback(null, val);
    });
  });
};      
