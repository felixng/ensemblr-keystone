var keystone = require('keystone');
var Types = keystone.Field.Types;

var Price = new keystone.List('Price', {
	inherits: EntityBase,
	singular: 'Price',
	plural: 'Prices',
	autokey: { from: 'name', path: 'slug', unique: true },
});

Price.add({
	heroImage: { type: Types.CloudinaryImage },
	excludeDates: { type: Types.Dates },
	production: { type: Types.Relationship, initial: true, ref: 'Production', index: true },
});

Price.track = true;
Price.register();
