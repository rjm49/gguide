<?php

$fname = "./log.txt";

$method = $_SERVER['REQUEST_METHOD'];
if($method=='POST'){
		$data = file_get_contents('php://input');
		$result = file_put_contents ( $fname , $data , FILE_APPEND );

		if($result){
			print(200);
		}else{
			print(500);
		}
}
else{
	print(400);
}

?>