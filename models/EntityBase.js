var keystone = require('keystone');
 
var EntityBase = new keystone.List('EntityBase', {
   map: { name: 'title' },
	    autokey: { path: 'slug', from: 'title', unique: true },
	});

EntityBase.add({
		name: { type: String, required: true },
		slug: { type: String, readonly: true },
		createdAt: { type: Date, default: Date.now },
	}
);

EntityBase.register();