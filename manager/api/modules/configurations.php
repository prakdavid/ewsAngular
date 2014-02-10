<?php
define('WEBROOT', '/');
//Conf
define('URL_API', 'https://api.ews-network.net/');
define('PASSWORD_SALT', hash('sha512', 'ews-network!42!'));
define('COOKIE_NAME', 'session');
define('COOKIE_PATH', WEBROOT);
?>