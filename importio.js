var keystone = require('keystone');
var ImportIO = module.exports = {};

ImportIO.parseEndPoint = function(url, extractorId, apiKey){
	var endpoint = process.env.IMPORTIO_API;
	if (!apiKey){
		apiKey = process.env.IMPORTIO_API_KEY
	}

	endpoint = endpoint.replace('{extractorId}', extractorId);
	endpoint = endpoint.replace('{url}', url);
	endpoint = endpoint.replace('{apiKey}', apiKey);

	endpoint = "https://extraction.import.io/query/extractor/e5f6cd3c-c4e9-4572-9194-f02ae76b9906?_apikey=89b8907c19c44783ba039cdd75fffe55f046d8fdae50dafd5e46d61fb675305d98ba0bbf9f59b64c2a1a0e8ab351be97b7f79aaac2220af4f3dbdb48a78b11992ccf0ebdf078914f8003537bb74c1c22&url=" + url;
	return endpoint;
}

ImportIO.staticEndPoint = function(extractorId, apiKey){
	var endpoint = process.env.IMPORTIO_STATIC;
	if (!apiKey){
		apiKey = process.env.IMPORTIO_API_KEY
	}

	endpoint = endpoint.replace('{extractorId}', extractorId);
	endpoint = endpoint.replace('{apiKey}', apiKey);


	return endpoint;
}