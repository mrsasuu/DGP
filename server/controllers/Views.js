var config = require('../config/config.json').http;
var express = require('express');
var session = require('express-session');

var IndexController = require('./IndexController');
var UsuarioController = require('./UsuarioController');
var ContentTypeController = require('./ContentTypeController');

function Views(app) {
	this.expressContext = app;
	this.expressContext.set('views', __dirname + '/../public/templates');
	this.expressContext.set('view engine', 'ejs');

	this.routerBackend = express.Router();
	this.routerFrontend = express.Router();

	this.renderJson = {};

	this.initPages();
}

Views.prototype.initPages = function() {
	var self = this;

	// Initialize controllers
	var indexC = new IndexController(self.renderJson);
	var usuarioC = new UsuarioController(self.renderJson);
	var contentTypeC = new ContentTypeController(self.renderJson);

	// -- BACKEND VIEWS --
	self.routerBackend.use(indexC.getRouterBackend());
	self.routerBackend.use('/users', usuarioC.getRouterBackend());
	self.routerBackend.use('/contentTypes', contentTypeC.getRouterBackend());

	// -- FRONTEND VIEWS --
	self.routerFrontend.use(indexC.getRouterFrontend());
	self.routerFrontend.use('/user', usuarioC.getRouterFrontend());

	// Attach both Views to Express Context.
	self.expressContext.use('/backend', self.routerBackend);
	self.expressContext.use('/', self.routerFrontend);
};

module.exports = Views;
