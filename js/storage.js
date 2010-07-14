
NIWEA = {}
NIWEA.Storage = function () {
	//"private" variables:
	var categoryCount = 10;
	var myPrivateVar = "I can be accessed only from within YAHOO.myProject.myModule."
	var categories = {}
	var stories = [];
	
	//"private" method:
	var myPrivateMethod = function () {
		YAHOO.log("I can be accessed only from within YAHOO.myProject.myModule");
	}
	
	var getJsonFromServer = function (id) {
		
		$.getJSON( './backend/index.php?mode=cat&id='+id, handleJsonFromServer );
	}
	
	var handleJsonFromServer = function(data, status) {
		
		if (status == 'success') {
			var id = data.id;
			/*var channel = data.items;
			var cat = {};
			cat.items = [];
			for (var i = 0; i <  data.items.length; i++) {
				cat.items[i] =  data.items[i];
			}*/
			putJsonToStorage(data,id);
		}
	}
	
	var getJsonFromStorage = function(id) {
		var data = JSON.parse(localStorage.getItem("category"+id));
		
		if (data && data.items) {
			for(var i = 0; i < data.items.length; i++) {
				var item = data.items[i];
				stories[item.id] = item;
			}
		}
		
		return data;
	}
	
	var initContent = function() {
		for (var i = 0; i <= categoryCount;  i++) {
			
		}
		drawCategory(0);
		refreshContent();
	}
	
	var showStoryClick = function() {
		application.setAddress("page/story?id="+$(this).attr("id"));
	}
	
	var drawCategory = function (id) {
		var data = getJsonFromStorage(id);
		// do the actual drawing here
		if (data && data.items) {
			//only draw, if there's a "big" element
			if ($('.big').length) {
				var nodes = $('.content div');
				for (var i = 0;  i < data.items.length; i++) {
					var node = nodes.eq(i);;
					var item = data.items[i];
					if (node && item.title ) {
						node.unbind("click",showStoryClick);
						node.bind("click",showStoryClick);
						$(".title",node).html(item.title);
						
						
						
						$(".lead",node).text(item.shortlead);
						
						
						
						node.attr("id","story_" + item.id);
						if (i == 0) {
							$("img",node).attr("src",item.image_big_ipad);	
						}
					} else { 
					}
				}
			}
		}
	}
	
	var drawStory = function(id) {
		var data = getStory(id);
		if (data) {
			var nodes = $('.content .story');
			
			var item = data;
			var node = nodes.eq(0);;
			if (node && item.title ) {
				node.unbind("click",showStoryClick);
				node.bind("click",showStoryClick);
				$(".title",node).html(item.title);
				
				
				
				$(".lead",node).text(item.lead);
				
				
				
				node.attr("id","story_" + item.id);
				$("img",node).attr("src",item.image_big_ipad);
					$(".text",node).html(item.text.replace(/\n/g,"<br/>"));
			} else { 
			}
		}
	}
	
	
	
	var getStory = function(id) {
		if (stories[id]) {
			return stories[id];
		} else {
			return null;
		}
	}
	
	
	var putJsonToStorage = function(data, id) {
		try {
			localStorage.setItem("category"+id,JSON.stringify(data));
		} catch (e) {
			if (e == QUOTA_EXCEEDED_ERR) {
				alert('Quota exceeded!'); //data wasn't successfully saved due to quota exceed so throw an error
			}
		}
		drawCategory(id);
	}
	
	var refreshContent = function() {
		for (var i = 0;i <= categoryCount;  i++) {
			getJsonFromServer(i);
		}
	}
	
	return  {
		myPublicProperty: "I'm accessible as YAHOO.myProject.myModule.myPublicProperty.",
		init: function () {
			initContent();
		},
		
		
		
		
		myPublicMethod: function () {
			YAHOO.log("I'm accessible as YAHOO.myProject.myModule.myPublicMethod.");
			
			//Within myProject, I can access "private" vars and methods:
			YAHOO.log(myPrivateVar);
			YAHOO.log(myPrivateMethod());
			
			//The native scope of myPublicMethod is myProject; we can
			//access public members using "this":
			YAHOO.log(this.myPublicProperty);
		},
		
		updateStory: function(id) {
			drawStory(id);
		},
		
		updateCategory: function(id) {
			drawCategory(id);
		}
		
		
	};
	
}(); // the parens here cause the anonymous function to execute and return


$(document).ready(function(){
	NIWEA.Storage.init();
});