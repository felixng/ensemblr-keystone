var keystone = require('keystone');
// var mongoose = require('mongoose'),
//     keystone = require('keystone');

// keystone.connect(mongoose,app);

// keystone.init({
//     // config here
// });

// keystone.import('models');

// mongoose.connect('localhost', 'ensemblr');

// mongoose.connection.on('open', function() {
//     // ready to do things, e.g.
//     var User = keystone.list('User');
//     new User.model().save();
// });



var CronJob = require('cron').CronJob;
var cron = module.exports = {};

var Client = require('node-rest-client').Client;
var client = new Client();

var createTheatre = function(name, url){
    keystone.createItems({
        Theatre: [{
            name: name,
            sourceUrl: url,
        }]
    }, function(err, stats) {
        stats && console.log(stats.message);
        // done(err);
    });
}

var getTheatres = function(){
  console.log('getTheatres');
  //var url = 'https://data.import.io/extractor/cd74f836-cdbd-4ff1-a327-bdb31f882fc9/json/latest?_apikey=' + process.env.IMPORTIO_API;
  // var url = 'https://extraction.import.io/query/extractor/cd74f836-cdbd-4ff1-a327-bdb31f882fc9?_apikey=' + process.env.IMPORTIO_API;
  var url = process.env.THEATRE_IMPORTER_URL;

  client.get(url, function (data, response) {
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
          var query = Theatre.model.find().where('name', theatreName);

          query.exec(function(err, results) {
            found = true;
          });

          if (!found)  {
            createTheatre(theatreName, theatreUrl);  
          }
      };

  });
}

var getShows = function(){
  console.log('getTheatres');
  //var url = 'https://data.import.io/extractor/cd74f836-cdbd-4ff1-a327-bdb31f882fc9/json/latest?_apikey=' + process.env.IMPORTIO_API;
  //var url = process.env.THEATRE_IMPORTER_URL;
  var url = process.env.SHOW_IMPORTER_URL;

  client.get(url, function (data, response) {
      // parsed response body as js object
      // var entity = JSON.parse(data[0].name);
      //console.log(data);

      var shows = data.extractorData.data[0].group;
      var count = Object.keys(shows).length;
      
      // console.log(shows[0]);
      // console.log(shows[0].Name[0].text);

      for (var i = 0; i < count; i++) {

          var theatreName = shows[i].Name[0].text;
          var theatreUrl = shows[i].Name[0].href;
          var Theatre = keystone.list('Theatre');
          console.log(keystone.model.find().where('name').equal(theatreName));

          // keystone.createItems({
          //     Theatre: [{
          //         name: theatreName,
          //         sourceUrl: theatreUrl,
          //     }]
          // }, function(err, stats) {
          //     stats && console.log(stats.message);
          //     // done(err);
          // });
      };

  });
}

cron.theatres = function(){
    var job = new CronJob({
      cronTime: '*/10 * * * * *',
      onTick: function(){
          getTheatres();
      },
      onComplete: function () {
        /* This function is executed when the job stops */
      },
      start: false
    });

    job.start();
}

cron.shows = function(){
    var job = new CronJob({
      cronTime: '*/10 * * * * *',
      onTick: function(){
          getShows();
      },
      onComplete: function () {
        /* This function is executed when the job stops */
      },
      start: false
    });

    job.start();
}