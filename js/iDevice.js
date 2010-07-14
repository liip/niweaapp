/*jslint white: false, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, strict: true, newcap: true, immed: true */
/*global $, PhoneGap, history, window, device, localStorage, navigator, alert, setTimeout*/
"use strict";

var modules, application;

modules = {};

application = (function () {

	var initialized, that, serverName, apiPath, // private properties
	initializeTabbar, request, showButton; // methods
	
	request = function (requester, url, data, callback) {

		if ('function' === typeof data) {
			// no data was given
			callback = data;
			data = {};
		}
		
		if (!apiPath) {
			// this is the dev environment
			// let's use a mock object
			callback({mock: 'object'});
			return;
		}

		that.setProgressBar();
		
		
		requester(
			apiPath + url,
			data, 
			function (response) {
				that.removeProgressBar();
				callback(response);
			},
			'json'
		);
	};

	that = {

		reload: function () {
			window.scroll(0, 0);
			that.processURI($.address.value());
		},
		init: function () {
			// we don't want this function to be called twice
			that.init = function () {};
			
			$.address.value(localStorage.getItem('currentPage') || 'category');
			
			// we set the onAddressChange handler only after
			// the address init event has been thrown, that way
			// the onAddressChange handler will not be called twice.
			$.address.init(
				function () {
					$.address.change(application.processURI);
				}
			);
		},

		processURI: function (address) {
			var module, parameters;
			
			application.removeProgressBar();
							
			if ('string' === typeof address) {
				// parse the string URIs
				address = address.split('?');
				parameters = {};
				if (1 < address.length) {
					// parse out the parameters, if any
					(function () {
						var i, ii, query, queries;
						queries = address[1].split('&');
						for (i = 0, ii = queries.length; i < ii; i += 1) {
							query = queries[i].split('=');
							if (2 === query.length) {
								parameters[query[0]] = query[1];
							}
						}
					}());
				}
				
				module = address[0].split('/').join('');
			} else {
									
				// parse the event sent from $.address
				if (!address.pathNames) {
					return;
				}
				
				parameters = address.parameters || {};
				module = address.pathNames.join('');
			}
			
			if ('' === module) {
				// if no module is chosen,
				// we send them to the front page
				module = 'category';
				parameters = {};
			}

			if (!modules[module]) {
				// we fallback to index
				// this might be a good place for a 404
				module = '404';
			}

			if (modules[module].stub) {
				$('#content').html($(modules[module].stub));
			}
			
			if ('function' === typeof modules[module].init) {
				modules[module].init(parameters);
			}
		},
		
		setAddress: function (uri) {
			var type, parts;
			
			window.scroll(0, 0);
			
			parts = uri.split('/');
			type = parts[0];
			uri = parts[1];

			if ('action' === type) {
				this.processURI(uri);
				return;
			}
			
			if ('page' === type) {
				try {
					localStorage.setItem('currentPage', uri);
				} catch (e) {
				}
				$.address.value(uri);
			}
		},
		setProgressBar: function () {
			if (0 === $('#progress').size()) {
				$('body').append('<div id="progress"><img src="img/ajax-loader.gif"/> Loading…</div>');
			}
		},
		removeProgressBar: function () {
			$('#progress').remove();
		},
		get: function (url, data, callback) {
			request($.get, url, data, callback);
		},
		post: function (url, data, callback) {
			request($.post, url, data, callback);
		}
	};
	return that;
}());


modules.category = (function () {
	var that, initCategories, next, previous, slideTo;
	
	next = function () {
		slideTo('next');
	}
	previous = function () {
		slideTo('previous');
	}
	
	slideTo = function (direction) {
		var offset = $('#pages').css('left');
		if ('next' === direction) {
			
		}
	}
	
	initCategories = function (container) {
		var i;
		if (0 !== container.children('div').size()) {
			// categories have already been initialized
			return;
		}
		
		
		for (i = 0; i < 10; i += 1) {
			container.append('<div/>')
				.children(':last')
				.attr('id', 'cat-' + i)
				.addClass('category')
				.width($('body').width())
				.text('Category Container ' + i);
		}
		
		container.width(i * $('body').width());
	}
	
	that = {
		init: function (parameters) {
			var categories;
			
			categories = $('#categories');
			if (!categories.is(':visible')) {
				$('#pages div:visible').hide();
				categories.show();
			}
			//console.log('here');
			initCategories(categories);
		}
	};
	return that;
}());

modules['404'] = {
	stub: '<h1>404</h1>'
};

$(application.init);

$('#content').ajaxError(function(event, XMLHttpRequest, ajaxOptions, thrownError) {
  $(this).text(thrownError.message);
});






















