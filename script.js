var array = null;
var currentText = null;
var active = false;
var easy = true;
var counter = 0;
var letterCount = 0;
var totalWords = 0;
var totalErrors = 0;
var time = 0;
var topSpeed = 0;
var maxSpeed = 0;

var averageArray = [];


setInterval(function() {
    if (active) {
        time++;
    }
}, 1000);

// This function generates random text everytime the page is refreshed or the old set of words are completed.
function generateText() {
    var easyText = ["a", "s", "d", "w", "r", "t", "h", "j", "n", "m", "i", "o", "v", "e", "f"];
    var hardText = ["g", "h", "z", "x", "c", "b", "k", "y", "q", "p", "u", "n", "m", "v", "l"];
    var string = "";
    letterCount = 0;
    while (true) {
        if (easy) {
            string = createWords(easyText, string);
        } else {
            string = createWords(hardText, string);
        }
        if (letterCount > 120) {
            break;
        }
    }
    displayText(string);
}

// This function is responsible for generating words. The words can be one to six letters long.
function createWords(array, string) {
    var wordLength = Math.ceil(Math.random() * 6);
    if (letterCount > 0) {
        string = string + " ";
        totalWords++;
    }
    for (var i = 0; i < wordLength; i++) {
        var character = Math.floor(Math.random() * 15);
        string += array[character];
        letterCount++;
    }
    return string;
}

// This function is responsible for displaying text to the screen. It takes the text generated above and converts it into a span.
function displayText(input) {

    var element = document.querySelector("p");
    array = input.split("");
    element.textContent = "";
    for (let i = 0; i < array.length; i++) {
        var val = array[i];
        if (val === " ") { val = "&nbsp;" }
        element.innerHTML += "<span>" + val + "</span>";
    }
    flicker();
}

// This function makes the text flicker that indicates which key to press next.
function flicker() {
    if (counter == array.length) { return; }
    currentText = document.querySelectorAll("span")[counter + 1];
    currentText.classList.toggle("flicker");
}

// This function is responsible for the keys validation. If the right key is pressed, the cursor moves else the text turns red.
document.addEventListener('keydown', function(event) {
    if (!active) { return; }
    if (event.keyCode >= 65 && event.keyCode <= 90 || event.keyCode == 32 || event.keyCode == 190 || event.keyCode == 188) {

        if (event.key !== array[counter]) {
            currentText.classList.add("textColor");
            totalErrors++;
        }
        currentText.classList.toggle("flicker");
        counter++;
        flicker();
        var searchId = "#" + event.key;
        if (event.keyCode == 32) {
            searchId = "#" + "Space";
        }
        document.querySelector(searchId).classList.add("anim2");
        setTimeout(function() {
            document.querySelector(searchId).classList.toggle("anim2");
        }, 300)
    }
    if (counter == array.length) {
        reload();
    }
});

// This function is used to generate new set of text and also brings up the previous stats.
function reload() {
    counter = 0;
    calculateScore(time, totalWords);
    currentText.classList.remove("textColor");
    time = 0;
    totalWords = 0;
    totalErrors = 0;


    generateText();
}

function calculateScore(time, totalWords) {
    var wpm = Math.floor(totalWords / (time / 60));
    var totalScore = ((1200 - (totalErrors * 10)) + wpm * 2);

    // The code below adds the new top wpm to the page.
    let gain = document.querySelector("#speedGain");
    if (wpm > topSpeed) {
        topSpeed = wpm;
        document.querySelector("#topSpeed").innerHTML = topSpeed + "<br>Wpm";
    }

    //Code below calculates the score increment or decrement from the previous one
    if (wpm > maxSpeed) {
        var speedGain = wpm - maxSpeed;
        gain.innerHTML = speedGain + "<br>Wpm+";
        gain.classList.remove("negativeStats");
    } else {
        var speedGain = maxSpeed - wpm;
        gain.classList.add("negativeStats");
        gain.innerHTML = speedGain + "<br>Wpm-";
    }
    maxSpeed = wpm;

    // The code below produces the average score from all the attempts.
    let len = averageArray.push(totalScore);
    let sum = 0;
    averageArray.forEach(function(item) {
        sum = sum + item;
    });
    let finalaverage = Math.ceil(sum / len);


    document.querySelector("#points").innerHTML = totalScore + "<br>points";
    document.querySelector("#wpm").innerHTML = wpm + "<br>Wpm";
    document.querySelector("#errors").innerHTML = totalErrors + "<br>errors";
    document.querySelector("#average").innerHTML = finalaverage + "<br>points";
}

// This function is responsible for activating or deactivating the textbox. The timer stops when deactivated
// and vice versa.
function activate() {
    document.querySelector(".info").classList.toggle("infoDisable");
    document.querySelector(".textContent").classList.toggle("deactive");
    active = !active;
}

function settings() {
    document.querySelector(".effect").classList.toggle("settings_hide");
    document.querySelector(".content").classList.toggle("content_expand");
}


function setListeners() {
    var setting = document.querySelector(".settings");
    setting.addEventListener("click", settings);
    setting.addEventListener("mouseenter", function() {
        setting.style.transform = "scale(1.1)";
    });
    setting.addEventListener("mouseleave", function() {
        setting.style.transform = "scale(1)";
    });
}


// This is the function that gets called as soon as the page loads. Responsible for website initiation.
document.addEventListener('DOMContentLoaded', function() {
    generateText();
    setListeners();
    document.getElementsByClassName("textContent")[0].addEventListener('click', activate);
    document.querySelector(".info").classList.remove("infoDisable");
    document.querySelector(".textContent").classList.add("deactive");
});