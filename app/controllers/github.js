var GitHubApi = require("github");
var markdown = require("markdown").markdown;

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

/*
exports.getRepo = function(repoName, callback){
    

    github.repos.getReadme({
        user: "columbiagsapp",               
        repo: repoName,   

    }, function(err, readme){
        if(err){
            callback("Github API error: get readme");
        }else{
            console.log('\n\n\nreadme for repo: ' + current_repo.name);
            
            //convert cloudinfo.content base64 encoded into string
            var readme_json = new Buffer(readme.content, 'base64').toString();
            readme_json = JSON.parse(readme_json);//convert to JSON object
            
            console.dir(readme_json);

            current_repo.readme = readme_json;//add cloudinfo attribute to repo
            cloudinfo_count++;
        }
        if(cloudinfo_count >= repos_array.length){
            callback(null, repos_array);
        }
    });
}
*/


exports.getRepos = function(callback){

	github.repos.getFromOrg({
    		org: "columbiagsapp"
	}, function(err, repos_array) {
        var count = 0;
        var repos_count = repos_array.length;

        if(err){
            callback("Github API error: get repositories from organization");
        }else{

            console.log('\n\n\n\nTHIS IS THE repos_array.length: '+ repos_array.length + '\n\n\n\n');
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

                            console.log('\n\n\n\n***************');
                            console.log('count: ' + count);
                            console.log('repo with cloudinfo.json file: '+ callback_array[callback_array.length-1].name);
                            console.log('***************\n\n\n\n');

                            //convert cloudinfo.content base64 encoded into string
                            var cloudinfo_json = new Buffer(cloudinfo.content, 'base64').toString();
                            cloudinfo_json = JSON.parse(cloudinfo_json);//convert to JSON object

                            //add cloudinfo attribute to repo
                            callback_array[callback_array.length-1].cloudinfo = cloudinfo_json;
                        }
                        count++;

                        console.log('count: ' + count);
                        console.log('callback_array.length: '+ callback_array.length + '\n\n');
                        if(count >= repos_count){
                            callback(null, callback_array);
                        }
                    });

                })(r);

                    
            }//end for all repos

        }//end if no err

	});


}//end export getRepos
