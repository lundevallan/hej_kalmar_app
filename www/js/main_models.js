//**************************************
//				 Model
//**************************************



HejApp.EventObject = Backbone.Model.extend({});


/**
* Collection för alla event 
* @author Linus Lundevall,
* 
*/
HejApp.EventObjects = Backbone.Collection.extend({
	url : 'http://hejkalmar.wilsonlab.se/app/event/',
	initialize : function (){

	},
	parse : function(resp, xhr) {
		var evs = [];
		for (var i = 0; i < resp.events.length; i++) {
			evs.push(resp.events[i].event);
		};

		return evs;
	}
});

/**
*Smultron karta
------------------*/
HejApp.MapObject = Backbone.Model.extend({});


/**
* Smultron karta.
* @author Linus Lundevall,
* 
*/
HejApp.MapObjects = Backbone.Collection.extend({
	url : 'http://hejkalmar.wilsonlab.se/app/smultron',
	initialize : function (){

	},
	parse : function(resp, xhr) {

		var evs = [];
		for (var i = 0; i < resp.nodes.length; i++) {
			evs.push(resp.nodes[i].node);
		};
		//console.log(evs);
		return evs;
	}
});





HejApp.LinneFeedObject = Backbone.Model.extend({});


/**
* Collection för alla linnestudenterna.se/feed rss items
* @author Linus Lundevall,
* 
*/
HejApp.LinneFeedObjects = Backbone.Collection.extend({
	url : 'http://linnestudenterna.se/feed/',
	parse : function(data) {
		
		var dayArray = 
		["Måndag","Tisdag","Onsdag","Torsdag","Fredag","Lördag","Söndag"];

		var monthArray = 
		["Januari","Februari","Mars","April","Maj","Juni",
		"Juli","Augusti","September","Oktober","November","December"];

		var parsed = [];

		$(data).find('item').each(function (index) {
			var itemTitle = $(this).find('title').text();
			var itemLink = $(this).find('link').text();
			var jDate = new Date($(this).find('pubDate').text());
			var itemCreator = $(this).find('creator').text();
			var itemDescription = $(this).find('description').text();
			var itemContent = $(this).find('encoded').text().replace(/(<([^>]+)>)/ig,"");
			
			var itemPubDate = 
			dayArray[jDate.getDay()-1] 
			+ " " + jDate.getDate() 
			+ " " + monthArray[jDate.getMonth()];

			parsed.push({
				title: itemTitle, 
				link: itemLink,
				pubDate: itemPubDate,
				creator: itemCreator,
				description: itemDescription,
				content: itemContent
			});

		});
		return parsed;
	},
	fetch: function (options) {
		options = options || {};
		options.dataType = "xml";
		Backbone.Collection.prototype.fetch.call(this, options);
	}
});



/**
* Model för inställningar. Validerar variablerna. 
* @author Linus Lundevall,
* 
*/
HejApp.SettingsObject = Backbone.Model.extend({
	db : null,
	valid: false,
    firstname: "",
    lastname: "",
    email: '',
    notifications: 1,
    termsOfUse: 0,
    
	validate: function( attributes ){
		
		console.log("validation - settings");

		var returnString = "";
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if(1 > attributes.firstname.length || attributes.firstname.length > 100){
            returnString += "Ange ett korrekt förnamn (Minst 1 tecken och max 100)\n";
        }
        if(1 > attributes.lastname.length || attributes.lastname.length > 100){
            returnString += "Ange ett korrekt efternamn (Minst 1 tecken och max 100)\n";
        }
		if (!filter.test(attributes.email)) {

            returnString += "Ange en korrekt E-postadress\n";
        }

        if(returnString.length>0){
        	return returnString;
        }
        this.valid = true;
    },
    initialize: function(){

    	this.bind("error", function(model, error){
                // We have received an error, log it, alert it or forget it :)
                //alert( error );
                navigator.notification.alert(
			    error,  // message
			    null,         // callback
			    'Fel',            // title
			    'Fortsätt'                  // buttonName
			    );

            });

    },
    initDB : function (){

		this.db = window.openDatabase("SettingDB", "1.0", "setting", 200000);
    },
    saveDBData : function (settingsObj){
		var that = this;
		function successCB() {

			that = settingsObj;

			navigator.notification.alert(
			    "",  // message
			    null,// callback
			    'Dina inställningar sparades!',// title
			    'Fortsätt'// buttonName
			    );
	        return false;
	    }

		function errorCB(err) {
    		alert("Error processing SQL: "+err.code);
    		return false;
		}

		function populateDB(tx) {
			console.log("saving");

	         tx.executeSql('DROP TABLE IF EXISTS USERSETTINGS');
	         var sqlQ = 'CREATE TABLE IF NOT EXISTS USERSETTINGS'
	         +' (id INT PRIMARY KEY, firstName TEXT NOT NULL, lastName TEXT NOT NULL, email TEXT NOT NULL, notifications INT NOT NULL, termsOfUse INT NOT NULL)';
	         
	        tx.executeSql(sqlQ);

	        var sqlInsertString ='INSERT INTO USERSETTINGS '
	        +'(firstName, lastName, email, notifications, termsOfUse) '
	        +'VALUES ("'+
	        	settingsObj.get("firstname")+'", "'+
	        	settingsObj.get("lastname")+'", "'+
	        	settingsObj.get("email")+'", '+
	        	settingsObj.get("notifications")+', '+
	        	settingsObj.get("termsOfUse")+')';
			
	        tx.executeSql(sqlInsertString);
    	}

		this.db.transaction(populateDB, errorCB, successCB);
		return true;
	},
	getDBData : function (that){
		
		function errorCB(err) {
			alert("Error processing SQL: "+err.code);
			return null;
		}
		function querySuccess(tx, results) {
			var len = results.rows.length;

			that.set( {
				"firstname"	: results.rows.item(0).firstName,
				"lastname" : results.rows.item(0).lastName,
				"email" : results.rows.item(0).email,
				"notifications" : results.rows.item(0).notifications,
				"termsOfUse" : results.rows.item(0).termsOfUse
			});
		}
		function queryDB(tx) {

			tx.executeSql('SELECT * FROM USERSETTINGS', [], querySuccess, errorCB);
		}
		this.db.transaction(queryDB, errorCB);
	}
});

/**
* Model för inställningar. Validerar variablerna. 
* @author Linus Lundevall,
* 
*/

HejApp.TipsObject = Backbone.Model.extend({

	valid: false,
    firstname: "",
    lastname: "",
    email: '',
    notifications: 1,
    termsOfUse: 0,
    
	validate: function( attributes ){
		
		console.log("validation - settings");

		var returnString = "";
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if(1 > attributes.firstname.length || attributes.firstname.length > 100){
            returnString += "Ange ett korrekt förnamn (Minst 1 tecken och max 100)\n";
        }
        if(1 > attributes.lastname.length || attributes.lastname.length > 100){
            returnString += "Ange ett korrekt efternamn (Minst 1 tecken och max 100)\n";
        }
		if (!filter.test(attributes.email)) {

            returnString += "Ange en korrekt E-postadress\n";
        }

        if(returnString.length>0){
        	return returnString;
        }
        this.valid = true;
    },
    initialize: function(){

    	this.bind("error", function(model, error){
                // We have received an error, log it, alert it or forget it :)
                //alert( error );
                navigator.notification.alert(
			    error,  // message
			    null,         // callback
			    'Fel',            // title
			    'Fortsätt'                  // buttonName
			    );

            });

    }
});








