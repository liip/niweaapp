/*jslint white: false, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, strict: true, newcap: true, immed: true */
/*global $, PhoneGap, history, window, device, localStorage, navigator, alert, setTimeout, event*/
"use strict";
(function () {
	var modules, application, Storage;
	
	modules = {};
	
	application = (function () {
	
		var initialized, that, serverName, apiPath, // private properties
		initializeTabbar, request, showButton, hasTouchSupport; // methods
		
		hasTouchSupport = (function(){
			// Not ideal, but seems like there's no foolproof way of detecting touch support without snagging Chrome too.
			return navigator.userAgent.indexOf('iPhone') !== -1 ||
				navigator.userAgent.indexOf('iPod') !== -1 ||
				navigator.userAgent.indexOf('iPad') !== -1 ||
				navigator.userAgent.indexOf('Android') !== -1;
			}());
		
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
				
				$('#category').change(function () {
					application.setAddress('page/category?id=' + $(this).val());
				});
				
				modules.category.initCategories();
				
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
						localStorage.removeItem('currentPage');
						localStorage.setItem('currentPage', uri);
					} catch (e) {
						alert(e.message);
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
		var that, next, previous, slideTo, selected_category, goTo;
		
		next = function () {
			goTo(selected_category + 1);
		};
		previous = function () {
			goTo(selected_category - 1);
		};
		goTo = function (id) {
			application.setAddress('page/category?id=' + id);
		};
		
		slideTo = function (direction, duration) {
			var position;
			
			if ('number' !== typeof duration) {
				duration = 300;
			}
			
			if ('undefined' === typeof selected_category) {
				selected_category = 0;
			}
			
			if ('number' === typeof direction) {
				position = $('#cat-' + direction).position();
				if (position) {
					position = position.left;
					selected_category = direction;
				}
			} else {
				if ('next' === direction) {
					position = $('#cat-' + (selected_category + 1)).position();
					if (position) {
						position = position.left;
						selected_category += 1;
					} 
				} else {
					position = $('#cat-' + (selected_category - 1)).position();
					if (position) {
						position = position.left;
						selected_category -= 1;
					}
				}
			}
			
			if (!position) {
				// there is no next/previous element
				position = $('#cat-' + selected_category).position().left;
			}
	
			// TODO: use WebKitTransitionEvent
			if (0 === duration) {
				$('#pages').css('left', -position);
			} else {
				$('#pages').animate({left: - position}, duration, function() {});
			}
			
			//application.setAddress('page/category?id=' + selected_category);
	
			$('#category').val(selected_category);
		};
		
		
		that = {
			initCategories: function () {
				var i, container;
				
				container = $('#categories');
				
				if (0 !== container.children('div').size()) {
					// categories have already been initialized
					return;
				}
				container.hide();
				for (i = 0; i < 11; i += 1) {
					container.append('<div/>')
						.children(':last')
						.attr('id', 'cat-' + i)
						.addClass('category')
						.width($('body').width());
					Storage.drawCategory(i);
				}
	
				Storage.init();
	
				container.width((i * $('body').width()) + 100);
			},
			hide: function () {
				var categories;
				
				categories = $('#categories');
				if (categories.is(':visible')) {
					$('body').unbind('touchstart', this.handleTouch);
					categories.hide();
				}
			},
			init: function (parameters) {
	
				var categories, duration, id, logo;
				
				$('#content').text('');
				
				id = parseInt(parameters.id, 10);
				
				categories = $('#categories');
	
				if (!categories.is(':visible')) {
					$('#pages div:visible').hide();
					categories.show();
					$('body').bind('touchstart', this.handleTouch);
				}
				
				if ('number' === typeof selected_category && 1 === Math.pow(selected_category - id, 2)) {
					// the back button has been used, we want a sliding effect...
					duration = null;
				} else {
					// most likely the page has been reloaded or we come back from
					// a story page using the back button.
					duration = 0;
				}
				
				logo = $('#logo');
				logo.unbind("click");
				logo.click(function() {application.setAddress('page/category?id=' + parameters.id);});
				
				slideTo(id, duration);
			},
			handleTouch: function(e) {
				var $el, startX, startY, startTime, deltaX, deltaY, deltaT, touchMove, touchEnd, updateTouch;
				
				$el = $(e.target);
				
				touchMove = function (e) {
					var absX, absY, swipeLength;
					
					updateTouch();
	
					absX = Math.abs(deltaX);
					absY = Math.abs(deltaY);
	
					// User must swipe 1/5 the width of the screen to move on.
					swipeLength = $('.current').width() / 5;
	
					// Check for swipe
					if (absX > absY && (absX > swipeLength) && deltaT < 1000) {
						$el.unbind('touchmove touchend');
						if (deltaX < 0) {
							// Left swipe.
							next();
						} else {
							// Right swipe.
							previous();
						}
					}
				};
	
				touchEnd = function () {
					updateTouch();
					$el.unbind('touchmove touchend');
				};
	
				updateTouch = function () {
					var first = event.changedTouches[0] || null;
					deltaX = first.pageX - startX;
					deltaY = first.pageY - startY;
					deltaT = (new Date()).getTime() - startTime;
				};
	
				if (event) {
					startX = event.changedTouches[0].clientX;
					startY = event.changedTouches[0].clientY;
					startTime = (new Date()).getTime();
					deltaX = 0;
					deltaY = 0;
					deltaT = 0;
	
					// Let's bind these after the fact, so we can keep some internal values.
					$el.bind('touchmove', touchMove).bind('touchend', touchEnd);
				}
	
			}
		};
		return that;
	}());
	
	modules['404'] = {
		stub: '<h1>404</h1>'
	};
	
	
	Storage = (function () {
		//"private" variables:
		var categoryCount = 10,
			myPrivateVar = "I can be accessed only from within YAHOO.myProject.myModule.",
			categories = {},
			stories = [],
			getJsonFromServer, handleJsonFromServer, getJsonFromStorage, initContent, showStoryClick,
			drawStory, getStory, putJsonToStorage, refreshContent, that;
		
		getJsonFromServer = function (id) {
			
			$.getJSON( './backend/index.php?mode=cat&id='+id, handleJsonFromServer );
		};
		
		handleJsonFromServer = function(data, status) {
			
			if (status === 'success') {
				var id = data.id;
				if (id === 0) {
				  data.category ="Front";	
				} else if (data.items[0]) {
					 data.category = data.items[0].category;
				}
				
				
				//console.log('<option value="'+id+'">'+data.category+'</option>');
				/*for (var i = 0; i <  data.items.length; i++) {
					cat.items[i] =  data.items[i];
				}*/
				putJsonToStorage(data,id);
			}
		};
		
		getJsonFromStorage = function(id) {
			var data, i, item;
			data = JSON.parse(localStorage.getItem("category"+id));
			
			if (data && data.items) {
				for(i = 0; i < data.items.length; i += 1) {
					item = data.items[i];
					stories[item.id] = item;
				}
			}
			
			return data;
		};
		
		initContent = function() {
			refreshContent();
		};
		
		showStoryClick = function() {
			application.setAddress("page/story?id="+$(this).attr("id"));
		};
		
		drawStory = function(id) {
			var content, item, i, ii, context;
			
			item = getStory(id);
			if (!item) {
				alert('Die Story konnt nicht gefunden werden.');
				return;
			}
			
			content = $('#content');
			
			content.html('<div class="story"><h2 class="title"></h2><p class="lead"/><img/><div class="text"/><div class="context_stories"></div>');
			
			content.find('h2').text(item.title);
			content.find('p.lead').text(item.lead);
			content.find('div.text').html(item.text.replace(/\n/g,"<br/>"));
			
			if (item.image_big_ipad) {
				// ADD AN IMAGE, IF ONE IS GIVEN
				content.find('p.lead')
					.after('<img/>')
					.next()
					.attr('src', item.image_big_ipad);
			}
			
			//// TODO: add congtext stories, once we are sure we can provide the content
			//context = content.find('div.context_stories')
			//for (i = 0, ii = item.context_stories.length; i < ii; i += 1) {
			//	context.append('<a/>')
			//		.children(':last')
			//		.text(item.context_stories[i].context_title);
			//}
		};
		
		
		
		getStory = function(id) {
			if (stories[id]) {
				return stories[id];
			} else {
				return null;
			}
		};
		
		
		putJsonToStorage = function(data, id) {
			try {
				// one does not get the "Quota exceeded" exceptions
				// when removing the item before overwriting it...
				// c.f. http://stackoverflow.com/questions/2603682/
				localStorage.removeItem("category"+id);
				localStorage.setItem("category"+id,JSON.stringify(data));
			} catch (e) {
				if (e === 'QUOTA_EXCEEDED_ERR') {
					alert('Quota exceeded!'); //data wasn't successfully saved due to quota exceed so throw an error
				}
			}
			that.drawCategory(id);
		};
		
		refreshContent = function() {
			for (var i = 0;i <= categoryCount;  i += 1) {
				getJsonFromServer(i);
			}
		};
		
		that = {
			init: function () {
				initContent();
			},
			
			updateStory: function(id) {
				drawStory(id);
			},
			
			updateCategory: function(id) {
				//drawCategory(id);
			},
			
			drawCategory: function (id) {
				var data, div, item, i, title, getCallback;
				
				getCallback = function (item) { 
					return function () {
						application.setAddress('page/story?id=' + item.id);
					};
				};
				
				div = $('#cat-' + id);
				
				if (0 === div.size()) {
					return;
				}
				
				data = getJsonFromStorage(id);
				if (!data || !data.items) {
					return;
				}
				
				
				title = div.find('h2').first();
				if (title.size() && data.items[0].title === title.text()) {
					// we only rerender if there are no changes.
					// if the title of the first story didn't change, then the
					// content didn't change... makes sense, right? right?
					return;
				}
	
				
				div.text('');
				
				for (i = 0; i < 5; i += 1) {
					item = data.items[i];
					div.addClass('content')
						// ADD STORY CONTAINER
						.append('<div class="story small"></div>')
						.children(':last')
						.attr('id', "story_" + item.id)
						.append('<h2 class="title"/><p class="lead"/>')
						// MAKE THE STORY CLICKABLE
						.click(getCallback(item))
						// ADD STORY TITLE
						.children(':first')
						.text(item.title)
						// ADD STORY CONTENT
						.next()
						.text(item.shortlead);
				}
				
				item = data.items[0];
				div.children()
					// THE LEAD STORY HAS A CLASS MORE
					.first()
					.removeClass('small')
					.addClass('big')
					// ADD LEAD STORY IMAGE
					.prepend('<img width="640" height="385"/>')
					.children()
					.first()
					.attr("src",item.image_big_ipad);
			}
		};
		
		return that;
		
	}());
	
	modules.story = {
	    init: function(data) {
			modules.category.hide();
			Storage.updateStory(data.id.replace(/story_/,''));
		}
	
	};
	
	$(application.init);
	
	$('#content').ajaxError(function(event, XMLHttpRequest, ajaxOptions, thrownError) {
	  $(this).text(thrownError.message);
	});
}());