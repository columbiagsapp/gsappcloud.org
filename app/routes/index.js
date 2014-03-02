var githubAPI = require("../controllers/github");

exports.index = function(req, res){

  	var renderRepos = githubAPI.getRepos(function(err, rs){
		res.render('index', { title: 'GSAPP Cloud Communications', err: err, repos: rs });
	});

};


