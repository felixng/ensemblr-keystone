var keystone = require('keystone');
var Types = keystone.Field.Types;

var Price = new keystone.List('Price', {
	singular: 'Price',
	plural: 'Prices',
	map: { name: 'name' },
    autokey: { path: 'slug', from: 'name', unique: true },
});

Price.add({
	name: { type: String },
	excludeDates: { type: Types.Date },
	production: { type: Types.Relationship, initial: true, ref: 'Production', index: true },
});

Price.track = true;
Price.register();