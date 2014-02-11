<?php

class Clouds
{
	public function cloudaccount()
	{
		var_dump($_SESSION);
		echo "toutotu";
		// $curl = new Curl(URL_API . "clouds/" . $_SESSION['session']['accountid'] . "/cloudaccounts");
		// $clouds = $curl->get();
		// $this->response($clouds);
		// Session::add($clouds);
		// $cloudaccountsbyname = array();
		// $cloudaccountsbyid = array();
		// if (isset($_SESSION['cloudaccounts']) and !empty($_SESSION['cloudaccounts']))
		// {
		// 	foreach($_SESSION['cloudaccounts'] as $cloudaccounts)
		// 	{
		// 		$cloudaccountid = $cloudaccounts['cloudaccountid'];
		// 		$cloudname = $cloudaccounts['cloudname'];
		// 		unset($cloudaccounts['cloudaccountid']);
		// 		$cloudaccountsbyid[$cloudaccountid] = $cloudaccounts;
		// 		$cloudaccounts['cloudaccountid'] = $cloudaccountid;
		// 		unset($cloudaccounts['cloudname']);
		// 		$cloudaccountsbyname[$cloudname][] = $cloudaccounts;
		// 	}
		// 	unset($_SESSION['cloudaccounts']);
		// }
		// $_SESSION['cloudaccountsbyname'] = $cloudaccountsbyname;
		// $_SESSION['cloudaccountsbyid'] = $cloudaccountsbyid;

		// Cache::create('menu.php', ROOT_VIEWS_TEMPLATE);
		// if (is_null($redirect))
		// 	$this->redirect('dashboard');
		// else
		// 	$this->redirect($redirect);
	}
}
?>