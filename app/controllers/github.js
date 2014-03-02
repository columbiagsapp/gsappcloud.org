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


exports.repos = function(callback){

	github.repos.getFromOrg({
    		// optional:
    		// headers: {
    		//     "cookie": "blahblah"
    		// },
    		org: "columbiagsapp"
	}, function(err, res) {
		console.log('res!!!!!!!:');
		console.dir(res);
		
		callback(res);		
/*
   		res.forEach(function(r){
			console.log(r.name);
			if(r.name == "Paris-Atelier"){
			console.log("Paris-Atelier!!!!!!!");
			

			github.repos.getContent({
                		user: "columbiagsapp",               
                		repo: r.name,
                		path: "screenshot.png",                  

        		}, function(err, res){
				console.log('\n\ngot a response!!!!!!!\n\n');
				
				console.dir(res);

                		res.forEach(function(r){
                        		console.log("\n\ngot a screenshot.png content:");
                        		console.log(r);
               			});
        		});


			
			}//end if paris atelier


    		});
*/

    		//console.log(JSON.stringify(res));
	});


	console.log('\n\nshould have started\n\n');

}//end export repos
