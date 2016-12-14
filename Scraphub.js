var keystone = require('keystone');
var Promise = require('bluebird');
var ScrapHub = module.exports = {};

var Client = Promise.promisifyAll(require('node-rest-client').Client);
var client = new Client();

var args = {
    headers: { "Accept": "application/json" }
};

var getLatestJobId = function(apiKey, callback){
	var url = jobApiEndPoint(apiKey);
	console.log(url);

	client.get(url, args, function (data, response) {
		if(!data) {
	      	callback("{error: true}");
	    } else {
	      	callback(null, data);
	    }
	});

}

ScrapHub.itemApiEndPoint = function(apiKey, callback){
	var endpoint = process.env.SCRAPHUB_ITEM_API;
	endpoint = endpoint.replace('{ApiKey}', apiKey);
	
	getLatestJobId(apiKey, function(err, data){
		if (data && data.jobs){
			endpoint = endpoint.replace('{JobId}', data.jobs[0].id);
			console.log('itemApiEndPoint: ' + endpoint);
		}

		if(!data) {
	      	callback(err);
	    } else {
	      	callback(null, endpoint);
	    }
	})
	

}

var jobApiEndPoint = function(apiKey){
	var endpoint = process.env.SCRAPHUB_JOB_API;
	endpoint = endpoint.replace('{ProjectId}', process.env.LYRICS_PROJECT);
	endpoint = endpoint.replace('{ApiKey}', apiKey);
	endpoint = endpoint.replace('{Spider}', process.env.LYRICS_SPIDER);
	endpoint = endpoint.replace('{Count}', 1);

	return endpoint;
}