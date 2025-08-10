console.log("Functional");

setTimeout(RunStartFull

    , 800);
setTimeout(RunStartMain

    , 800);
setTimeout(RunStartBonus

    , 800);

function RunStartFull() {
    console.log("Start Full");
    ProgressBarRunStart(document.getElementsByClassName("progressBarFull")[0], "full");
}


function RunStartBonus() {
    console.log("Start Bonus");
    ProgressBarRunStart(document.getElementsByClassName("progressBarBonus")[0], "bonus");
}


function RunStartMain() {
    console.log("Start Main");
    ProgressBarRunStart(document.getElementsByClassName("progressBarMain")[0], "main");
}

var lastWindowHeight = window.innerHeight;


function ResetPositionsBuffer(headings, type) {
    if (type == "full") { let timeoutFull = setTimeout(ResetPositionsFull, 1000, headings); }
    else if (type == "main") { let timeoutMain = setTimeout(ResetPositionsMain, 1000, headings); }
    else if (type == "bonus") { let timeoutBonus = setTimeout(ResetPositionsBonus, 1000, headings); }
    return;
}

var headingsPosFull = [];
var estimatedTimesFull = [];
var aFull = 0;

function ResetPositionsFull(headings) {
    headingsPosFull = [];
    estimatedTimesFull = [];
    for (let i = 0; i < headings.length; i++) {
        if (headings[i].classList.contains("tm") || headings[i].classList.contains("bc")) {
            if (headings[i].getAttribute("tm") != null) {
                estimatedTimesFull.push(parseFloat(headings[i].getAttribute("tm")));
                headingsPosFull.push(headings[i].getElementsByClassName("elementor-menu-anchor")[0].getBoundingClientRect().y + window.pageYOffset);
            }
        }
    }
    let totalTime = 0;
    for (let i = 0; i < estimatedTimesFull.length; i++) {
        totalTime += estimatedTimesFull[i];
    }
    aFull = 0;
    return totalTime;
}

var headingsPosBonus = [];
var estimatedTimesBonus = [];
var aBonus = 0;

function ResetPositionsBonus(headings) {
    headingsPosBonus = [];
    estimatedTimesBonus = [];
    for (let i = 0; i < headings.length; i++) {
        if (headings[i].classList.contains("bc")) {
            if (headings[i].getAttribute("tm") != null) {
                estimatedTimesBonus.push(parseFloat(headings[i].getAttribute("tm")));
                headingsPosBonus.push(headings[i].getElementsByClassName("elementor-menu-anchor")[0].getBoundingClientRect().y + window.pageYOffset);
            }
        }
    }
    let totalTime = 0;
    for (let i = 0; i < estimatedTimesBonus.length; i++) {
        totalTime += estimatedTimesBonus[i];
    }
    aBonus = 0;
    return totalTime;
}

var headingsPosMain = [];
var estimatedTimesMain = [];
var aMain = 0;

function ResetPositionsMain(headings) {
    headingsPosMain = [];
    estimatedTimesMain = [];
    for (let i = 0; i < headings.length; i++) {
        if (headings[i].classList.contains("tm")) {
            if (headings[i].getAttribute("tm") != null) {
                estimatedTimesMain.push(parseFloat(headings[i].getAttribute("tm")));
                headingsPosMain.push(headings[i].getElementsByClassName("elementor-menu-anchor")[0].getBoundingClientRect().y + window.pageYOffset);
            }
        }
    }
    let totalTime = 0;
    for (let i = 0; i < estimatedTimesMain.length; i++) {
        totalTime += estimatedTimesMain[i];
    }
    aMain = 0;
    return totalTime;
}

function Reset(headings, type) {
    if (type == "full") {
        var totalTime = ResetPositionsFull(headings);
    }
    else if (type == "bonus") {
        var totalTime = ResetPositionsBonus(headings);
    }
    else if (type == "main") {
        var totalTime = ResetPositionsMain(headings);
    }
    return totalTime;
}


function ProgressBarRunStart(div, type) {
    if (typeof div !== "undefined" && div != undefined) {

        var totalTime = 0;
        var running = true;

        var estimatedTimeBuffer = 0;
        var headings = document.getElementsByClassName("elementor-widget-menu-anchor");
        var posAlteration = -0.878640777;
        var arrow = window.innerHeight * document.getElementsByClassName("fa-long-arrow-alt-left")[0].getBoundingClientRect().y * posAlteration / 1313;
        var toggles = document.getElementsByClassName("elementor-toggle");

        totalTime = Reset(headings, type);

        for (let i = 0; i < toggles.length; i++) {
            toggles[i].addEventListener('click', () => {
                if (typeof ResetPositionsBuffer == "function") {
                    ResetPositionsBuffer(headings, type);
                }
            });
        }

        var progressBar = div.getElementsByClassName("current-progress")[0];
        var barAmount = 201.062
        var lastProgressBarSize = barAmount
        var scrollPos = -201.062;

        if (div.getElementsByClassName("current-progress-percentage")[0].length == 0) {
            progressBar.parentNode.parentNode.innerHTML = progressBar.parentNode.parentNode.innerHTML.toString() + "<div class=\"current-progress-percentage\">0%</div>";
        }

        var progressBarPercentage = div.getElementsByClassName("current-progress-percentage")[0];


        progressBarPercentage.style = "color: #FFFFFF";

        var a = 0;
        var currentPos = window.scrollY - arrow;

        progressBar.style = "stroke-dasharray: " + progressBarSize + "; stroke-dashoffset: " + scrollPos.toString() + "; display: block; ";
        progressBarPercentage.innerText = (Math.round((estimatedTimeBuffer / totalTime) * 100)).toString() + "%";

        setInterval(RunLoop, 125, div, progressBarPercentage, type, currentPos, posAlteration, totalTime);
    }
}



function RunLoop(div, progressBarPercentage, type, currentPos, posAlteration, totalTime) {

    /* ### Causes errors, needs more testing ### */

    if (lastWindowHeight != window.innerHeight) {
        lastWindowHeight = window.innerHeight;
        totalTime = Reset(document.getElementsByClassName("elementor-widget-menu-anchor"), type);
        running = true;
    }


    if (type == "full") {
        var headingsPos = headingsPosFull;
        var estimatedTimes = estimatedTimesFull;
        var a = aFull;
    }
    else if (type == "bonus") {
        var headingsPos = headingsPosBonus;
        var estimatedTimes = estimatedTimesBonus;
        var a = aBonus;
    }
    else if (type == "main") {
        var headingsPos = headingsPosMain;
        var estimatedTimes = estimatedTimesMain;
        var a = aMain;
    }

    arrow = window.innerHeight * document.getElementsByClassName("fa-long-arrow-alt-left")[0].getBoundingClientRect().y * posAlteration / 1313;

    progressBar = div.getElementsByClassName("current-progress")[0];
    if (lastProgressBarSize != progressBarSize) {
        progressBar.style.setProperty("stroke-dasharray", progressBarSize);
        var lastProgressBarSize = progressBarSize;
        var barAmount = parseFloat(progressBarSize.split(",")[0]);
        running = true;
    }

    if (window.scrollY - arrow != currentPos) {
        currentPos = window.scrollY - arrow;
        running = true;
    }
    if (running) {
        if (currentPos < headingsPos[a]) {
            if (a > 0) {
                a -= 1;
                progressBarPercentage.innerText = "...";
                running = true;
            }
            else {
                scrollPos = -barAmount;
                progressBar.style = "stroke-dasharray: " + progressBarSize + "; stroke-dashoffset: " + scrollPos.toString() + "; display: block; ";
                progressBarPercentage.innerText = "0%";
            }
        }
        else if (a == headingsPos.length - 1 || currentPos < headingsPos[a + 1]) {
            estimatedTimeBuffer = 0;
            for (let i = 0; i < a; i++) {
                estimatedTimeBuffer += estimatedTimes[i];
            }
            scrollPos = ((estimatedTimeBuffer / totalTime) * barAmount) - barAmount;

            progressBar.style = "stroke-dasharray: " + progressBarSize + "; stroke-dashoffset: " + scrollPos.toString() + "; display: block; ";

            progressBarPercentage.innerText = (Math.round((estimatedTimeBuffer / totalTime) * 1000) / 10).toString() + "%";
            running = false;
        }
        else {
            a += 1;
            progressBarPercentage.innerText = "...";
            running = true;
        }
        if (type == "full") {
            aFull = a;
        }
        else if (type == "bonus") {
            aBonus = a;
        }
        else if (type == "main") {
            aMain = a;
        }

    }

    clearInterval();
    return;
}
