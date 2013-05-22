//var HejApp = {};
//window.HejApp = HejApp;



HejApp.db = {

	initDatabase : function (){

		this.db = window.openDatabase("SettingDB", "1.0", "setting", 200000);

	},
	getSettings :function (model, database, sqlStr){

		function errorCB(err) {
			alert("Error processing SQL: "+err.code);
			return null;
		}
		function querySuccess(tx, results) {
			var len = results.rows.length;

			model.set( {
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
		database.transaction(queryDB, errorCB);
	},
	saveSettings : function (settingsObj, database){

		function successCB() {

			navigator.notification.alert(
			    "",  // message
			    null,// callback
			    'Dina inställningar sparades!',// title
			    'OK'// buttonName
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
	
	}
}

$(function(){
/*
console.log("diee");
var d =  HejApp.db.get();
console.log(d);
*/
});
