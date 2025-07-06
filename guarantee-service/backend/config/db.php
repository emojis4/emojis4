<?php
    // error_reporting(E_ALL);
    // ini_set('display_errors', 'On');
    require "rb-mysql.php";
    R::setup('mysql:host=localhost;dbname=guarantee-service', 'root', 'root');
    session_start();
