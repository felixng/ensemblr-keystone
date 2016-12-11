var keystone = require('keystone');
var Types = keystone.Field.Types;

var Lyric = new keystone.List('Lyric', {
	singular: 'Lyric',
	plural: 'Lyrics',
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'name', unique: true },
	defaultSort: '-lastUpdated',
});

Lyric.add({
	name: { type: String, required: true, unique: true },
	text: { type: String },
	//Scraphub Base
	sourceUrl: { type: Types.Url },
	//Base
	lastUpdated: { type: Types.Datetime, default: Date.now, hidden: true },
	createdAt: { type: Types.Datetime, default: Date.now, hidden: true },
});

// Lyric.relationship({ path: 'productions', ref: 'Production', refPath: 'show' });

Lyric.schema.pre('save', function(next) {
	this.lastUpdated = new Date();
	next();
});

Lyric.track = true;
Lyric.defaultColumns = 'name, createdAt|20%, lastUpdated|20%';
Lyric.register();
