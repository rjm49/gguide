/**
 * this module just holds functions pertaining to scoring HW problems
 */

function create_exs(f, exs){ //f:string is form ID, exs:string[][] is the exercises, inner els are [q, hint, ans] format 
	console.log(f);

//	var div = calledfrom.parentElement;
//	
//	$form = $("<form id="+f+"></form>");
//	div.prepend($form);
	
	$form = $(f);
	
	for(var i=0; i<exs.length; i++){
//		$(f).append('<label>'+exs[i][0]+'</label> <label>('+ exs[i][1]+')</label><br>');
//		$(f).append('<input name="a' +i+ '" class="exercise-input" type="text" placeholder="your guess here.."></input><br>');
//		$(f).append('<input name="h'+i+'" type="hidden" value="'+exs[i][2]+'"><br><output name="o'+i+'"></output><br>');
		$form.append('<label>'+exs[i][0]+'</label> <label>('+ exs[i][1]+')</label><br>');
		$form.append('<input name="a' +i+ '" class="exercise-input" type="text" placeholder="your guess here.."></input><br>');
		$form.append('<input name="h'+i+'" type="hidden" value="'+exs[i][2]+'"><br><output name="o'+i+'"></output><br>');
		console.log(i);
		console.log($form);
	}
	$form.append('<input type="button" value="check my answers!" onclick="score(this.form)">');
	$form.append('<input type="hidden" value="'+exs.length+'">');
}

//TODO raw js function to score exercise forms ... probably this should live somewhere else!
function score(form){
	console.log(form);
	var fss = form.getElementsByTagName("output");
	for(var i=0; i<fss.length; i++){
		var ans = form["a"+i].value;
		var hid = form["h"+i].value;
		var out = form["o"+i];
	
		console.log(ans);
		console.log(hid);
		
		if(ans==hid){
			out.value = "correct!";
			out.style.backgroundColor = "hsl(120,80%,80%)";
		}else{
			out.value = "sorry! Try again..";		
			out.style.backgroundColor = "hsl(30,80%,80%)";
		}
	}
}