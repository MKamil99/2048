<?php header("Content-Type: application/json"); 

// Receiving data from html:
$submit = json_decode(file_get_contents("php://input")); 

// Getting data from local file:
$fileContent = null;
if (file_exists("data.json") && file_get_contents("data.json") != null) 
    $fileContent = json_decode(file_get_contents("data.json"), true);
if ($fileContent == null) 
    $fileContent = array("size4"=>[], "size5"=>[], "size6"=>[], "size7"=>[]);

// Finding accurate ranking list:
$submitSize = $submit->size;
$accurateRanking = $fileContent[$submitSize];

// Pushing submit to ranking, sorting it and reducing to top 10 (usort example comes from: 
// https://stackoverflow.com/questions/4282413/sort-array-of-objects-by-object-fields)
$submitName = $submit->nick;
$submitScore = $submit->score;
$newRecord = array("nick"=>$submitName, "score"=>$submitScore);
array_push($accurateRanking, $newRecord);
usort($accurateRanking, function($first,$second) { 
    return $first["score"] < $second["score"] ? 1 : -1;
});
$tmp = array_slice($accurateRanking, 0, 10, true);

// Setting new ranking in file:
$fileContent[$submitSize] = $tmp;
file_put_contents("data.json", json_encode($fileContent));

// Searching for answer where player is on the list
for($i = 0; $i < count($accurateRanking); $i++)
    if ($accurateRanking[$i] == $newRecord) break;
print_r($i < 10 ? $i + 1 : "You are not on the list! :(");
?> 