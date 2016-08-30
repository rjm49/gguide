//var xhr = new XMLHttpRequest();
//xhr.open("GET", "https://www.codecademy.com/", false);
//xhr.send();
//
//console.log(xhr.status);
//console.log(xhr.statusText);

//PUT /account/account_id/text/id
var json = {"text": "Some text to be assessed", "author_id": "id of the author", "task_id" : "id of the task", "question_text": "Th"};
//var author_id = "test_author";


var AJAXHelper = function(parent, logger, _handler){
	var self = this;
	
	this.acct_id = "AQPXOSIHALCHANMR";
	this.proxy_url = './ajaxtest.php';
	this.url_base = 'https://api-staging.englishlanguageitutoring.com/VERSION/account/ACCTID/';
	this.url = self.url_base.replace("VERSION","v0.3.0").replace("ACCTID",self.acct_id);
	
	this.secret_token = "91cJSaKZYGiqOfiRgcdigkF61yDP0UfnazqG9Zi_P";
	this.handler = _handler;
	
	this.jsonise = function(author_id, items){
//		var in_str = "The quick brown fox jumps over the lazy dog. This is a test string.";
		var in_str = "";
		var j = {};
		ko.utils.arrayForEach(items, function(item){
			
			console.log(item);
			
			var txt = item.buildAnswer(); //extract the user's latest effort
			in_str = in_str.concat(txt).concat(" ");
		});
		
		j["text"]=in_str;
		j["author_id"]=author_id;
//		j["session_id"]="gg_test_session";
		j["task_id"]="gg_test_task";
//		j["sequence_id"]=1;
		j["test"]=1;
		j["question_text"]="N/A";

		
		console.log(j);
		return j;
	}
	
	this.get = function(call_url, handler){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', self.proxy_url);
		console.log("AJAXing to: " + call_url);
		xhr.setRequestHeader('X-Proxy-URL', call_url);
		xhr.onload = function() {
			if (xhr.readyState === xhr.DONE) {
		        if (xhr.status === 200) {
		        	console.log("call successful");
		            handler(xhr.response);
		        }else{
		        	console.log("call failed");
		        	console.log(xhr.response);
		        }
	        }
		};
		xhr.send();		
	}
	
	this.put = function(call_url, data){
		var xhr = new XMLHttpRequest();
		xhr.open('PUT', self.proxy_url);
		console.log("AJAXing to: " + call_url);
		xhr.setRequestHeader('X-Proxy-URL', call_url);
		xhr.onload = function() {
			if (xhr.readyState === xhr.DONE) {
		        if (xhr.status === 200) {
		        	console.log("call successful");
		            console.log(xhr.response);
		        }else{
		        	console.log("call failed");
		        	console.log(xhr.response);
		        }
	        }
		};
		
		console.log(xhr);
		console.log(JSON.stringify(data));	
		xhr.send(JSON.stringify(data));		
	}
	
	this.submit = function(author_id, dataObject){
		var j = self.jsonise(author_id, dataObject);		
		var url = self.url_base.replace("VERSION","v0.3.0").replace("ACCTID",self.acct_id);
		
		var ts = new Date().getTime();
		var call_url = url+"text/"+ts;
		var results_url = call_url+"/results";
		console.log("Call URL is: " + call_url);
		
//		$.ajaxSetup({
//		    contentType : 'application/json',
//		    processData : false
//		});
//		
//	    $.ajax({
//	        url: call_url,
//	        type: 'PUT',
//	        data: JSON.stringify(j),
////	        data: 'The quick brown fox jumps over the lazy dog.',
//	        contentType: 'application/json',
//			beforeSend: function (xhr) {
//				xhr.setRequestHeader ('Authorization', 'Token token=' + self.secret_token);
//				xhr.setRequestHeader('X-Proxy-URL', call_url);
//			},
//	        success: function(result) {
//	            console.log('got results from W&I');
//	        	console.log(result);
//	        }
//	    });

		self.put(call_url, j);
	    self.poll(results_url, dataObject, self.handler);
	}

	this.retrieve = function(){
		var rsp = {
				"type": "success",
				"code": 200,
				"overall_score": 2.64069,
				"sentence_scores": [
				[0, 44, -1],
				[46, 61, -0.457825],
				[62, 75, -1]
				],
				"suspect_tokens": [],
				"textual_errors": [
				[15, 20, "famous", "S"],
				[62, 64, "I'm", "MP"],
				[69, 74, "sure", "S"]
				]
				};

				return rsp;
			
//			$.getJSON(url, 
//						function(data){
//							alert(data);
//						});
	}

	
	this.poll = function(results_url, items){
		setTimeout(function(){			
			$.ajax({
				url: self.proxy_url, 
				dataType: "json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('X-Proxy-URL', results_url);
				},
				success: function(data){	    	 
					if( data["type"]=="results_not_ready" ){
						console.log("polling...");
						self.poll(results_url, items);
					}else{
						self.handler(data, items)
					}
				}
			});
		}, 2000);
	};
		
}



//function poll(results_url, items){
//	   setTimeout(function(){
//	      $.ajax({ url: results_url, success: function(data){	    	 
//	    	if( data["type"]=="results_not_ready" ){
//	    		process_response(data, items)
//	    	}else{
//	    		poll();	    		
//	    	}
//	      }, dataType: "json"});
//	  }, 2000);
//	}