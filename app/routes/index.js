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


exports.submit = function(req, res){

	res.render('submit', { title: 'Submit a repo name' });

}

exports.addRepo = function(req, res){

	console.dir(req);

	var name = req.body.name; 

	githubAPI.addRepo(res, name, function(err, message){
		if(err){
			res.send('500', 'Server error trying to add repo: ' + message);
		}else{
			res.send('200', message);
		}
	});

}

