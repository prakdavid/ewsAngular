<?php

// include all php files
foreach (glob("../**/*.php") as $filename)
{
    require_once $filename;
}

// fetch data received from POST
$received = json_decode(file_get_contents("php://input"));

// Pointeurs des fonctions des class
if (isset($received)) {
    // Class dynamic
    $class_name = $received->class;
    $classController = new $class_name();

    // Fonciton dynamic
    $func = $received->function;
    if (isset($received->data)) {
        $classController->$func($received->data);
    } else {
        $classController->$func();
    }
} else {
    header("HTTP/1.0 400 Bad Request");
}
?>