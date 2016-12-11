var keystone = require('keystone');
var CronJob = require('cron').CronJob;
var cron = module.exports = {};

var Client = require('node-rest-client').Client;
var client = new Client();

var args = {
    headers: { "Accept": "application/json" }
};


var createTheatre = function(name, url){
    var Theatre = keystone.list('Theatre');

    Theatre.model.update({name: name}, {sourceUrl: url}, {upsert: true}, function(err, doc){
        if(err){
            console.log("Something wrong when updating data!");
        }

        console.log(doc);
    });
}

var createShow = function(name, url){
    var Show = keystone.list('Show');

    Show.model.update({name: name}, {sourceUrl: url}, {upsert: true}, function(err, doc){
        if(err){
            console.log("Something wrong when updating data!");
        }

        console.log(doc);
    });
}

var createProduction = function(name, url){
    var Production = keystone.list('Production');
    console.log("Updating " + url);

    Production.model.update({name: name}, {sourceUrl: url}, {upsert: true}, function(err, doc){
        if(err){
            console.log(err);
        }
        console.log(doc);
    });
}

var createProduction = function(show){
    var Production = keystone.list('Production');
    var Theatre = keystone.list('Theatre');

    console.log("Updating " + show.url);
    show.theatre = Theatre.model.find().where('name', show.theatre);

    Production.model.update({name: show.name}, show, {upsert: true}, function(err, doc){
        if(err){
            console.log(err);
        }
        console.log(doc);
    });
}

var getTheatres = function(){
  console.log('getTheatres');
  //var url = 'https://data.import.io/extractor/cd74f836-cdbd-4ff1-a327-bdb31f882fc9/json/latest?_apikey=' + process.env.IMPORTIO_API;
  // var url = 'https://extraction.import.io/query/extractor/cd74f836-cdbd-4ff1-a327-bdb31f882fc9?_apikey=' + process.env.IMPORTIO_API;
  var url = process.env.THEATRE_IMPORTER_URL;

  client.get(url, args, function (data, response) {
      // parsed response body as js object
      // var entity = JSON.parse(data[0].name);
      //console.log(data);

      var theatres = data.extractorData.data[0].group;
      var count = Object.keys(theatres).length;

      for (var i = 0; i < count; i++) {
          var found = false;
          var theatreName = theatres[i].Name[0].text;
          var theatreUrl = theatres[i].Name[0].href;
          var Theatre = keystone.list('Theatre');
          createTheatre(theatreName, theatreUrl);  
      };

  });
}

var getImportIOShows = function(){
  console.log('getShows and Theatre');
  var url = process.env.SHOW_IMPORTER_URL;

  client.get(url, args, function (data, response) {
      var shows = data.extractorData.data[0].group;
      var count = Object.keys(shows).length;

      for (var i = 0; i < count; i++) {
          var showName = shows[i].Name[0].text;
          var showUrl = '';

          if (shows[i].Link){
            var showUrl = shows[i].Link[0].href;  
          }
          
          createShow(showName, showUrl);
          createProduction(showName, showUrl);
      };

  });
}

scrapShows = function(){
  console.log('getting shows from Scrappinghub');
  var url = process.env.SHOW_URL;

  client.get(url, args, function (data, response) {
      var count = Object.keys(data).length;
      console.log(count);
      for (var i = 0; i < count; i++) {
          var show = data[i];

          // if (shows[i].Link){
          //   var showUrl = shows[i].Link[0].href;  
          // }
          
          //createShow(showName, showUrl);
          createProduction(show);
      };

  });
}

cron.runJobs = function(){
    var job = new CronJob({
      cronTime: '0 * * * * *',
      onTick: function(){
          // getTheatres();
          // getShows();
          scrapShows();
      },
      onComplete: function () {
        /* This function is executed when the job stops */
      },
      start: false
    });

    job.start();
}