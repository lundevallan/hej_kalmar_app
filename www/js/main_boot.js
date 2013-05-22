

HejApp.boot = function(container){
	console.log("boot");
	container = $(container);
	HejApp.router = new HejApp.Router({el : container});
	Backbone.history.start();	

	console.log("boot Finished");

	

}