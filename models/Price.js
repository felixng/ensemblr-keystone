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
	production: { type: Types.Relationship, initial: true, ref: 'Production', index: true },
	excludeDates: { type: Types.Date },
	excludedDays: { type: Types.Relationship, ref: 'WeekDay', many: true },
	faceValue: { type: Types.Money, currency: 'en-gb' },
	groupPrice: { type: Types.Money, currency: 'en-gb' },
	minGroupNumber: { type: Number },
	//Base
	lastUpdated: { type: Types.Datetime, default: Date.now, hidden: true },
	createdAt: { type: Types.Datetime, default: Date.now, hidden: true },
});


Price.schema.pre('save', function(next) {
	this.lastUpdated = new Date();
});

Price.track = true;
Price.defaultColumns = 'name, createdAt|20%, lastUpdated|20%';
Price.register();
