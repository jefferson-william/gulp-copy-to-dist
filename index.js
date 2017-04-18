'use strict';

var through     = require('through2'),
	mkdirp      = require('mkdirp'),
	fs          = require('fs'),
	PluginError = require('gulp-util/lib/PluginError');

var pluginName = 'copyToDist';

function merge(target, source) {
	if (typeof source === 'undefined') source = {};

	Object.keys(source).forEach(function(key) {
		target[key] = source[key];
	});

	return target;
}

module.exports = function(options) {
	var defaultConfig = {
		cwd: '',
		dest: ''
	};
	var file, data, config = merge(defaultConfig, options);

	function copyToDist(f, encoding, callback) {
    	data = undefined;
		file = merge(f, {});

		file.cwd = file.cwd.replace(/\\/g, '/');
		file.path = file.path.replace(/\\/g, '/');
		file.base = file.base.replace(/\\/g, '/');

		config.fileName = file.path.replace(/.*\//, '');
		config.baseDest = file.base.replace(file.cwd + config.cwd, file.cwd + config.dest);


		mkdirp(config.baseDest, function (err) {
		    if (err) return console.error(err);

	    	var readStream = fs.createReadStream(file.path).pipe(fs.createWriteStream(config.baseDest + config.fileName));

	    	readStream.on('data', function(chunk) {});

			readStream.on('end', function() {});

			callback(null, f);
		});
	}

	return through.obj(copyToDist);
};