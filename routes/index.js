var config = require('../config/config');

/*
 * GET Main Application page
 */

exports.index = function(req, res){
	res.render('index', { title: 'Express', env: config.env});
};