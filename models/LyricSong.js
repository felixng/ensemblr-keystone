var keystone = require('keystone');
var Types = keystone.Field.Types;

var LyricSong = new keystone.List('LyricSong', {
	singular: 'LyricSong',
	plural: 'LyricSongs',
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'name', unique: true },
	defaultSort: '-lastUpdated',
});

LyricSong.add({
	name: { type: String, required: true, unique: true },
	//Scraphub Base
	url: { type: Types.Url },
	sourceUrl: { type: Types.Url },
	//Base
	lastUpdated: { type: Types.Datetime, default: Date.now, hidden: true },
	createdAt: { type: Types.Datetime, default: Date.now, hidden: true },
});

LyricSong.relationship({ path: 'lyric', ref: 'Lyrics', refPath: 'lyric' });

LyricSong.schema.pre('save', function(next) {
	this.lastUpdated = new Date();
	next();
});

LyricSong.track = true;
LyricSong.defaultColumns = 'name, createdAt|20%, lastUpdated|20%';
LyricSong.register();
