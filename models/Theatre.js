var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Theatre Model
 * =============
 */

var Theatre = new keystone.List('Theatre', {
	singular: 'Theatre',
	plural: 'Theatres',
	map: { name: 'name' },
    autokey: { path: 'slug', from: 'name' },
    defaultSort: '-lastUpdated',
});

Theatre.add({
	name: { type: String, required: true, unique: true},
	heroImage: { type: Types.CloudinaryImage },
	images: { type: Types.CloudinaryImages },
	url: { type: Types.Url },
	location: { type: Types.Location, defaults: { country: 'London' }},
	currentProduction: { type: Types.Relationship, initial: true, ref: 'Production', index: true },
	sourceUrl: { type: Types.Url },
	lastUpdated: { type: Types.Datetime, default: Date.now, hidden: true },
	createdAt: { type: Types.Datetime, default: Date.now, hidden: true },
});

Theatre.relationship({ path: 'productions', ref: 'Production', refPath: 'theatre' });


Theatre.schema.pre('save', function(next) {
	this.lastUpdated = new Date();
	next();
});

Theatre.track = true;
Theatre.defaultColumns = 'name, createdAt|20%, lastUpdated|20%';
Theatre.register();
