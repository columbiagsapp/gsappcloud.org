var githubAPI = require("../controllers/github");

exports.index = function(req, res){

  	githubAPI.getRepos(function(err, rs){
		res.render('index', { title: 'GSAPP Cloud Communications', err: err, repos: rs });
	});

};

exports.repo = function(req, res){

	var repoName = req.params.repo;

  	githubAPI.getRepo(repoName, function(err, content, url){
		res.render('repo', { 
			title: 'GSAPP Cloud Communications',
			err: err,
			name: repoName,
			content: content,
			url: url
		});
	});

};

