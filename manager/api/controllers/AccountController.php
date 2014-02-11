<?php
/*
*
*/
class Account
{

	public function test() {
		setcookie(COOKIE_NAME, undefined);
	}

	public function getTest() {
		$curl = new Curl(URL_API . "doc");
		$response = $curl->get();
		echo "ok";
	}

	public function login($data)
	{
		if (empty($data) === false)
		{
			$data->user_password = Form::generatePassword($data->user_password);
			$curl = new Curl(URL_API . "login",  (array)$data);
			$response = $curl->post();
			$response_obj = json_decode($response);
			if (isset($response_obj->error)) {
				header("HTTP/1.0 401 Unauthorized");
			} else {
				list($header, $content) = explode("\r\n\r\n", $response, 2);
				Session::create($content, $header);
				unset($curl);
				echo $content;
			}
		} else {
			header("HTTP/1.0 400 Bad Request");
		}
	}

	// Log out the user
	public function logout()
	{
		$curl = new Curl(URL_API . 'logout');
		$response = $curl->post();
		$this->response($response, 'dashboard');
		Session::delete();
	}

	// public function register($data)
	// {
	// 	if (empty($data) === false)
	// 	{	

	// 		$data->user_password = Form::generatePassword($data->user_password);

	// 		$curl = new Curl(URL_API . "account/create", (array)$data);
	// 		$response = $curl->post();


	// 	}
	// 	else
	// 		header("HTTP/1.0 400 Bad Request");
	// }
}
?>