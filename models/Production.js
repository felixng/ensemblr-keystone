var keystone = require('keystone');
var Types = keystone.Field.Types;

var Production = new keystone.List('Production', {
	singular: 'Production',
	plural: 'Productions',
	map: { name: 'name' },
    autokey: { path: 'slug', from: 'name', unique: true },
    defaultSort: '-lastUpdated',
});

Production.add({
	name: { type: String, required: true },
	url: { type: Types.Url },
	heroImage: { type: Types.CloudinaryImage },
	openingDate: { type: Types.Date },
	closingDate: { type: Types.Date },
	show: { type: Types.Relationship, initial: true, ref: 'Show', index: true },
	theatre: { type: Types.Relationship, initial: true, ref: 'Theatre', index: true },
	lastUpdated: { type: Types.Datetime, default: Date.now, hidden: true },
	createdAt: { type: Types.Datetime, default: Date.now, hidden: true },
});

Production.relationship({ path: 'prices', ref: 'Price', refPath: 'price' });

Production.schema.pre('save', function(next) {
	this.lastUpdated = new Date();
});

Production.track = true;
Production.defaultColumns = 'name, createdAt|20%, lastUpdated|20%';
Production.register();
