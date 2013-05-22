var HejApp = {};
window.HejApp = HejApp;



//**************************************
//			  Special Stuff
//**************************************

var template = function(name) {
	return Mustache.compile($('#'+name+'-template').html());
};
