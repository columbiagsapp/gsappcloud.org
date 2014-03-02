var GitHubApi = require("github");

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
})


exports.getRepos = function(callback){

	github.repos.getFromOrg({
    		org: "columbiagsapp"
	}, function(err, repos) {
        var cloudinfo_count = 0;
        var repos_array = repos;

        if(err){
            callback("Github API error: get repositories from organization");
        }else{

       		for(var r = 0; r < repos.length; r++){
                var current_repo = repos[r];
    			console.log(current_repo.name);
    			
    			github.repos.getContent({
            		user: "columbiagsapp",               
            		repo: current_repo.name,
            		path: "cloudinfo.json",     

        		}, function(err, cloudinfo){
                    if(err){
                        cloudinfo_count++;
                    }else{
        			    console.log('\n\n\ncloudinfo for repo: ' + current_repo.name);
        			    
                        //convert cloudinfo.content base64 encoded into string
                        var cloudinfo_json = new Buffer(cloudinfo.content, 'base64').toString();
                        cloudinfo_json = JSON.parse(cloudinfo_json);//convert to JSON object
                        
                        console.dir(cloudinfo_json);

                        current_repo.cloudinfo = cloudinfo;//add cloudinfo attribute to repo
                        cloudinfo_count++;
                    }
                    if(cloudinfo_count >= repos_array.length){
                        callback(null, repos_array);
                    }
        		});
            }//end for all repos

        }//end if no err

	});


	console.log('\n\nshould have started\n\n');

}//end export getRepos
