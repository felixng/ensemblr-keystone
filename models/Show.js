var keystone = require('keystone');
var Types = keystone.Field.Types;

var Show = new keystone.List('Show', {
	singular: 'Show',
	plural: 'Shows',
	autokey: { from: 'name', path: 'slug', unique: true },
});

Show.add({
	name: { type: String, required: true },
	heroImage: { type: Types.CloudinaryImage },
	startDate: { type: Types.Date, index: true },
	createdAt: { type: Date, default: Date.now },
});

Show.relationship({ path: 'productions', ref: 'Production', refPath: 'show' });

Show.track = true;
Show.register();
