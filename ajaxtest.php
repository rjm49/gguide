<?php

$debug = false;

$acct_id = "AQPXOSIHALCHANMR";
$url_base = 'https://api-staging.englishlanguageitutoring.com/VERSION/account/ACCTID/versions';

$url = str_replace("ACCTID",$acct_id,$url_base);
$url = str_replace("VERSION","v0.3.0",$url);

$secret_token = "91cJSaKZYGiqOfiRgcdigkF61yDP0UfnazqG9Zi_P";

function decho($s){
	if($debug){
		echo $s;
	}
}

function CallAPI($method, $url, $data = false)
{
	$curl = curl_init();
	$secret_token = "91cJSaKZYGiqOfiRgcdigkF61yDP0UfnazqG9Zi_P";
		
	switch ($method){
		case "POST":
			curl_setopt($curl, CURLOPT_POST, 1);
			if ($data)
				curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
			break;
		case "PUT":
			//curl_setopt($chlead, CURLOPT_CUSTOMREQUEST, "PUT");
			curl_setopt($curl, CURLOPT_POSTFIELDS,$data);
			
			curl_setopt($ch, CURLOPT_PUT, true);
			curl_setopt($ch, CURLOPT_INFILE, file_get_contents("php://input"));
			//curl_setopt($ch, CURLOPT_INFILESIZE, strlen($data));
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			
			break;
		default:
			if ($data)
				$url = sprintf("%s?%s", $url, http_build_query($data));
	}

	// Optional Authentication:
// 	curl_setopt($curl, 'Authorization', 'Token token=' . $secret_token);
//	curl_setopt($curl, CURLOPT_USERPWD, "username:password");

	curl_setopt($curl, CURLOPT_HTTPHEADER, array(
		'Content-Type: application/json',
// 	'Content-Length: ' . strlen($data_string))
		'Authorization: Token token=' . $secret_token
		)
	);
	
	curl_setopt($curl, CURLOPT_URL, $url);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

	$result = curl_exec($curl);

	curl_close($curl);

	return $result;
}

// get the q parameter from URL
// $q = $_REQUEST["q"];

// $hint = "";

// // lookup all hints from array if $q is different from "" 
// if ($q !== "") {
//     $q = strtolower($q);
//     $len=strlen($q);
//     foreach($a as $name) {
//         if (stristr($q, substr($name, 0, $len))) {
//             if ($hint === "") {
//                 $hint = $name;
//             } else {
//                 $hint .= ", $name";
//             }
//         }
//     }
// }

// // Output "no suggestion" if no hint was found or output correct values 
// echo $hint === "" ? "no suggestion" : $hint;

//xhr.setRequestHeader('X-Proxy-URL', call_url);

// $purl = $_SERVER['X-Proxy-Url'];
// if($purl){
// 	$url = $purl; 
// }


// decho("calling " . $url);

// print(callAPI($_SERVER['REQUEST_METHOD'], $url, false));

//- - - - - working code below ;)

//echo "Request method be:" . $_SERVER['REQUEST_METHOD'] . "\n";

// $headers = apache_request_headers();
// foreach ($headers as $header => $value) {
// 	echo "$header: $value <br />\n";
// }

// echo "server params:\n";
// echo var_dump($_SERVER);

$purl = $_SERVER['HTTP_X_PROXY_URL'];
$method = $_SERVER['REQUEST_METHOD'];
// echo $purl;

// $data = file_get_contents("php://input");
// echo "contents are: \n";
// echo $data;
// $data_json = json_encode($data);
// echo $data_json;
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $purl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

switch ($method){
	case 'PUT':
		$data = file_get_contents('php://input');
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: Token token=' . $secret_token, 'Content-Type: application/json', 'Content-Length: ' . strlen($data)));
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
		curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
// 		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		break;
// 	case 'GET':
	default: //i.e. GET
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: Token token=' . $secret_token, 'Content-Type: application/json'));
		break;
}
// echo "\nCH = \n";
// echo var_dump($ch);

$response  = curl_exec($ch);
curl_close($ch);

print($response);

?>