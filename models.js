var Exercise = function(_initial, _attempt, _score, _next, _level, _tag) {
	var self = this;
	self.initial = ko.observable(_initial);
	self.attempt = ko.observable(_attempt);
	self.score = ko.observable(_score);
	self.next = ko.observable(_next);
	self.level = ko.observable(_level);
	self.tag = _tag;
};

var ExerciseListModel = function() {
	// function BetterListModel(){
	var self = this;
	this.submitted = ko.observable(false);

	this.ajax_handler = new AJAXHelper(self, logger);

	this.allItems = ko.observableArray();

	this.removeAll = function() {
		this.allItems.removeAll();
	};

	this.loadQuestions = function(phase) {
		self.allItems.removeAll(); // = ko.observableArray();

		console.log("re-loading question data: "+ phase);
		$.getJSON("past_" + phase + ".json", function(json) {
			console.log(json); // this will show the info it in firebug console
			ko.utils.arrayForEach(json, function(item) {
				self.allItems.push(new Exercise(item.initial, item.attempt,
						item.score, "This is a test sentence.", item.level, item.tag));
			});
		});
	}
};



/*
 * MODELS FOR HOMEWORK SECTION NOW FOLLOW...
 */
function HomeworkModel(_tag, _description, _level, _html) {
	var self = this;
	self.description = ko.observable(_description);
	self.tag = ko.observable(_tag);
	self.level = ko.observable(_level);
	self.html = ko.observable(_html);
}

var HomeworkListModel = function() {
	// function BetterListModel(){
	var self = this;

	this.allItems = ko.observableArray();
	this.hw_by_tag = {};
	this.tags = [];


//	this.removeSelected = function() {
//	this.allItems.removeAll(this.selectedItems());
//	this.selectedItems([]); // Clear selection
//	};

	this.removeAll = function() {
		this.allItems.removeAll();
	};

	this.sortItems = function() {
		this.allItems.sort();
	};

	this.loadHWFile = function() {
		console.log("re-loading homework data");
		//exercises.removeAll(); // = ko.observableArray();

		console.log("getting json");
		$.getJSON("past_hw.json", function(json) {

			ko.utils.arrayForEach(json, function(hw) {
				console.log("hw="+hw);
				self.tags.push(hw.tag);
				self.hw_by_tag[hw.tag] = hw;
			});
		});

		console.log("Homework items loaded from file:");
		console.log(self.hw_by_tag);
	};


	this.populateHW = function(items, track) {
		self.allItems.removeAll();
		var already_here = [];

		ko.utils.arrayForEach(items, function(item) {

			var tag = item.tag;
			var item_score = item.score();
			
			if (track == "S" || (track == "A" && item_score < 0)) { //tests eligibility
				if (already_here.indexOf(tag) < 0) { //prevents duplicates
					already_here.push(tag);

					console.log("Pop/d -> " + tag);
					
					var hw = self.hw_by_tag[tag];
					var html_content = "";
					$.ajax({
						type : 'GET',
						url : './lessons/' + tag + '.html',
						success : function(file_html) {
							self.allItems.push(new HomeworkModel(hw.tag,
									hw.description, hw.level, file_html));
						}
					});
				}
			}
		});
	}; //end fn

}

