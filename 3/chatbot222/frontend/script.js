const chatIcon = document.getElementById("chat-icon");
const chatBox = document.getElementById("chat-box");
const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");

// === OUVERTURE / FERMETURE DU CHAT ===
chatIcon.onclick = () => {
  chatBox.classList.toggle("hidden");
  if (!chatBox.classList.contains("hidden")) {
    userInput.focus();
  }
};

// === ENVOI MESSAGE PAR ENTRÉE ===
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// === ENVOI DU MESSAGE À FLASK/Ollama ===
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  const userMsg = addMessage("user", message);
  userInput.value = "";
  userInput.disabled = true;

  const botMsg = addMessage("bot", "");
  botMsg.classList.add("typing");

  try {
    const res = await fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!res.ok) throw new Error("Réponse réseau invalide");

    const data = await res.json();
    const fullResponse = data.response || "Réponse vide.";

    botMsg.classList.remove("typing");
    typeEffect(botMsg, fullResponse);

  } catch (err) {
    botMsg.classList.remove("typing");
    botMsg.textContent = "❌ Erreur serveur. Vérifie que Flask et Ollama tournent.";
    console.error("Erreur chatbot:", err);
  } finally {
    userInput.disabled = false;
    userInput.focus();
  }
  
}

// === AJOUT D’UN MESSAGE DANS L’INTERFACE ===
function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.textContent = text;
  chatMessages.appendChild(msg);
  scrollToBottom();
  return msg;
}

// === FAIRE DÉFILER AUTOMATIQUEMENT VERS LE BAS ===
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// === EFFET LETTRE PAR LETTRE COMME ChatGPT ===
function typeEffect(element, text, delay = 15) {
  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      element.textContent += text[i++];
      scrollToBottom();
    } else {
      clearInterval(interval);
    }
  }, delay);
}

// === DRAGGABLE CHAT BOX ===
dragElement(document.getElementById("chat-box"));

function dragElement(elmnt) {
  const header = document.getElementById("chat-header") || elmnt;
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  header.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    elmnt.style.bottom = "auto";
    elmnt.style.right = "auto";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// === DRAGGABLE CHAT ICON ===
let isDragging = false;
let offsetX, offsetY;

chatIcon.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - chatIcon.getBoundingClientRect().left;
  offsetY = e.clientY - chatIcon.getBoundingClientRect().top;
  chatIcon.style.transition = "none";
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    chatIcon.style.left = e.clientX - offsetX + "px";
    chatIcon.style.top = e.clientY - offsetY + "px";
    chatIcon.style.right = "auto";
    chatIcon.style.bottom = "auto";
    chatIcon.style.position = "fixed";
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  chatIcon.style.transition = "all 0.2s ease";
});
