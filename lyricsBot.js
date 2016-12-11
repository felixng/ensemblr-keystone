var keystone = require('keystone');
var CronJob = require('cron').CronJob;
var lyricsBot = module.exports = {};

var Client = require('node-rest-client').Client;
var client = new Client();

var args = {
    headers: { "Accept": "application/json" }
};

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

var removeWordLyric = function(str){

  if (str.toLowerCase().includes("lyric")){
    var lastIndex = str.lastIndexOf(" ");
    str = str.substring(0, lastIndex);
  }

  return str;

}

var parseShow = function(item){

    var show = {
      name: removeWordLyric(item.name[0]),
      year: item.year[0],
      url: item.link[0],
      sourceUrl: item.url
    };

    return show;
}

var parseSong = function(item){
  
}

var parseLyrics = function(item){
  
}

scrapLyrics = function(){
  console.log('getting lyrics from Scrappinghub');
  var url = process.env.LYRICS_URL;

  client.get(url, args, function (data, response) {
      var count = Object.keys(data).length;
      for (var i = 0; i < count; i++) {
          var item = data[i];

          if (item._type == 'show'){
            console.log('show');
            console.log(parseShow(item));
          }

          if (item._type == 'song'){
            console.log('song');
          }

          if (item._type == 'lyrics'){
            console.log('lyrics');
          }

          // if (shows[i].Link){
          //   var showUrl = shows[i].Link[0].href;  
          // }
          
          //createShow(showName, showUrl);
          //createProduction(show);
      };

  });
}

lyricsBot.getLyrics = function(){
    var job = new CronJob({
      cronTime: '0 * * * * *',
      onTick: function(){
          scrapLyrics();
      },
      onComplete: function () {
        /* This function is executed when the job stops */
      },
      start: false
    });

    job.start();
}