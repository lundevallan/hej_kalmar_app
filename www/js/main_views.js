//**************************************
//				 View
//**************************************


//*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
//	Index view




/**
* Huvudmeny, denna finns med på alla sidor
* man kan skicka in olika parametrar till konstruktorn 
* eller render för att få knappar eller ändra title 
*
* @author Linus Lundevall,
* 
*/
HejApp.MenuView = Backbone.View.extend({
	el : "#header_menu",
	className: 'menu',
	template: template ('menu'),
	headerTitle : "Hej Kalmar!",
	leftButton : null,
	rightButton : null,
	initialize :function (hTitle, lBtn, rBtn){

		this.headerTitle = hTitle ? hTitle : this.headerTitle;
		this.leftButton = lBtn ? lBtn : null;
		this.rightButton = rBtn ? lBtn : null;

		this.render();
	},
	events: {

		'click': 'rightBtnEvent',
		'click': 'leftBtnEvent'
	},
	render : function(){

		this.$el.find(".right-btn").hide();
		this.$el.find(".left-btn").hide();
		this.$el.find("h1").html(this.template(this));
		return this;
	},
	header_title: function (){return this.headerTitle;},
	r_btn: function (){return this.rightButton},
	l_btn: function (){return this.leftButton},
	
	leftBtnEvent :function (){
		console.log("left button event");
		/*var eventView = new HejApp.Index.Event();
		$('.events-show').append(eventView.render(this.model).el);*/
	},
	rightBtnEvent :function (){
		console.log("right button event");
		/*var eventView = new HejApp.Index.Event();
		$('.events-show').append(eventView.render(this.model).el);*/
	}
});





/**
* Huvudvyn för startsidan(event feed)
* @author Linus Lundevall,
* 
*/
HejApp.Index = Backbone.View.extend({
	template: template('index'),
	numberToShow : 15,
	cacheObj :{
			cache : {cache: "local", //using localstrorage or session
	            key: "EventsCollection", // storage key
	            TTL: 1 // 10 minutes
	        },
	        success : function(){

	
	        }
	    },
	initialize: function(){
		
		var menuView = new HejApp.MenuView("Hej Kalmar!", "back");

		this.eventObjs = new HejApp.EventObjects();

		this.eventObjs.on('all', this.render, this);



   
		this.eventObjs.fetch(this.cache);

	    
	},
	render : function(state) {


		
		var that = this;

		if (state === "reset"){

			this.$el.html(this.template(this));

			var appendEventFunc = function(appendAmount){

				if(!appendAmount){	

					for (var i = 0; i <= that.numberToShow-1; i++) {

						that.addEventObject(that.eventObjs.models[i]);
						setTimeout(function (){ /*$.mobile.loading('hide');*/ }, 2000);
					}
				}
				else{
					
					that.$('.event-icon').remove();
					for (var i = 0; i <= that.numberToShow-1; i++) {

						that.addEventObject(that.eventObjs.models[i]);	
					}
				}				
			}

			//Denna funktion skickas med i loaded och körs inne i custom_scroll.js
			var callbackFunc = function(type){
				//Om man vill ladda in nya artiklar från servern
				if(type ==="top"){

					that.numberToShow = 6;
					//$.mobile.loading('show');
					that.eventObjs.fetch(that.cache);
				}
				//Om man vill se fler av de hämtade
				else{

					var appendAmount = 9;
					if(that.numberToShow === that.eventObjs.length ){
					
						$(".pullUpLabel").html("Inga fler evenemang");
						setTimeout(function(){$("#pullUp").hide();}, 2000);
					}	
					else{

						that.numberToShow = that.numberToShow + appendAmount;
						//Denna gör att antalet att visa aldrig är störra än antalet modeller i collection
						that.numberToShow = that.numberToShow > that.eventObjs.length ? that.eventObjs.length : that.numberToShow; 
						setTimeout(function(){ appendEventFunc(appendAmount); }, 2000);
					}
				}
			}
			setTimeout(function(){ /*loaded(callbackFunc);*/ }, 2000);
			appendEventFunc();




					var p = $(".event-icon:first");

					console.log(p);
					console.log(p.scrollTop());
					var last = $(".event-icon:last");

					console.log(last.scrollTop());



					this.$('.events').prepend("<p class='update' style='height: 5em; boder-bottom: 1px solid #ccc; '>Uppdaterar...</p>");
					$('p.update').hide();

					window.ontouchmove = function(e) {
						console.log("Touch move");
						console.log(e.pageX);
					};



					$(window).scroll(function(){
		   			//console.log("scrolling");


		   			if($(window).scrollTop() + $(window).height() == $(document).height()) {
		       			//alert("bottom!");
		       			
		       		}




		       		console.log($(this).scrollTop());

		   			var s = $(this).scrollTop();

		   			if(s === 0 || s < 0){

		   				console.log("blow zero");
		   				$('p.update').slideDown(100, function() {
			
							console.log("slide down");
			

						setTimeout(function(){

							$('p.update').slideUp(100, function() {	
								console.log("slide up");
							});
						},2000)

						});
		   			}
		   			else if (s > 10){

		   				$('p.update').slideUp(100, function() {
						console.log("slide up");
						});
		   			}
		   		})
		}
		return this;
	},
	addEventObject: function (eventObj){

		var view = new HejApp.Index.Events({model: eventObj});
		this.$('.events').append(view.render().el);
	}
});



//*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
//	Event and Events view


/**
* Vyn för eventsidan med alla event i sig
* @author Linus Lundevall,
* 
*/
HejApp.Index.Events = Backbone.View.extend({
	className: 'event-icon',
	template: template ('events'),
	events: {

		'click': 'show'
	},
	render : function(){

		this.$el.html(this.template(this));
		return this;
	},
	title: function (){return this.model.get("title")},
	place: function (){return this.model.get("place")},
	icon: function (){return this.model.get("image_fullsize")},
	date: function (){return this.model.get("start_date_long")},
	time: function (){return this.model.get("time")},
	
	show :function (){
		var that = this;
		
		var eventView = new HejApp.Index.Event();

		console.log(that.model.get("title"));
		$('.events-show').html(eventView.render(that.model).el);
	}

});

/**
* Vyn för ett eventobject
* @author Linus Lundevall,
* 
*/
HejApp.Index.Event = Backbone.View.extend({
	className: 'event-view',
	template: template ('event'),
	events: {
		'click button': 'hide',
		'click button.left-button': 'hide'
	},
	render : function(eventObj){

	
		this.model = eventObj;	
		
		$('.events-show').show();

		this.$el.append(this.template(this));

		$('.event-icon').hide();



		var menuView = new HejApp.MenuView("Evenemang", "back");
		menuView.render();

		console.log(myScroll);
		myScroll.scrollTo(0, 0, 1); 
		myScroll.disable()


		return this;
	},
	title: function (){return this.model.get("title")},
	text: function (){return this.model.get("description")},
	image: function (){return this.model.get("image_fullsize")},
	hide: function(){
		
		myScroll.enable()
		$('.events-show').empty();
		$('.event-icon').show();
	}
});


//*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
//	Tips view

/**
* Vyn för att posta eventtips 
* @author Linus Lundevall,
* 
*/
HejApp.Tips = Backbone.View.extend({
	className: 'tips',
	template: template ('tips-form'),
	userSettingsObj : null,
	events: {
		'click .send-form': 'send',
		'click .add-image': 'addPicture'
	},
	render : function(){
		var menuView = new HejApp.MenuView("Tips");
		
		this.userSettingsObj = new HejApp.SettingsObject();
		this.userSettingsObj.initDB();
		this.userSettingsObj.getDBData(this.userSettingsObj);

		this.$el.append(this.template(this));
		return this;
	},	
	addPicture:function(){
		// capture error callback
		var captureError = function(error) {
			navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
		};

		var onSuccess = function(imageURI) {
			$('#img-div').prepend('<img id="theImg"  style="width: 100%;" src="'+imageURI+'" />');
		};

		navigator.camera.getPicture(onSuccess, captureError, 
		{
			sourceType : Camera.PictureSourceType.CAMERA,
			destinationType: Camera.DestinationType.FILE_URI
		});
		//sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
	},
	send: function(event) {

		event.preventDefault();
	}
});




//*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
//	Karta view



/**
* Vyn för smultronkartan och kårens rabattkarta 
* @author Linus Lundevall,
* 
*/
HejApp.Karta = Backbone.View.extend({
	className: 'karta',
	template: template ('karta'),
	menuTemplate: template ('linne-menu'),
	collection: null,
	map : null,
	initialize: function(){
		//$.mobile.loading( 'show');
		this.collection = new HejApp.MapObjects();
		
		this.collection.on('all', this.render, this);
		this.collection.fetch();/*{
			cache : {cache: "local", //using localstrorage or session
	            key: "SmultronCollection", // storage key
	            TTL: 60 * 10 // 10 minutes
	        }});*/
	}, 
	render : function(on){

		this.$el.html(this.template(this));
	
		var that = this;

		console.log(on);
		if (on==="reset"){

			//$.mobile.loading( 'hide');

			(function mapFunction(){

				var marker, i, map;

				var mapOptions = {
					center: new google.maps.LatLng(56.66628, 16.34887),
					zoom: 12,
					panControl: false,
					zoomControl: false,
					scaleControl: false,
					streetViewControl: false,
					mapTypeControl: false,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				this.map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

			})();

			//mapFunction();

		//google.maps.event.addDomListener(window, "load", mapFunction);
		var size = {width:10, height:10, widthUnit:"px", heightUnit:"px"};
		var infoOptions = {
			maxWidth: 100,
			pixelOffset: size

		}
		var infowindow = new google.maps.InfoWindow(infoOptions);

		function m (e) {
			
			// console.log(map);
			// console.log(e.get("Titel"))
			// console.log(e.get("Latitude"));
			var latitude = e.get("Latitude");
			var longitude = e.get("Longitude");

			//Drupal Fix
			latitude = latitude.replace("°","");
			longitude = longitude.replace("°","");

			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(latitude, longitude),
				animation : google.maps.Animation.DROP,
				map: map
			});

			google.maps.event.addListener(marker, 'click', (function(marker, e, map) {
				return function() {
					var contentString = '<div id="infoBubble"><h1 class="infoHeader"> ' + e.get("Titel") + '</h1><img class="smultron_image" src="'+ e.get("smultron_image") +'" /><p>' + e.get("Beskrivning") +' </p> </div>';

					
					var newMapCenter = marker.getPosition();
					var newLat = newMapCenter.mb;
					var newLong = newMapCenter.nb;
					//var test =  new LatLng({lat:newLat, lng:newLong, noWrap?:true})

					console.log("marker get::::",newMapCenter);

					console.log("marker get 2::::",newMapCenter.mb);
					
					map.setCenter(newMapCenter);

					infowindow.setContent(contentString);

	        		//infowindow.setContent(places[i][0]);
	        		infowindow.open(map, this);
	        	}
	    	})(marker, e, map));
		}

		this.collection.each(m, this.collection);

		var menuView = new HejApp.MenuView("Smultronkartan");
		that.$el.prepend(that.menuTemplate(that));
		//var linneMenuView = new HejApp.LinneMenuView("Linnestudenterna");
		
		HejApp.setLinneMenuLinks();
		
	}
		
		return this;
	}
});







//*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
//	Linne view



/**
* Vyn för linnestuderna.se/feed (hela content)
* @author Linus Lundevall,
* 
*/
HejApp.LinneRssView = Backbone.View.extend({

	className: 'linneObjs',
	template: template ('index-linne'),
	menuTemplate: template ('linne-menu'),

	initialize: function(){
		//$.mobile.loading( 'show');

		this.linneObjs = new HejApp.LinneFeedObjects();
		this.linneObjs.on('all', this.render, this);
		//var that = this;

		this.linneObjs.fetch();
	},
	render : function(state) {

		if(state ==="reset"){
		
			this.$el.append(this.menuTemplate(this));
			//$.mobile.loading( 'hide');
			this.linneObjs.each(this.addLinneObject, this);
			
			var menuView = new HejApp.MenuView("Nyheter");
			//var linneMenuView = new HejApp.LinneMenuView("Linnestudenterna");
			HejApp.setLinneMenuLinks();
		}

		return this;
	},
	addLinneObject: function (eventObj){


		var view = new HejApp.LinneRssElement();
		this.$el.append(view.render(eventObj).el);

	}
});


/**
* Vyn för ett linneRssView Item (en rad).
* @author Linus Lundevall,
* 
*/
HejApp.LinneRssElement = Backbone.View.extend({
	className: 'item',
	template: template ('linne'),
	events: {

		'click': 'showEvent',
		'click .link': 'gotoLinkEvent'
	},
	initialize: function() {
	},
	render : function(obj){

		this.model = obj;
		this.$el.append(this.template(this));	
		return this;
	},
	showEvent :function (e){

		var hasDescription = $(this.$el.parent()).find(".content");
		var descEl = $(this.$el).find(".content");
		if(descEl.length > 0)
		{
			$(descEl).slideUp(100, function() {
				$(this).remove();
			});
		}
		else{

			$(hasDescription).remove();
			//Kanske ha en annan bakgrundsfärg på ett expanderat element som fadar bort.
			//För att användaren ska se vilket element som har öppnats.
			$('body').animate({scrollTop: this.$el.offset().top- 100}, 800);

			$(this.el).append(this.content()).hide().slideDown(400,function(){
				$(this).show();
			});
		}
	},
	gotoLinkEvent:function (){
		HejApp.inAppBrowser(this.model.get('link'));
	},
	title: function (){return this.model.get("title")},
	date: function (){return this.model.get("pubDate")},
	creator: function (){return this.model.get("creator")},
	content: function (){
		return "<p class='content'>"+
		"<button style='display: block;' class='link'>Läs mer</button>Skribent: "+
		this.model.get("creator")+
		"<br />Datum: "+
		this.model.get("pubDate")
		+"</p>"},
	});



//Rabatt vy
HejApp.Rabatt = Backbone.View.extend({

	className: 'rabatt-content',
	template: template ('rabatt'),
	menuTemplate: template ('linne-menu'),

	initialize: function(){
		//$.mobile.loading( 'show');

		this.linneObjs = new HejApp.LinneFeedObjects();
		this.linneObjs.on('all', this.render, this);
		//var that = this;

		this.linneObjs.fetch();
	
	},
	render : function(state) {
		console.log(state);
		if(state ==="reset"){
		
			this.$el.append(this.menuTemplate(this), this.template(this));
			//$.mobile.loading( 'hide');
		
			
			var menuView = new HejApp.MenuView("Rabatter");
			
			console.log($(".link-to-rabatt"))
			HejApp.setLinneMenuLinks();
		}

		return this;
	}
	
});



//*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*
//	Settings view

/**
* Vyn för lagring av användarinställningar
* @author Linus Lundevall,
* 
*/
HejApp.Settings = Backbone.View.extend({

	className: 'settings',
	template: template ('settings'),
	settingsDB : null,
	settingsObj : null,
	events: {

		'click .save-user-settings': 'saveEvent',
		'click .check-model' : 'checkModel'
		
	},
	initialize: function() {

		var menuView = new HejApp.MenuView("Inställningar");

		this.model = new HejApp.SettingsObject();
		this.model.bind('change', this.render, this); 
		this.model.initDB();
		this.model.getDBData(this.model);


	},
	render : function(d){
		
		//d innehåller triggertypen för model bindningen tex. change, sync, request
		this.$el.html(this.template(this));
		

		return this;
	},
	//Getters
	firstname: function (){return this.model.get("firstname")},
	lastname: function (){return this.model.get("lastname")},
	email: function (){return this.model.get("email")},

	notifications: function (){	
		if (this.model.get("notifications") === 1){
			return "checked";}
			return "";
		},
		termsOfUse: function (){
			if (this.model.get("termsOfUse") === 1){
				return "checked";}
				return "";
			},
			getSettings : function(){
		//Behövs kanske inte
	},
	checkModel : function(){
		//Denna ska tas bort 
		console.log(this.model.get("firstname"));
	},
	saveEvent : function (){

		var fName = this.$el.find('#firstname').val();
		var lName = this.$el.find('#lastname').val();
		var eMail = this.$el.find('#email').val();
		var notifs = this.$el.find('#notifications').prop('checked') ? 1 : 0;
		var terms = this.$el.find('#termsofuse').prop('checked') ? 1 : 0;
		
		var settingsObj = new HejApp.SettingsObject;

		settingsObj.set({

			firstname: fName,
			lastname: lName,
			email : eMail,
			notifications: notifs,
			termsOfUse: terms
		});

		//Valideringskoll 
		if(settingsObj.valid){

			this.model.saveDBData(settingsObj);

			//TODO: Denna kanske inte borde köras
			//Som det funkar nu så triggar den en ny render med det sparade datat.
			this.model.getDBData(this.model);
		}
		
	}

});



