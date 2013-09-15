var config = require('../config');

/*
 * GET Main Application page
 */

exports.index = function(req, res){
	res.render('index', { title: 'Express', env: config.env});
};

exports.room = function(req, res){
  var room = req.params.room;
  res.render('room', { title: 'Express', env: config.env, room : room });
};