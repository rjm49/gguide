/**
 *  
 */
console.log("loading gg.js");

function scoreToHSL(score){
	//score can be from -1..1; hue should be from 0..120
	var hue = (score+1.0) * 60.0;
	return "hsl("+hue+",80%,80%)";
}

function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function maketrack(){	
	var tracks = ['B','U','S','A'];
	var track = tracks[Math.floor(Math.random()*4)];
	console.log("selected track "+track);
	return track;
}

/*
 * INITIALISE THE APP HERE
 */
var tracks = ['B','U','S','A'];
var concepts = [ 'simple past', 'passive voice', 'prepositions' ];

var AppViewModel = function(){
	var self = this;
	this.track = ko.observable('S');
	this.phase = ko.observable('pretest');
	this.author_id = ko.observable('test1');
	this.net_waiting = ko.observable(false);
	this.survey = ko.observable(false);
	
	this.track.subscribe(function(newValue) {
		if (newValue) { // Has focus
			var s = "track changed to " + newValue;
			console.log(s);
			//logger.log(s);
			// 		   logger.track = newValue;
			//localStorage.setItem('ats_gg_track', newValue);
		}
	});
//	this.track(maketrack());
	this.track("S");
	this.author_id(makeid());
	
	this.questions = new ExerciseListModel();	
	this.homework = new HomeworkListModel();
	
	//TODO add subscribers for track and author, for convenience
};

var app = new AppViewModel();
ko.applyBindings(app);

var logger = new Logger(app);
logger.log("loading gg page");

var nextPhase = function(){	
	var gotoPostTest = function(){
		app.phase("posttest");
		app.questions.loadQuestions(app.phase());
	};
	
	var gotoHomework = function(popHW){
		app.phase("homework");
		if(popHW){
			app.homework.populateHW(app.questions.allItems(), app.track());
		}
	};
	
	if(app.phase() == "pretest"){	
		if(app.track()=="B"){
			//no need to pop HW here
			gotoHomework(false);
		}else{
			submit();
			app.phase("submitted");	
		}
	} else if(app.phase() == "submitted"){
		if(app.track()=="U"){
			gotoPostTest();
		}else{
			gotoHomework(true);
		}	
	} else if(app.phase() == "homework"){
		gotoPostTest();
	} else if(app.phase() == "posttest"){
		submit();
		app.phase("finished");
		//app.survey(true);
	} else if(app.phase() == "finished"){
		app.phase("survey");
	}
};

var resetPhase = function() {
//	localStorage.setItem('ats_gg_phase', 'pretest');
	app.phase('pretest');
	app.questions.loadQuestions(app.phase());
	app.net_waiting(false);
};

var wi_handler = function(wi_rsp) {
	console.log(wi_rsp);
	var scores = wi_rsp["sentence_scores"];
	console.log(scores);
	var i = 0;
	
	var qs = app.questions.allItems();
	console.log("questions == "+ qs);
	
	ko.utils.arrayForEach(qs, function(item) {
		var score = scores[i++][2]; //(Math.random() * 2.0) - 1;

		console.log(score);
		item.score(score);
//		item.attempt(item.next());
//		item.next(null);

		//logger.log(JSON.stringify(item));
		var SEP = ",";
		logger.log(i+ SEP +item.initial()+ SEP +item.hint()+ SEP +item.buildAnswer()+ SEP +score+ SEP +item.target);	
	});
//	localStorage.setItem("ats_gg_needs_help", ko.toJSON(needs_help));
	app.net_waiting(false); // deactivate the overlay so the user can continue
};



var ajaxh = new AJAXHelper(parent, logger, wi_handler);
var submit = function(){
	app.net_waiting(true);
	ajaxh.submit(app.author_id(), app.questions.allItems());
};

resetPhase();
app.homework.loadHWFile();

////do a "hard unhide" of the overlay
//$(function () {
//    $('.overlay').removeClass('hidden');
//});