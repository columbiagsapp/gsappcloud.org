var GitHubApi = require("github");
var markdown = require("markdown").markdown;


var mongoose = require('mongoose'),
    Repo = require('../models/repo'),
    _ = require('lodash');


// Add new repo to database
exports.addRepo = function(res, name, callback){
    var repo = new Repo();
    repo.name = name;
    repo.downloads = 0;
    repo.added_time = new Date().getTime();

    repo.save(function(err) {
        if (err) {
            console.log('error attempting to save new repo');

            callback('error attempting to save new repo');
        } else {
            console.log('added new repo to database');

            callback(null, 'Successfully added repository');
        }
    });

};



console.log( markdown.toHTML( "Hello *World*!" ) );

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    debug: true,
    protocol: "https",
    //host: "api.github.com",
    //pathPrefix: "/api/v3", // for some GHEs
    timeout: 5000
});

// OAuth2 Key/Secret
github.authenticate({
    type: "oauth",
    key: "64be49db1055afb28914",
    secret: "a7b513953467c7db28f05b8722724d355b2647c2"
});


exports.getRepo = function(repoName, callback){

    console.log('\n\n\n\n\n*******************');
    console.log('entering getRepo()');
    console.log('*******************\n\n\n\n\n');

    github.repos.getReadme({
        user: "columbiagsapp",               
        repo: repoName,   

    }, function(err, readme){
        if(err){
            callback("Github API error: get readme");
        }else{
            console.log('\n\n\nreadme for repo: ' + repoName);
            
            //convert cloudinfo.content base64 encoded into string
            var readme_md = new Buffer(readme.content, 'base64').toString();
            
            console.dir(readme_md);

            var readme_html = markdown.toHTML( readme_md );


            //get the cloudinfo.json file to
            //return other metadata
            github.repos.getContent({
                user: "columbiagsapp",               
                repo: repoName,
                path: "cloudinfo.json",     

            }, function(err, cloudinfo){
                if(err){
                    //if no cloudinfo.json file, callback without a url
                    callback(null, readme_html);
                }else{
                    

                    //convert cloudinfo.content base64 encoded into string
                    var cloudinfo_json = new Buffer(cloudinfo.content, 'base64').toString();
                    cloudinfo_json = JSON.parse(cloudinfo_json);//convert to JSON object

                    console.log('\n\n\n\n\n\n\nURL: ' + cloudinfo_json.url);

                    callback(null, readme_html, cloudinfo_json.url);
                }
            });
        }
    });

}



exports.getRepos = function(callback){
    var returned = false;//flag set true once callback called

	github.repos.getFromOrg({
    		org: "columbiagsapp",
            per_page: "10000"
	}, function(err, repos_array) {
        var count = 0;
        var repos_count = repos_array.length;

        if(err){
            callback("Github API error: get repositories from organization");
        }else{
		


		console.log('\n\n\nTHIS IS THE REPOS ARRAY:\n\n\n');
		console.dir(repos_array);

            //console.log('\n\n\n\nTHIS IS THE repos_array.length: '+ repos_array.length + '\n\n\n\n');
            var callback_array = [];

       		for(var r = 0; r < repos_array.length; r++){
                (function(r) {

                    github.repos.getContent({
                        user: "columbiagsapp",               
                        repo: repos_array[r].name,
                        path: "cloudinfo.json",     

                    }, function(err, cloudinfo){
                        if(err){
                            //if no cloudinfo.json file, do nothing
                        }else{
                            callback_array.push( repos_array[r] );

                            //convert cloudinfo.content base64 encoded into string
                            var cloudinfo_json = new Buffer(cloudinfo.content, 'base64').toString();
                            cloudinfo_json = JSON.parse(cloudinfo_json);//convert to JSON object

                            //add cloudinfo attribute to repo
                            callback_array[callback_array.length-1].cloudinfo = cloudinfo_json;
                        }
                        count++;

                        if(count >= repos_count){
                            returned = true;
                            callback(null, callback_array);
                        }
                    });
                })(r);//end of anonymous function
                    
            }//end for all repos

            //if doesn't return after 15s, send error
            setTimeout(function(){
                if(returned == false){
                    callback("Github API error: repo timeout");
                }
            }, 15000);

        }//end if no err

	});


}//end export getRepos
