var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Theatre Model
 * =============
 */

var Theatre = new keystone.List('Theatre', {
	singular: 'Theatre',
	plural: 'Theatres',
	autokey: { from: 'name', path: 'slug', unique: true },
});

Theatre.add({
	name: { type: String, required: true },
	heroImage: { type: Types.CloudinaryImage },
	images: { type: Types.CloudinaryImages },
	location: { type: Types.Location, defaults: { country: 'London' }},
	createdAt: { type: Date, default: Date.now },
});

Theatre.relationship({ path: 'productions', ref: 'Production', refPath: 'theatre' });

Theatre.track = true;
Theatre.register();
