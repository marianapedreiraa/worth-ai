import './style.css';
import 'material-icons';
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-material-design/dist/css/bootstrap-material-design.min.css'
import { getAssistantMessage } from './worth-ai';



(function() {
    var chatSubmit = document.querySelector("#chat-submit");
    chatSubmit.addEventListener("click", function(e) {sendMessage(e)});


    var storedKey = localStorage.getItem('openaiKey');
    if (storedKey && storedKey.trim() != "") {
        document.querySelector("#api-input").value = storedKey;
    }

    var settingsSubmit = document.querySelector("#settings-submit");
    settingsSubmit.addEventListener("click", function(e) {
        e.preventDefault();

        var openaiKey = document.querySelector("#api-input").value;
        if (openaiKey.trim() == "") {
            return false;
        }

        localStorage.setItem('openaiKey', openaiKey)
      });
  
  
    document.body.addEventListener("click", function(e) {
      if (e.target.classList.contains("chat-btn")) {
        
        var value = e.target.getAttribute("chat-value");
        var name = e.target.innerHTML;
        document.querySelector("#chat-input").setAttribute("disabled", false);
        generate_message(name, "user");
      }
    });

    document.querySelector("#settings-circle").addEventListener("click", function() {

        this.classList.toggle("hidden");
        document.querySelector("#chat-circle").classList.toggle("hidden");
        document.querySelector(".settings-box").classList.toggle("hidden");
        document.querySelector("#chat-overlay").classList.toggle("hidden");
      });


    document.querySelector(".settings-box-toggle").addEventListener("click", function() {
        
        document.querySelector("#chat-circle").classList.toggle("hidden");
        document.querySelector("#settings-circle").classList.toggle("hidden");
        
        document.querySelector(".settings-box").classList.toggle("hidden");
        document.querySelector("#chat-overlay").classList.toggle("hidden");
      });
    

    
    document.querySelector("#chat-circle").addEventListener("click", function() {
      
      this.classList.toggle("hidden");
      document.querySelector("#settings-circle").classList.toggle("hidden");
      document.querySelector("#center-text").classList.toggle("hidden");
      document.querySelector(".chat-box").classList.toggle("hidden");
      document.querySelector("#chat-overlay").classList.toggle("hidden");

    });
  
    
    document.querySelector(".chat-box-toggle").addEventListener("click", function() {
      
      document.querySelector("#chat-circle").classList.toggle("hidden");
      document.querySelector("#settings-circle").classList.toggle("hidden");
      document.querySelector("#center-text").classList.toggle("hidden");
      document.querySelector(".chat-box").classList.toggle("hidden");
      document.querySelector("#chat-overlay").classList.toggle("hidden");
    });
  })();
  

  async function sendMessage(e) {
    e.preventDefault();
    var msg = document.querySelector("#chat-input").value;
    if (msg.trim() == "") {
      return false;
    }

    generate_message(msg, "user");
    var assistantMessage = await getAssistantMessage(msg, getMessageHistory());
    generate_message(assistantMessage.content.replaceAll('\n','<br/>'), assistantMessage.role);
  }
  


  var INDEX = 0;
  function generate_message(msg, type) {
    INDEX++;

    var str = "";
    str += "<div id='cm-msg-" + INDEX + "' class='chat-msg " + type + "'>";
    str += "  <div class='cm-msg-text'>";
    str += msg;
    str += "  </div>";
    str += "</div>";
    document.querySelector(".chat-logs").innerHTML += str;
    document.querySelector("#cm-msg-" + INDEX).style.display = "block";
    
    if (type == "user") {
      document.querySelector("#chat-input").value = "";
    }
    
    document.querySelector(".chat-logs").scrollTop =
      document.querySelector(".chat-logs").scrollHeight;
  }
  
  function getMessageHistory() {
    // Janela deslizante de histórico 
    const maxHistory = 50;
    let historyWindow = 0;
    if (INDEX > maxHistory) {
      historyWindow = INDEX - maxHistory;
    }
    
    var messages = new Array();
    for (let i = INDEX-1; i > historyWindow; i--) {
      var msgElement = document.querySelector('#cm-msg-' + i);
      
      messages.push({
        content: msgElement.children[0].innerHTML,
        role: msgElement.classList[1]
      })
    }

    return messages.reverse();
}
