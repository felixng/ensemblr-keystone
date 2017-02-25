var keystone = require('keystone');
var Types = keystone.Field.Types;

var Production = new keystone.List('Production', {
	singular: 'Production',
	plural: 'Productions',
	map: { name: 'name' },
    autokey: { path: 'slug', from: 'name', unique: true },
    defaultSort: '-lastUpdated',
});

Production.add('Basics', {
	name: { type: String, required: true, unique: true},
	url: { type: Types.Url },
	heroImage: { type: Types.CloudinaryImage },
	openingDate: { type: Types.Date },
	closingDate: { type: Types.Date },
	show: { type: Types.Relationship, initial: true, ref: 'Show', index: true },
	theatre: { type: Types.Relationship, initial: true, ref: 'Theatre', index: true },
	facebook: { type: String, width: 'small' },
	twitter: { type: String, width: 'small' },
	instagram: { type: String, width: 'small' },
	sourceUrl: { type: Types.Url },
	twitterData: { type: Boolean, initial: true },
	//Base
	lastUpdated: { type: Types.Datetime, default: Date.now, hidden: true },
	createdAt: { type: Types.Datetime, default: Date.now, hidden: true },
});

Production.relationship({ path: 'prices', ref: 'Price', refPath: 'price' });

Production.schema.pre('save', function(next) {
	this.lastUpdated = new Date();
	next();
});

Production.track = true;
Production.defaultColumns = 'name, createdAt|20%, lastUpdated|20%';
Production.register();
