function getEpochTimeStamp(date){
	return Math.round(new Date().getTime()/1000);
}

var Logger = function(app){
	var self = this;
	this.msgs = ko.observableArray([]).extend({ rateLimit: 500 });
	this.log_url = "http://rjm49.dreamhosters.com/gg_test/lm.php";
	
	this.sendToServer = function(msg){
		
//		var log_chunk = localStorage.getItem('ats_gg_log');
		
		var xhr = new XMLHttpRequest();
		xhr.open('POST', self.log_url);
		console.log("POSTing to server: " + self.log_url);
		//xhr.setRequestHeader('X-Proxy-URL', call_url);
		xhr.onload = function() {
			if (xhr.readyState === xhr.DONE) {
		        if (xhr.status === 200) {
		        	console.log("Logging call successful: "+ xhr.response);
		        }else{
		        	console.log("Logging call failed " + xhr.response);
		        }
	        }
		};
		
		xhr.send(msg);			
	};

	
	this.log = function(msg){
		console.log(msg);
		var SEP = ",";
		
		var submission_type = "n/a";
		if(app.phase()=="submitted")
			submission_type = "pretest_results";
		else if(app.phase()=="finised")
			submission_type = "posttest_results";
		
		var this_date = new Date();
		var s = this_date.toISOString() + SEP + getEpochTimeStamp(this_date) + SEP + app.author_id() + SEP + app.track() + SEP + submission_type + SEP + msg + "\n";
	//	self.msgs.push(s);
	
		self.sendToServer(s);
	};
	
//    this.msgs.subscribe(function(newValue) {
//  	   if(newValue) {
////  		   localStorage.setItem('ats_gg_log', ko.toJSON(newValue));
//  		   self.sendToServer();
//  	   }
//  	});
};




var renderLog = function(){
	var logJson = JSON.parse(localStorage.getItem('ats_gg_log'));
	console.log(logJson);
	
	var t = "<table>"
	ko.utils.arrayForEach(logJson, function(msg){
		t += "<tr><td>" + msg + "</td></tr>"; 
	});
	t += "</table>";
	
	return t;
};