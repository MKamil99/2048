<?php header("Content-Type: application/json"); 

// Getting data from local file (or creating file if it doesn't exist)
// and sending it to html by print_r function:
$fileContent = null;
if (file_exists("data.json") && file_get_contents("data.json") != null) 
    $fileContent = json_decode(file_get_contents("data.json"), true);
if ($fileContent == null) 
    $fileContent = array("size4"=>[], "size5"=>[], "size6"=>[]);
file_put_contents("data.json", json_encode($fileContent));

print_r(json_encode($fileContent));
?> 
