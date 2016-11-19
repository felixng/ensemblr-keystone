var keystone = require('keystone');
var Types = keystone.Field.Types;

var Production = new keystone.List('Production', {
	singular: 'Production',
	plural: 'Productions',
	map: { name: 'name' },
    autokey: { path: 'slug', from: 'name', unique: true },
    createdAt: { type: Date, default: Date.now },
});

Production.add({
	name: { type: String, required: true },
	heroImage: { type: Types.CloudinaryImage },
	openingDate: { type: Types.Date },
	closingDate: { type: Types.Date },
	show: { type: Types.Relationship, initial: true, ref: 'Show', index: true },
	theatre: { type: Types.Relationship, initial: true, ref: 'Theatre', index: true },
	createdAt: { type: Date, default: Date.now },
});

Production.relationship({ path: 'prices', ref: 'Price', refPath: 'price' });

Production.track = true;
Production.register();
