//(function() {
/*

var onSuccess = function(position) {
    alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
};

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

navigator.geolocation.getCurrentPosition(onSuccess, onError);

*/







//**************************************
//				 Routing
//**************************************

HejApp.Router = Backbone.Router.extend({
	initialize: function(options){
		console.log("running router");
		this.el = options.el;
		HejApp.setMenuLinks();
	},
	routes:{
		"":"index",
		"tips" : "tips",
		"karta" : "karta", 
		"linne" : "linne", 
		"settings" : "settings",
		"rabatt" : "rabatt"
	},
	index: function (){
		
		//Testa och se om du kan kolla om din modell är tom eller för gammal
		//och bara då ska en uppdatering ske.
		var index = new HejApp.Index();
		//Denna tämmer saker
		this.el.empty();
		this.el.append(index.render().el);

		//Fix för footer och header. Så att dem stannar nere resp. uppe
		//$('[data-position=fixed]').fixedtoolbar({ tapToggle:false});
	},
	tips: function (){
		//$.mobile.loading( 'hide');
		//Denna gör så att header inte flyger ner när man trycker done i textinput
		//$("[data-role=header]").fixedtoolbar({ hideDuringFocus: "input, select, textarea" });
		HejApp.scrollToTop();

		var tips = new HejApp.Tips();
		this.el.empty();
		this.el.append(tips.render().el);
	},

	karta: function (){
		//$.mobile.loading( 'hide');
		HejApp.scrollToTop();

		var tips = new HejApp.Karta();
		this.el.empty();
		this.el.append(tips.render().el);
	},

	linne: function (){
		//$.mobile.loading( 'hide');
		HejApp.scrollToTop();

		this.el.empty();
		var linneRss = new HejApp.LinneRssView();
		
		this.el.append(linneRss.render().el);
		
	},

	rabatt: function (){
		//$.mobile.loading( 'hide');
		HejApp.scrollToTop();
		var rabatt = new HejApp.Rabatt();
		this.el.empty();
		this.el.append(rabatt.render().el);
	},

	settings: function (){
		//$.mobile.loading( 'hide');
		HejApp.scrollToTop();

		var tips = new HejApp.Settings();
		this.el.empty();
		this.el.append(tips.render().el);
	}
});


//**************************************
//			Utilities/Extras
//**************************************


HejApp.scrollToTop = function(){
	//$.mobile.silentScroll(0);
};

HejApp.inAppBrowser = function(link){
	var ref = window.open(link, "_system",'enableViewPortScale=yes');
};

HejApp.setMenuLinks = function(){

	$(".link-to-hem").on("click", function(event){
		HejApp.router.navigate('', {trigger: true}); 
	});

	$(".link-to-tips").on("click", function(event){	
		HejApp.router.navigate('tips', {trigger: true}); 
	});

	$(".link-to-linne").on("click", function(event){
		HejApp.router.navigate('linne', {trigger: true}); 
	});

	$(".link-to-settings").on("click", function(event){
		HejApp.router.navigate('settings', {trigger: true}); 
	});
};

HejApp.setLinneMenuLinks = function(){

	$(".link-to-linne").on("click", function(event){
		HejApp.router.navigate('linne', {trigger: true}); 
	});

	$(".link-to-karta").on("click", function(event){
		HejApp.router.navigate('karta', {trigger: true}); 
	});

	$(".link-to-rabatt").on("click", function(event){
		HejApp.router.navigate('rabatt', {trigger: true}); 
	});
}

//})()
