var githubAPI = require("../controllers/github");

exports.index = function(req, res){

  	githubAPI.getRepos(function(err, rs){
		res.render('index', { title: 'GSAPP Cloud Communications', err: err, repos: rs });
	});

};

exports.repo = function(req, res){

	console.dir(req);

	var repoName = "gsapp.events.org";

  	githubAPI.getRepo(repoName, function(err, content){
		res.render('repo', { 
			title: 'GSAPP Cloud Communications',
			err: err,
			name: repoName,
			content: content
		});
	});

};

