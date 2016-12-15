var keystone = require('keystone');
var Types = keystone.Field.Types;

var Weekday = new keystone.List('Weekday', {
	singular: 'Weekday',
	plural: 'Weekdays',
	map: { name: 'name' },
    autokey: { path: 'slug', from: 'name', unique: true },
    defaultSort: '-lastUpdated',
    hidden: true,
});

Weekday.add({
	name: { type: String },
	index: { type: Number },
	//Base
	lastUpdated: { type: Types.Datetime, default: Date.now, hidden: true },
	createdAt: { type: Types.Datetime, default: Date.now, hidden: true },
});

Weekday.schema.pre('save', function(next) {
	this.lastUpdated = new Date();
	next();
});

Weekday.relationship({ path: 'prices', ref: 'Price', refPath: 'price' });

Weekday.track = true;
Weekday.defaultColumns = 'name, createdAt|20%, lastUpdated|20%';
Weekday.register();
