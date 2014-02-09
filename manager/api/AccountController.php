<?php
/*
*
*/
class Account
{

	public function test($id) {
	    var_dump($id);
	}

	public function getTest() {
		$curl = new Curl(URL_API . "/doc");
		$response = $curl->get();
		echo "ok";
	}

	public function login($data)
	{
		if (empty($data) === false)
		{
			$data->user_password = Form::generatePassword($data->user_password);
			$curl = new Curl(URL_API . "/login",  (array)$data);
			$response = $curl->post();
			$response = json_decode($response);
			if (isset($response->error)) {
				header("HTTP/1.0 403 Forbidden");
			} else {
				$content['session'] = (array)$response->session;
				$header['success'] = (array)$response->success;
				Session::create(json_encode($content), json_encode($header));
				unset($curl);
			}
		} else {
			header("HTTP/1.0 400 Bad Request");
		}
	}
}
?>