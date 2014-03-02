var Gh = require("../controllers/github");

exports.index = function(req, res){

  	var renderRepos = Gh.repos(function(rs){
		res.render('index', { title: 'GSAPP Cloud Communications', repos: rs });
	});

};


