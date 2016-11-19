var keystone = require('keystone');
var Types = keystone.Field.Types;

var Price = new keystone.List('Price', {
	singular: 'Price',
	plural: 'Prices',
	map: { name: 'name' },
    autokey: { path: 'slug', from: 'name', unique: true },
    defaultSort: '-lastUpdated',
});

Price.add({
	name: { type: String },
	excludeDates: { type: Types.Date },
	production: { type: Types.Relationship, initial: true, ref: 'Production', index: true },
	excludedDays: { type: Types.Select, options: 'draft, published, archived', default: 'draft' },
	// testTextArray: { type: Types.TextArray },
	amount: { type: Types.Money, currency: 'en-gb' },
	lastUpdated: { type: Types.Datetime, default: Date.now, hidden: true },
	createdAt: { type: Types.Datetime, default: Date.now, hidden: true },
});


Price.schema.pre('save', function(next) {
	this.lastUpdated = new Date();
});

Price.track = true;
Price.defaultColumns = 'name, createdAt|20%, lastUpdated|20%';
Price.register();
