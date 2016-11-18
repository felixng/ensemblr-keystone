var keystone = require('keystone');
var Types = keystone.Field.Types;

var Price = new keystone.List('Price', {
	singular: 'Price',
	plural: 'Prices',
	autokey: { from: 'name', path: 'slug', unique: true },
});

Price.add({
	heroImage: { type: Types.CloudinaryImage },
	excludeDates: { type: Types.Date },
	production: { type: Types.Relationship, initial: true, ref: 'Production', index: true },
});

Price.track = true;
Price.register();
