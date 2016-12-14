var keystone = require('keystone');
var CronJob = require('cron').CronJob;
var ScrapHub = require('./Scraphub.js');
var lyricsBot = module.exports = {};


var Client = require('node-rest-client').Client;
var client = new Client();

var args = {
    headers: { "Accept": "application/json" }
};

var createSong = function(song){
    var LyricShow = keystone.list('LyricShow');
    var LyricSong = keystone.list('LyricSong');

    console.log("Creating/Updating " + song.sourceUrl);

    LyricShow.model.find().where('url', song.sourceUrl)
    .exec(function(err, shows) {
      if (shows.length > 0){
        console.log(song.name);
        console.log(shows);
      }
    });

    // LyricSong.model.update({name: show.name}, show, {upsert: true}, function(err, doc){
    //     if(err){
    //         console.log(err);
    //     }
    //     console.log(doc);
    // });
}

var createShow = function(show){
    var LyricShow = keystone.list('LyricShow');

    console.log("Creating/Updating " + show.name);

    LyricShow.model.update({name: show.name}, show, {upsert: true}, function(err, doc){
        if(err){
            console.log(err);
        }
        console.log(doc);
    });
}

var removeWordLyric = function(str){
    if (str.toLowerCase().includes("lyric")){
      var lastIndex = str.lastIndexOf(" ");
      str = str.substring(0, lastIndex);
    }

    return str;
}

var slugify = function(name){
    var slugExp = /[^a-z\-]/ig;
    var slug = name.toLowerCase().replace(slugExp, '-');
    return slug;
}

var parseShow = function(item){
    var name = removeWordLyric(item.name[0]);
    var slug = slugify(name);

    var show = {
      name: name,
      year: item.year[0],
      url: item.link[0],
      sourceUrl: item.url,
      slug: slug
    };

    return show;
}

var parseSong = function(item){
    var name = removeWordLyric(item.name[0]);
    var slug = slugify(name);

    var song = {
      name: name,
      url: item.link[0],
      sourceUrl: item.url,
      slug: slug
    };

    return song;
}

var parseLyrics = function(item){
    var name = removeWordLyric(item.name[0]);
    var slug = slugify(name);

    var lyric = {
      name: item.songName,
      text: item.lyrics,
      sourceUrl: item.url,
      slug: slug
    };

    return lyric;
  
}

scrapLyrics = function(){
  console.log('Getting Lyrics from Scrappinghub');
  ScrapHub.itemApiEndPoint(process.env.LYRICS_API_KEY, function(err, url){
    client.get(url, args, function (data, response) {
        var count = Object.keys(data).length;
        for (var i = 0; i < count; i++) {
            var item = data[i];

            // if (item._type == 'show'){
            //   console.log('show');
            //   var show = parseShow(item);
            //   createShow(show);
            // }

            if (item._type == 'song'){
              var song = parseSong(item);
              //console.log(song);
              createSong(song);
            }

            // if (item._type == 'lyrics'){
            //   var lyrics = parseLyrics(item);
            //   console.log(lyrics);
            // }
        };
    });
  });
  
}

lyricsBot.getLyrics = function(){
    var job = new CronJob({
      cronTime: '0 * * * * *',
      onTick: function(){
          scrapLyrics();
          //ScrapHub.itemApiEndPoint(process.env.LYRICS_API_KEY);
      },
      onComplete: function () {
        /* This function is executed when the job stops */
      },
      start: false
    });

    job.start();
}