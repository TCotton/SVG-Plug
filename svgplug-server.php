<?php

// Create JSON file of current low resolution images

// use opendir and readdir functions to access content of image file
$handle = opendir('images/l');

while ($file = readdir($handle)) {

    // create json file
    $json[] = array('file' => $file);

}

if ($json !== null) {

    // if directory doesn't exist then make it
    if (!is_dir(dirname(__file__) . '/' . 'json')) {

        mkdir(dirname(__file__) . '/' . 'json');
        chmod(dirname(__file__) . '/' . 'json', 0777);

    }

    // Create json file for use in JavaScript
    $jsonFile = "low-resulution-images.json";

    // create file
    $fileHandle = fopen(dirname(__file__) . '/' . 'json' . '/' . $jsonFile, 'w');

    // write to file
    fwrite($fileHandle, json_encode($json));

    // close file
    fclose($fileHandle);

}

?>