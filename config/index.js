var config = {};
config.port = process.env.PORT || 3000;
config.env = process.env.NODE_ENV || 'development';

module.exports = config;