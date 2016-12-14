var keystone = require('keystone');
var CronJob = require('cron').CronJob;
var ImportIO = require('./importio.js');
var cron = module.exports = {};

var Client = require('node-rest-client').Client;
var client = new Client();

var args = {
    headers: { "Accept": "application/json" }
};


var slugify = function(name){
    var slugExp = /[^a-z]/ig;
    var slug = name.toLowerCase().replace(slugExp, '-');
    return slug;
}

var createTheatre = function(name, url){
    var Theatre = keystone.list('Theatre');

    Theatre.model.update({name: name}, {sourceUrl: url}, {upsert: true}, function(err, doc){
        if(err){
            console.log("Something wrong when updating data!");
        }

        console.log(doc);
    });
}

var createTheatre = function(theatre){
    var Theatre = keystone.list('Theatre');
    var Production = keystone.list('Production');

    Production.model.find().where('name', theatre.currentProduction).exec(function(err, result){
      if (result.length > 0){
        theatre.currentProduction = result[0]._id;
        Theatre.model.update({name: theatre.name}, theatre, {upsert: true}, function(err, doc){
            if(err){
                console.log(err);
            }

            console.log(doc);
        });  
      }
      
    })
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

var createProduction = function(theatreInfo){
    var Theatre = keystone.list('Theatre');
    var Production = keystone.list('Production');
    console.log("Updating " + theatreInfo.name);
    
    Theatre.model.find().where('sourceUrl', theatreInfo.theatreUrl).exec(function(err, result){
        //console.log(result);

        Production.model.update({name: theatreInfo.currentProductionName}, 
                                {name: theatreInfo.currentProductionName, 
                                 sourceUrl: theatreInfo.currentProductionUrl,
                                 slug: theatreInfo.slug, 
                                 theatre: result[0]._id}, {upsert: true}, function(err, doc){
            if(err){
                console.log(err);
            }

            console.log(doc);
        });    
        
    });
    
}

var getTheatres = function(){
  console.log('getTheatres');
  var url = process.env.THEATRES_IMPORTER_URL;

  client.get(url, args, function (data, response) {
      var theatres = data.extractorData.data[0].group;
      var count = Object.keys(theatres).length;

      for (var i = 0; i < count; i++) {
          var theatre = parseTheatre(theatres[i].Name[0]);
          createTheatre(theatre);  
      };

  });
}

var populateTheatre = function(){
  console.log('populateTheatre');
  
  var Theatre = keystone.list('Theatre');
  var extractorId = process.env.IMPORTIO_THEATRE_EXTRACTOR;
  //Theatre.model.find().where('name', 'Apollo Theatre').exec(function(err, result){
  Theatre.model.find().exec(function(err, result){
    result.forEach(function(theatre){
        var url = ImportIO.parseEndPoint(theatre.sourceUrl, extractorId);
        //console.log(url);
        client.get(url, args, function (data, response) {
          if (data && data.extractorData && data.extractorData.data){

            var theatreNode = data.extractorData.data[0].group[0];
            var theatreInfo = parseTheatreInfo(theatreNode);
            theatreInfo.theatreUrl = data.extractorData.url;

            createProduction(theatreInfo); 
          }
          else{
            console.log(data);
          }
            
        });
    });

    
  })
}

var parseTheatreInfo = function(item){
    //console.log(item);
    var name = item.Name[0].text;

    var theatreInfo = {
      name: name,
      currentProductionName: item.currentShow[0].text,
      currentProductionUrl: item.currentShow[0].href,
      slug: slugify(name)
    }

    return theatreInfo;
}

var parseTheatre = function(item){
    var name = item.text; 
    // var slug = slugify(name);

    var theatre = {
      name: item.text,
      sourceUrl: item.href,
      // currentProduction: '583b7923772767cfdaa5fbce'
    };

    return theatre;
}  

cron.runJobs = function(){
    var job = new CronJob({
      cronTime: '0 * * * * *',
      onTick: function(){
          //getTheatres();
          populateTheatre();
          // getShows();
          // scrapShows();
      },
      onComplete: function () {
        /* This function is executed when the job stops */
      },
      start: false
    });

    job.start();
}