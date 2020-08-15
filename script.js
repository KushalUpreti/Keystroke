var array = null;
var counter = 0;
var currentText = null;
var active = false;
var easy = true;
var count = 0;

// This function generates random text everytime the page is refreshed or the old set of words are completed.
function generateText() {
    var easyText = ["a", "s", "d", "w", "r", "t", "h", "j", "n", "m", "i", "o", "v", "e", "f"];
    var hardText = ["g", "h", "z", "x", "c", "b", "k", "y", "q", "p", "u", "n", "m", "v", "l"];
    var string = "";
    count = 0;
    while (true) {
        if (easy) {
            string = createWords(easyText, string);
        } else {
            string = createWords(hardText, string);
        }
        if (count > 120) {
            break;
        }
    }
    displayText(string);
}

// This function is responsible for generating words. The words can be one to six letters long.
function createWords(array, string) {
    var wordLength = Math.ceil(Math.random() * 6);
    if (count > 0) { string = string + " "; }
    for (var i = 0; i < wordLength; i++) {
        var character = Math.floor(Math.random() * 15);
        string += array[character];
        count++;
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
    currentText = document.querySelectorAll("span")[counter + 1];
    currentText.classList.add("flicker");
}

// This function is responsible for the keys validation. If the right key is pressed, the cursor moves else the text turns red.
document.addEventListener('keydown', function(event) {
    if (!active) { return; }
    if (event.keyCode >= 65 && event.keyCode <= 90 || event.keyCode == 32 || event.keyCode == 190 || event.keyCode == 188) {

        if (event.key !== array[counter]) {
            currentText.style.color = "red";
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
});

// This function is responsible for activating or deactivating the textbox. The timer stops when deactivated
// and vice versa.
function activate() {
    document.querySelector(".info").classList.toggle("infoDisable");
    document.querySelector(".textContent").classList.toggle("deactive");
    active = !active;
}

// This is the function that gets called as soon as the page loads. Responsible for website initiation.
document.addEventListener('DOMContentLoaded', function() {
    generateText();
    document.getElementsByClassName("textContent")[0].addEventListener('click', activate);
    document.querySelector(".info").classList.remove("infoDisable");
    document.querySelector(".textContent").classList.add("deactive");
});