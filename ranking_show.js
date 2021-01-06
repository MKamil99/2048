//                        2048
//      Limanówka Dominika, Matula Kamil, Różycki Iwo
// Projekt zaliczeniowy z przedmiotu Mobilne Aplikacje Webowe

// References to HTML elements:
var sizeNumber = document.getElementById("ranking-size-value"); 
var rankingListDiv = document.getElementById("ranking-list");

// Setting onclick attributes to HTML elements:
document.getElementById("rankingPlusButton").setAttribute("onclick",  "javascript: extendSize()");
document.getElementById("rankingMinusButton").setAttribute("onclick", "javascript: reduceSize()");

// Other attributes:
var rankingList = null;
readFile();




// Reaction for clicking -/+ buttons:
function reduceSize() 
{ 
    if (parseInt(sizeNumber.innerHTML) > 4) 
    {
        document.getElementById("ranking-size-value").innerHTML = parseInt(sizeNumber.innerHTML) - 1;
        buildRanking();
    }
}
function extendSize()
{ 
    if (parseInt(sizeNumber.innerHTML) < 6) 
    {
        document.getElementById("ranking-size-value").innerHTML = parseInt(sizeNumber.innerHTML) + 1;
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