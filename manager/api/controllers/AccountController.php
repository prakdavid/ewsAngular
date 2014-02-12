<?php
/*
*
*/
class Account
{

	public function test() {
		echo "ici test()";
		var_dump($_SESSION);
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
		echo "log out in php";
		$curl = new Curl(URL_API . 'logout');
		$response = $curl->post();
		var_dump($response);
		Session::delete();
	}

	public function edit($data)
	{
		if (empty($data) === false)
		{
			$curl = new Curl(URL_API . "account/" . $_SESSION['session']['accountid'] . "/modify", $data);
			$response = $curl->put();
			$response = json_decode($response, true);
			if (!(isset($response['error']) and !empty($response['error'])))
			{
				$session['session'] = array(
					'accountmail' => $_POST['account_mail'],
					'accountname' => $_POST['account_name'],
					'accounttype' => $_POST['account_type']
				);
				Session::update($session);
			} else {
				header("HTTP/1.0 ". $response['error']);
			}
		} else {
			header("HTTP/1.0 400 Bad Request");
		}
	}

	public function delete()
	{
		// $curl = new Curl(URL_API . 'account/' . $_SESSION['session']['accountid'] . '/delete');
		// $response = $curl->delete();
		echo "Must delete account";
	}

	public function getUserList()
	{	
		$curl = new Curl(URL_API . 'account/' . $_SESSION['session']['accountid'] . '/users/list');
		$response = $curl->get();
		echo $response;
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