var before = document.getElementById("before");
var liner = document.getElementById("liner");
var command = document.getElementById("typer");
var textarea = document.getElementById("texter");
var terminal = document.getElementById("terminal");

var git = 0;
var commands = [];


setTimeout(function () {
  loopLines(banner, "", 80);
  textarea.focus();
}, 100);

window.addEventListener("keyup", enterKey);

console.log(
  "%cОпа куда мы лезем!😠😠😠😠😠",
  "color: #04ff00; font-weight: bold; font-size: 24px;"
);

textarea.value = "";
command.innerHTML = textarea.value;

function enterKey(e) {
  if (e.keyCode == 181) {
    document.location.reload(true);
  }
  if (e.keyCode == 13) {
    commands.push(command.innerHTML);
    git = commands.length;
    addLine("dmitry.knyazkin@icloud.com:~$ " + command.innerHTML, "no-animation", 0);
    commander(command.innerHTML.toLowerCase());
    command.innerHTML = "";
    textarea.value = "";
  }
  if (e.keyCode == 38 && git != 0) {
    git -= 1;
    textarea.value = commands[git];
    command.innerHTML = textarea.value;
  }
  if (e.keyCode == 40 && git != commands.length) {
    git += 1;
    if (commands[git] === undefined) {
      textarea.value = "";
    } else {
      textarea.value = commands[git];
    }
    command.innerHTML = textarea.value;
  }
}

async function commander(cmd) {
  switch (cmd.toLowerCase()) {
    case "comments":
      var comments = await fetchComments()
      loopLines(comments, "color2 margin", 80);
      break;
    case "help":
      loopLines(help, "color2 margin", 80);
      break;
    case "whoami":
      loopLines(whoami, "color2 margin", 80);
      break;
    case "bitcoin_password":
      addLine("Decryptiing...", "color2", 80);
      newTab(bitcoin_pass);
      break;
    case "sudo":
      addLine("Вы че шутите, это слишком простой эмулятор для таких вещей", "color2", 80);
      setTimeout(function () {
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      }, 1000);
      break;
    case "history":
      addLine("<br>", "", 0);
      loopLines(commands, "color2", 80);
      addLine("<br>", "command", 80 * commands.length + 50);
      break;
    case "clear":
      setTimeout(function () {
        terminal.innerHTML = '<a id="before"></a>';
        before = document.getElementById("before");
      }, 1);
      break;
    case "github":
      addLine("Opening GitHub...", "color2", 0);
      newTab(github);
      break;
    case "test":
      addLine("TESTETSTESTESTTEST", "color2", 0);
      break;
    default:
      addLine("<span class=\"inherit\">Command not found. For a list of commands, type <span class=\"command\">'help'</span>.</span>", "error", 100);
      break;
  }
}

function newTab(link) {
  setTimeout(function () {
    window.open(link, "_blank");
  }, 500);
}

function addLine(text, style, time) {
  var t = "";
  for (let i = 0; i < text.length; i++) {
    if (text.charAt(i) == " " && text.charAt(i + 1) == " ") {
      t += "&nbsp;&nbsp;";
      i++;
    } else {
      t += text.charAt(i);
    }
  }
  setTimeout(function () {
    var next = document.createElement("p");
    next.innerHTML = t;
    next.className = style;

    before.parentNode.insertBefore(next, before);

    window.scrollTo(0, document.body.offsetHeight);
  }, time);
}

function loopLines(name, style, time) {
  name.forEach(function (item, index) {
    addLine(item, style, index * time);
  });
}


async function fetchComments() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/comments');
    if (!response.ok) {
      return 'Network response was not ok ' + response.statusText;
    }
    else {
      const data = await response.json();
      const randomComments = [];
      const usedIndexes = new Set();
      while (randomComments.length < 10) {
        const randomIndex = Math.floor(Math.random() * 500);
        if (!usedIndexes.has(randomIndex)) {
          randomComments.push(data[randomIndex]);
          usedIndexes.add(randomIndex);
        }
      }

      const stringifiedComments = randomComments.map(comment => {
        return `ID: ${comment.id}, Name: ${comment.name}, Email: ${comment.email}, Body: ${comment.body}`;
      });

      return stringifiedComments;
    }

  } catch (error) {
    return 'There has been a problem with your fetch operation:' + error;
  }
}