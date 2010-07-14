
NIWEA = {}
NIWEA.Storage = function () {
	//"private" variables:
	var categoryCount = 0;
	var myPrivateVar = "I can be accessed only from within YAHOO.myProject.myModule."
	var categories = {}
	var stories = [];
	
	//"private" method:
	var myPrivateMethod = function () {
		YAHOO.log("I can be accessed only from within YAHOO.myProject.myModule");
	}
	
	var getJsonFromServer = function (id) {
		
		$.getJSON( '/backend/index.php?mode=cat&id='+id, handleJsonFromServer );
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
			drawCategory(i);
		}
		refreshContent();
	}
	
	var drawCategory = function (id) {
		var data = getJsonFromStorage(id);
		// do the actual drawing here
		if (data && data.items) {
			var nodes = $('.content div');
		
			for (var i = 0;  i < data.items.length; i++) {
				var node = nodes.eq(i);;
				if (node && data.items[i].title ) {
					
					$(".title",node).html(data.items[i].title);
					$(".lead",node).text(data.items[i].shortlead);
					node.attr("id","story_" + data.items[i].id);
					if (i == 0) {
						$("img",node).attr("src",data.items[i].image_big_ipad);	
					}
				} else { 
			}
		}
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
		
		getStory: function(id) {
			if (stories[id]) {
				return stories[id];
			} else {
				return null;
			}
		},
		
		
		
		myPublicMethod: function () {
			YAHOO.log("I'm accessible as YAHOO.myProject.myModule.myPublicMethod.");
			
			//Within myProject, I can access "private" vars and methods:
			YAHOO.log(myPrivateVar);
			YAHOO.log(myPrivateMethod());
			
			//The native scope of myPublicMethod is myProject; we can
			//access public members using "this":
			YAHOO.log(this.myPublicProperty);
		}
	};
	
}(); // the parens here cause the anonymous function to execute and return


$(document).ready(function(){
	NIWEA.Storage.init();
});