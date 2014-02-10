<?php
/**
 * Class Session: vérifie, crée et détruit les sessions
 */
class Session
{
    public static function add($json = null)
    {
        if (isset($_SESSION['session']))
        {
            if (!is_null($json))
            {
                $json = json_decode($json, true);
                if (isset($json['success']))
                    unset($json['success']);
                $_SESSION = array_merge($_SESSION, $json);
            }
        }
    }
    
	public static function create($json, $header)
	{
		$json = json_decode($json, true);
        if (isset($json['success']))
            unset($json['success']);
		$_SESSION = $json;
		if (preg_match('/^Set-Cookie:\s*([^;]*)/mi', $header, $array))
		{
            parse_str($array[1], $cookie);
            setcookie(COOKIE_NAME, $cookie[COOKIE_NAME], time() + (3600 * 24), COOKIE_PATH);
		}
	}

	public static function delete()
	{
		Cache::deleteAllBySession();
		session_destroy();
		unset($_SESSION);
        setcookie(COOKIE_NAME, NULL, -1);
	}
    
	
	public static function load($controller, $action)
	{
		if ($controller != '404')
		{
			if (empty($_SESSION['session']) and !empty($_COOKIE[COOKIE_NAME]))
				setcookie(COOKIE_NAME, NULL, -1);
			else if (!empty($_SESSION['session']) and empty($_COOKIE[COOKIE_NAME]))
				unset($_SESSION);

			if (!empty($_SESSION['session']) and !empty($_COOKIE[COOKIE_NAME]))
			{
				if ($controller == 'account' and $action == 'index')
					header('Location:' . WEBROOT . 'dashboard');
			}
			else
			{
				if (empty($_SESSION['session']) or empty($_COOKIE[COOKIE_NAME]))
				{
					if ($controller != 'account')
						header('Location:' . WEBROOT . 'account');
					else if ($controller == 'account' and $action != 'index')
						header('Location:' . WEBROOT . 'account');
				}
			}
		}
	}
    
    public static function response($response)
    {
        $_SESSION['response'] = array();
        $_SESSION['response'] = $response;
    }
	
	public static function start()
	{
		session_start();
	}

	public static function update($data)
	{
		foreach ($data as $key => $value)
		{
			if ($key == "session")
			{
				foreach ($value as $sessionKey => $sessionValue)
					$_SESSION['session'][$sessionKey] = $sessionValue;
			}
		}
	}
}

?>
