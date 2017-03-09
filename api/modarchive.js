var ModArchive = (function(){

	const https = require('https');
	var config   = require('./config');
	var parseXml = require('xml2js').parseString;

	var me = {};

	var baseUrl = "https://api.modarchive.org/xml-tools.php?key=" + config.modArchiveApiKey + "&request=";

	me.browseByRating = function(res){
		getModArchiveResult("view_by_rating_comments&query=10",res);
	};

	me.random = function(res){
		getModArchiveResult("random",res);
	};

	function getModArchiveResult(url,res){
		url = baseUrl + url;
		// filter only 4 channel mods
		url += "&format=mod&channels=4-4";
		https.get(url,function(modArchiveResponse){
			var xml = '';
			modArchiveResponse.on('data', function(chunk) {
				xml += chunk;
			});

			modArchiveResponse.on('end', function() {
				parseXml(xml,{explicitArray: false},function(err,result){
					if (result.modarchive && result.modarchive.sponsor) delete result.modarchive.sponsor;
					res.writeHead(200, {'Content-Type': 'application/json'});
					res.end(JSON.stringify(result));
				});
			});
		});
	}

	return me;

}());

module.exports = ModArchive;

