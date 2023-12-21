function RandomisePercentage() {
    var CPUstatus = document.getElementById("cpu");
    var randomPercentage = Math.floor(Math.random() * 101) + "%";
    CPUstatus.innerHTML = randomPercentage;
    setTimeout(RandomisePercentage, 1000);
}

RandomisePercentage();

function changeIntroColor() {
    var introText = document.querySelector('.intro-text');
    var colors = ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee']; 
    var randomIndex = Math.floor(Math.random() * colors.length); 
    introText.style.color = colors[randomIndex]; 
}

function handle(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        validation();
        program = "";

    }
}

let date = new Date();

setInterval(function () {
    document.querySelector('.time').innerText = date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
    });
}, 1000);

function openTab(tabName) {
    $("#" + tabName).show();
    $("#" + tabName + "Tab").show();
    $("#custom").removeClass("custom");
    $("#custom").addClass("inactive");
    $("#" + tabName + "Tab").removeClass("KG-2");
    $("#" + tabName + "Tab").addClass("KG");
    $("#KGTab").removeClass("KG");
    $("#KGTab").addClass("KG-2");
}

function closeTab(tabName) {
    $("#" + tabName).hide();
    $("#" + tabName + "Tab").hide();
    $("#custom").removeClass("inactive");
    $("#custom").addClass("custom");
    $("#" + tabName + "Tab").removeClass("KG");
    $("#" + tabName + "Tab").addClass("KG-2");
    $("#KGTab").removeClass("KG-2");
    $("#KGTab").addClass("KG");
}