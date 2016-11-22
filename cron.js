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

var getEntity = function(){
  console.log('tick');
  //var url = 'https://data.import.io/extractor/cd74f836-cdbd-4ff1-a327-bdb31f882fc9/json/latest?_apikey=' + process.env.IMPORTIO_API;
  var url = 'https://extraction.import.io/query/extractor/cd74f836-cdbd-4ff1-a327-bdb31f882fc9?_apikey=' + process.env.IMPORTIO_API;

  client.get(url, function (data, response) {
      // parsed response body as js object
      // var entity = JSON.parse(data[0].name);
      //console.log(data);

      var entities = data.extractorData.data[0].group;
      var count = Object.keys(entities).length;
      
      for (var i = 0; i < count; i++) {
          //TODO: Add to keystone
      };

      //console.log(data.extractorData.data[0].group[0].Name);
      //console.log(data.extractorData.data[0].group[1].Name);

  });
}

cron.job = function(){
    var job = new CronJob({
      cronTime: '*/10 * * * * *',
      onTick: function(){
          getEntity();
      },
      onComplete: function () {
        /* This function is executed when the job stops */
      },
      start: false
    });

    job.start();
}