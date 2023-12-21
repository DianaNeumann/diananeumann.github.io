document.addEventListener('DOMContentLoaded', function() {
    var form = document.querySelector('form');
    var shoutsList = document.querySelector('#shouts ul');
    loadMessages();
  
    form.onsubmit = function(event) {
      event.preventDefault(); 
      var message = document.querySelector('textarea[name="message"]').value;
      addMessage(message);
      saveMessage(message);
      form.reset();
    };
  
    function addMessage(message) {
      if (message.trim() === '') return;
  
      var li = document.createElement('li');
      li.innerHTML = '<a href="#">User</a>:<br /><span class="message">' + message + '</span>';
      shoutsList.prepend(li);
    }
  
    function saveMessage(message) {
      var messages = JSON.parse(localStorage.getItem('messages')) || [];
      messages.push(message);
      localStorage.setItem('messages', JSON.stringify(messages));
    }
  
    function loadMessages() {
      var messages = JSON.parse(localStorage.getItem('messages')) || [];
      messages.reverse().forEach(function(message) {
        addMessage(message);
      });
    }
  });