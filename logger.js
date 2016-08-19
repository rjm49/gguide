function getEpochTimeStamp(date){
	return Math.round(new Date().getTime()/1000);
}

var Logger = function(app){
	var self = this;
	this.msgs = ko.observableArray([]).extend({ rateLimit: 500 });
	
	this.log = function(msg){
		console.log(msg);
		var this_date = new Date();
		var s = this_date.toISOString() + " " + getEpochTimeStamp(this_date) + " " + app.author_id() + " " + app.track() + " " + app.phase()+ "| " + msg;
		self.msgs.push(s);
	};
	
    this.msgs.subscribe(function(newValue) {
  	   if(newValue) {
  		   localStorage.setItem('ats_gg_log', ko.toJSON(newValue));
  	   }
  	});
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