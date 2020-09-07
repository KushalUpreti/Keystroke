let array = null;
let currentText = null;
let active = false;
let easy = true;
let counter = 0;
let letterCount = 0;
let totalWords = 0;
let totalErrors = 0;
let time = 0;
let topSpeed = 0;
let maxSpeed = 0;
let textLength = 120;
let playSound = false;

let averageArray = [];


setInterval(function () {
    if (active) {
        time++;
        console.log(time);
    }
}, 1000);

// This function generates random text everytime the page is refreshed or the old set of words are completed.
function generateText() {
    let easyText = ["a", "s", "d", "w", "r", "t", "h", "j", "n", "m", "i", "o", "v", "e", "f"];
    let hardText = ["g", "h", "z", "x", "c", "b", "k", "y", "q", "p", "u", "n", "m", "v", "l"];
    let string = "";
    letterCount = 0;
    while (true) {
        if (easy) {
            string = createWords(easyText, string);
        } else {
            string = createWords(hardText, string);
        }
        if (letterCount > textLength) {
            break;
        }
    }
    displayText(string);
}

function customText() {
    let text = document.querySelector("textarea").value;
    let parsedText = validateText(text);
    if (parsedText != null) {
        setInitials;
        displayText(parsedText);
    }
}

// This function is responsible for cleaning the user input text and returning the clean text.
function validateText(text) {


    if (text.length === 0) {
        return null;
    }
    let firstTextDraft = text.trim();

    let secondTextDraft = firstTextDraft.toLowerCase();

    for (let i = 0; i < secondTextDraft.length; i++) {
        let code = secondTextDraft.charCodeAt(i);

        if ((code < 97 || code > 122) && (code != 46 && code != 44 && code != 32)) {
            console.log(secondTextDraft.charAt(i) + " " + code);
            secondTextDraft = secondTextDraft.replace(secondTextDraft.charAt(i), "");
            i--;
        }
    }
    if (secondTextDraft.length > 200) {
        secondTextDraft = secondTextDraft.slice(0, 200);
    }

    return secondTextDraft;
}

// This function is responsible for generating words. The words can be one to six letters long.
function createWords(array, string) {
    let wordLength = Math.ceil(Math.random() * 6);
    if (letterCount > 0) {
        string = string + " ";
        totalWords++;
    }
    for (let i = 0; i < wordLength; i++) {
        let character = Math.floor(Math.random() * 15);
        string += array[character];
        letterCount++;
    }
    return string;
}

// This function is responsible for displaying text to the screen. It takes the text generated above and converts it into a span.
function displayText(input) {

    let element = document.querySelector("p");
    array = input.split("");
    element.textContent = "";
    for (let i = 0; i < array.length; i++) {
        let val = array[i];
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
document.addEventListener('keydown', function (event) {
    let audio = new Audio("sound.mp3");

    if (!active) { return; }
    if (event.keyCode >= 65 && event.keyCode <= 90 || event.keyCode == 32 || event.keyCode == 190 || event.keyCode == 188) {
        if (playSound) {
            audio.play();
        }

        if (event.key !== array[counter]) {
            currentText.classList.add("textColor");
            totalErrors++;
        }
        currentText.classList.toggle("flicker");
        counter++;
        flicker();
        let searchId = "#" + event.key;
        if (event.keyCode == 32) {
            searchId = "#" + "Space";
        }
        document.querySelector(searchId).classList.add("anim2");
        setTimeout(function () {
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

function setInitials() {
    counter = 0;
    time = 0;
}

function calculateScore(time, totalWords) {

    let wpm = Math.floor(totalWords / (time / 60));
    let totalScore = ((1200 - (totalErrors * 10)) + wpm * 2);

    // The code below adds the new top wpm to the page.
    let gain = document.querySelector("#speedGain");
    if (wpm > topSpeed) {
        topSpeed = wpm;
        document.querySelector("#topSpeed").innerHTML = topSpeed + "<br>Wpm";
    }

    //Code below calculates the score increment or decrement from the previous one
    if (wpm > maxSpeed) {
        let speedGain = wpm - maxSpeed;
        gain.innerHTML = speedGain + "<br>Wpm+";
        gain.classList.remove("negativeStats");
    } else {
        let speedGain = maxSpeed - wpm;
        gain.classList.add("negativeStats");
        gain.innerHTML = speedGain + "<br>Wpm-";
    }
    maxSpeed = wpm;

    // The code below produces the average score from all the attempts.
    let len = averageArray.push(totalScore);
    let sum = 0;
    averageArray.forEach(function (item) {
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
    let setting = document.querySelector(".settings");
    setting.addEventListener("click", settings);
    setting.addEventListener("mouseenter", function () {
        setting.style.transform = "scale(1.1)";
    });
    setting.addEventListener("mouseleave", function () {
        setting.style.transform = "scale(1)";
    });
    document.getElementsByClassName("textContent")[0].addEventListener('click', activate);
    document.querySelector(".btn").addEventListener('click', customText);

    document.querySelector(".radioForm").addEventListener('change', (e) => {
        if (e.target.id === "Easy") {
            easy = true;
        } else {
            easy = false;
        }
        setInitials();
        generateText();
    });

    document.querySelector(".audioForm").addEventListener('change', (e) => {
        if (e.target.id === "Yes") {
            playSound = true;
        } else {
            playSound = false;
        }
    });

    document.querySelector(".slider").addEventListener('input', (e) => {
        textLength = Number(e.target.value);
        setInitials();
        generateText();
    });
}




// This is the function that gets called as soon as the page loads. Responsible for website initiation.
document.addEventListener('DOMContentLoaded', function () {
    generateText();
    setListeners();

    document.querySelector(".info").classList.remove("infoDisable");
    document.querySelector(".textContent").classList.add("deactive");
});