<?php
/*
* class Curl: Regroupe l'ensemble des curls
*/
class Curl
{
	private $_url;
	private $_json;
	private $_response;

	function __construct($url = null, $json = null)
	{
		$this->setUrl($url);
		$this->setJson($json);
		$this->setResponse(null);
	}

	public function getJson()
	{
		return ($this->_json);
	}

	public function getResponse()
	{
		return ($this->_response);
	}

	public function getUrl()
	{
		return ($this->_url);
	}

	public function setJson($json)
	{
		if (!is_null($json))
		{
			$json = array_change_key_case($json, CASE_UPPER);
			$json = json_encode($json);
			$json = str_replace('\/', '/', $json);
		}
		$this->_json = $json;
	}

	public function setResponse($response)
	{
		$this->_response = $response;
	}

	public function setUrl($url)
	{
		$this->_url = $url;
	}
	
	public function curl($curl)
	{
		curl_setopt($curl, CURLOPT_URL, $this->getUrl());
		curl_setopt($curl, CURLOPT_HEADER, false);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl, CURLOPT_TIMEOUT, 20);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
		return ($curl);
	}
    
    public function error($curl, $response = null)
    {
        $error = array();
        if (curl_errno($curl) > 0)
        {
            $error['error'] = 'Curl error';
            $error['reason'] = curl_error($curl);
            $response = json_encode($error);
            $this->setResponse($response);
        }
        else
        {
            $http = curl_getinfo($curl);
            if ($http['http_code'] < 200 or $http['http_code'] > 226)
            {
                /*if (!is_null($response))
                {
                    if (preg_match("#^HTTP\/#", $response))
                    {
                        list($header, $response) = explode("\r\n\r\n", $response, 2);
                        $this->setResponse($response);
                    }
                }
                else*/
                $this->setResponse(json_encode(array('error' => $http['http_code'], 'reason' => $this->http_response($http['http_code']))));
            }
        }
    }
	
	public function sendCookie($curl)
	{
		if (!empty($_SESSION['session']))
        {
            $cookie = COOKIE_NAME . '=' . $_COOKIE[COOKIE_NAME];
			curl_setopt($curl, CURLOPT_COOKIE, $cookie);
        }
		return ($curl);
	}
	
	public function getCookie($curl)
	{
		if (empty($_SESSION['session']))
		{
			if ($this->getUrl() == URL_API . 'login')
			{
				curl_setopt($curl, CURLOPT_HEADER, true);
				curl_setopt($curl, CURLOPT_COOKIESESSION, true);
			}
		}
		else
			$curl = $this->sendCookie($curl);
		return ($curl);
	}
	
	public function delete()
	{
		if (!is_null($this->getUrl()))
		{
			$curl = curl_init();
			$curl = $this->curl($curl);
			curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "DELETE");
			$curl = $this->sendCookie($curl);
			$response = curl_exec($curl);
            $this->setResponse($response);
            $this->error($curl);
			curl_close($curl);
		}
		return ($this->getResponse());
	}
    
	public function get()
	{
		if (!is_null($this->getUrl()))
		{
			$curl = curl_init();
			$curl = $this->curl($curl);
			$curl = $this->sendCookie($curl);
			$response = curl_exec($curl);
            $this->setResponse($response);
            $this->error($curl);
			curl_close($curl);
		}
		return ($this->getResponse());
	}
    
    public function http_response($http_code = null)
    {
        if (!is_null($http_code))
        {
            switch ($http_code)
            {
                case 100: return ('Continue'); break;
                case 101: return ('Switching Protocols'); break;
                case 200: return ('OK'); break;
                case 201: return ('Created'); break;
                case 202: return ('Accepted'); break;
                case 203: return ('Non-Authoritative Information'); break;
                case 204: return ('No Content'); break;
                case 205: return ('Reset Content'); break;
                case 206: return ('Partial Content'); break;
                case 300: return ('Multiple Choices'); break;
                case 301: return ('Moved Permanently'); break;
                case 302: return ('Moved Temporarily'); break;
                case 303: return ('See Other'); break;
                case 304: return ('Not Modified'); break;
                case 305: return ('Use Proxy'); break;
                case 400: return ('Bad Request'); break;
                case 401: return ('Unauthorized'); break;
                case 402: return ('Payment Required'); break;
                case 403: return ('Forbidden'); break;
                case 404: return ('Not Found'); break;
                case 405: return ('Method Not Allowed'); break;
                case 406: return ('Not Acceptable'); break;
                case 407: return ('Proxy Authentication Required'); break;
                case 408: return ('Request Time-out'); break;
                case 409: return ('Conflict'); break;
                case 410: return ('Gone'); break;
                case 411: return ('Length Required'); break;
                case 412: return ('Precondition Failed'); break;
                case 413: return ('Request Entity Too Large'); break;
                case 414: return ('Request-URI Too Large'); break;
                case 415: return ('Unsupported Media Type'); break;
                case 500: return ('Internal Server Error'); break;
                case 501: return ('Not Implemented'); break;
                case 502: return ('Bad Gateway'); break;
                case 503: return ('Service Unavailable'); break;
                case 504: return ('Gateway Time-out'); break;
                case 505: return ('HTTP Version not supported'); break;
                default:
                    return ('Unknown http status code "' . $http_code . '"');
                    break;
            }
        }
    }
	
	public function post()
	{
		if (!is_null($this->getUrl()))
		{
			$curl = curl_init();
			$curl = $this->curl($curl);
			curl_setopt($curl, CURLOPT_HTTPHEADER, array("Content-type: application/json"));
			$curl = $this->getCookie($curl);
			curl_setopt($curl, CURLOPT_POST, true);
			curl_setopt($curl, CURLOPT_POSTFIELDS, $this->getJson());
			$response = curl_exec($curl);
            $this->setResponse($response);
            $this->error($curl, $response);
			curl_close($curl);
		}
		return ($this->getResponse());
	}
	
	public function put()
	{
		if (!is_null($this->getUrl()))
		{
			$put = tmpfile();
            $json = $this->getJson();
            fwrite($put, $json);
            fseek($put, 0);
            
			$curl = curl_init();
			$curl = $this->curl($curl);
			curl_setopt($curl, CURLOPT_HTTPHEADER, array("Content-type: application/json"));
			$curl = $this->sendCookie($curl);
			curl_setopt($curl, CURLOPT_PUT, true);
            curl_setopt($curl, CURLOPT_INFILE, $put);
            curl_setopt($curl, CURLOPT_INFILESIZE, strlen($json));
			$response = curl_exec($curl);
            $this->setResponse($response);
            $this->error($curl);
			curl_close($curl);
            fclose($put);
		}
		return ($this->getResponse());
	}
}
?>
