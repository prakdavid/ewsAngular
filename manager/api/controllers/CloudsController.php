<?php

class Clouds
{
	public function cloudaccount()
	{
		$curl = new Curl(URL_API . "clouds/" . $_SESSION['session']['accountid'] . "/cloudaccounts");
		$clouds = $curl->get();
		$response_obj = json_decode($clouds);
		if (isset($response_obj->error)) {
			header("HTTP/1.0 ". $response_obj->error);
		} else {
			Session::add($clouds);
			$cloudaccountsbyname = array();
			$cloudaccountsbyid = array();
			if (isset($_SESSION['cloudaccounts']) and !empty($_SESSION['cloudaccounts']))
			{
				foreach($_SESSION['cloudaccounts'] as $cloudaccounts)
				{
					$cloudaccountid = $cloudaccounts['cloudaccountid'];
					$cloudname = $cloudaccounts['cloudname'];
					unset($cloudaccounts['cloudaccountid']);
					$cloudaccountsbyid[$cloudaccountid] = $cloudaccounts;
					$cloudaccounts['cloudaccountid'] = $cloudaccountid;
					unset($cloudaccounts['cloudname']);
					$cloudaccountsbyname[$cloudname][] = $cloudaccounts;
				}
				unset($_SESSION['cloudaccounts']);
			}
		}
		$_SESSION['cloudaccountsbyname'] = $cloudaccountsbyname;
		$_SESSION['cloudaccountsbyid'] = $cloudaccountsbyid;
		echo json_encode($_SESSION);
	}
}
?>