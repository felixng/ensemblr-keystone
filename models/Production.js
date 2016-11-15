var keystone = require('keystone');
var Types = keystone.Field.Types;

var Production = new keystone.List('Production', {
	singular: 'Production',
	plural: 'Productions',
	autokey: { from: 'name', path: 'slug', unique: true },
});

Production.add({
	name: { type: String, required: true },
	heroImage: { type: Types.CloudinaryImage },
	openingDate: { type: Types.Date, index: true },
	closingDate: { type: Types.Date, index: true },
	show: { type: Types.Relationship, initial: true, ref: 'Show', index: true },
	theatre: { type: Types.Relationship, initial: true, ref: 'Theatre', index: true },
	createdAt: { type: Date, default: Date.now },
});

Production.track = true;
Production.register();
