var keystone = require('keystone');
var Types = keystone.Field.Types;

var LyricShow = new keystone.List('LyricShow', {
	singular: 'LyricShow',
	plural: 'LyricShows',
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'name', unique: true },
	defaultSort: '-lastUpdated',
});

LyricShow.add({
	name: { type: String, required: true, unique: true },
	year: { type: Types.Number },
	//Scraphub Base
	url: { type: Types.Url },
	sourceUrl: { type: Types.Url },
	//Base
	lastUpdated: { type: Types.Datetime, default: Date.now, hidden: true },
	createdAt: { type: Types.Datetime, default: Date.now, hidden: true },
});

LyricShow.relationship({ path: 'lyricSongs', ref: 'LyricSong', refPath: 'lyricshow' });

LyricShow.schema.pre('save', function(next) {
	this.lastUpdated = new Date();
	next();
});

LyricShow.track = true;
LyricShow.defaultColumns = 'name, createdAt|20%, lastUpdated|20%';
LyricShow.register();
