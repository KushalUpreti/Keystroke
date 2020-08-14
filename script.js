var array = null;
var counter = 0;
var currentText = null;
var active = false;

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


function flicker() {
    currentText = document.querySelectorAll("span")[counter + 1];
    currentText.classList.add("flicker");
}

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

function activate() {
    document.querySelector(".info").classList.toggle("infoDisable");
    document.querySelector(".textContent").classList.toggle("deactive");
    active = !active;
}

document.addEventListener('DOMContentLoaded', function() {
    var element = document.querySelector("p");
    var text = element.innerHTML;
    displayText(text);

    document.getElementsByClassName("textContent")[0].addEventListener('click', activate);
    document.querySelector(".info").classList.remove("infoDisable");
    document.querySelector(".textContent").classList.add("deactive");
});