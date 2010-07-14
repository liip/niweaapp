
NIWEA = {}
NIWEA.Storage = function () {
	//"private" variables:
	var categoryCount = 1;
	var myPrivateVar = "I can be accessed only from within YAHOO.myProject.myModule."
	var categories = {}
	
	//"private" method:
	var myPrivateMethod = function () {
		YAHOO.log("I can be accessed only from within YAHOO.myProject.myModule");
	}
	
	var getJsonFromServer = function (id) {
		
		$.getJSON( '/getjson.php?catId='+id, handleJsonFromServer );
	}
	
	var handleJsonFromServer = function(data, status) {
		
		if (status == 'success') {
			console.log(data);
			var id = data.catid;
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
		return JSON.parse(localStorage.getItem("category"+id));
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
		for (var i = 0;  i < data.items.length; i++) {
			if (data.items[i].title ) {
				console.log(data.items[i].title + "<br/>");
			} else { 
				console.log(data.items[i]);
			}
		}
	}
	
	var putJsonToStorage = function(data, id) {
		try {
			console.log("save",id,data);
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
		}
	};
	
}(); // the parens here cause the anonymous function to execute and return


$(document).ready(function(){
	NIWEA.Storage.init();
});