// References to HTML elements:
var sizeNumber = document.getElementById("size"); 
var rankingListDiv = document.getElementById("ranking-list");

// Other attributes:
var rankingList = null;
readFile();

// Reaction for clicking -/+ buttons:
function reduceSize() 
{ 
    if (parseInt(sizeNumber.innerHTML) > 4) 
    {
        document.getElementById("size").innerHTML = parseInt(sizeNumber.innerHTML) - 1;
        buildRanking();
    }
}
function extendSize()
{ 
    if (parseInt(sizeNumber.innerHTML) < 7) 
    {
        document.getElementById("size").innerHTML = parseInt(sizeNumber.innerHTML) + 1;
        buildRanking();
    }
}

// Reading ranking from .json file by using PHP:
function readFile()
{
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "ranking_show.php", true);
    xhr.onreadystatechange = function () { 
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            rankingList = JSON.parse(this.responseText);
            buildRanking();
        }
    }; 
    xhr.send();
}

// Building ranking list and displaying it in HTML:
function buildRanking()
{
    let keyName = "size" + sizeNumber.innerHTML;
    rankingListDiv.innerHTML = "";
    for (let i = 0; i < rankingList[keyName].length; i++)
    {
        let record = document.createElement("div");

        let nickText = document.createElement("p");
        nickText.innerHTML = `${i+1}. ${rankingList[keyName][i].nick}`;
        record.appendChild(nickText);

        let scoreText = document.createElement("p");
        scoreText.innerHTML = rankingList[keyName][i].score;
        record.appendChild(scoreText);

        rankingListDiv.appendChild(record);
    }
}