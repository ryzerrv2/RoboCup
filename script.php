<?php
	function err_message($message) {
		$res = Array(
			"ErrorMessage" => $message,
		);
		return json_encode($res, JSON_PRETTY_PRINT);
	}

	$FileName = "registry.json";
	$JsonData = file_get_contents($FileName);
	switch ($_SERVER['REQUEST_METHOD']) {
		case "POST":
			// read payload
			$payload = file_get_contents('php://input');
			
			// from JSONS -> associative array
			$params = json_decode($payload, true);
			
			if ($params === null) {
				header("HTTP/1.1 400 Not Found");
				echo err_message("Params are not valid");
			} 
			else {
				$UserData = json_decode($JsonData, true);
				$NewUserData = new stdClass();
				foreach($params as $key => $value) {
					if ($key === "E-Mail" && $UserData) {
						foreach($UserData as $row) {
							if($value === $row[$key]) {
								header("HTTP/1.1 409 Conflict");
								echo err_message("User already exists.");
								return;
							}
						}
					}
					$NewUserData->$key = $value;
				}
			}
			$UserData[] = $NewUserData;
			$JsonEncode = json_encode($UserData, JSON_PRETTY_PRINT);
			file_put_contents($FileName, $JsonEncode);
			header("HTTP/1.1 201 OK");
			echo $JsonEncode;
			break;

		case 'GET':
			if($JsonData) {
				header("HTTP/1.1 200 OK");
				echo $JsonData;
			}
			else {
				header("HTTP/1.1 404 Not Found");
				echo err_message("No User stored.");
			}
			
			break;
	}
?>