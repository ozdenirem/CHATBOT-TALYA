const chatLog = document.getElementById("chat-log");
const typing = document.getElementById("typing-indicator");
const input = document.getElementById("user-input");
const clearBtn = document.getElementById("clear-history");
const showBtn = document.getElementById("show-history");

// Mevcut zamanı al
function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

// Mesaj ekle
function addMessage(sender, message, isHistory = false) {
  const msgElement = document.createElement("div");
  msgElement.className = `chat-message ${sender}`;

  const icon = sender === "user" ? "👤" : "🤖";
  const time = getCurrentTime();

  msgElement.innerHTML = `
    <div class="message-header">
      ${icon} <strong>${sender === "user" ? "Sen" : "Bot"}</strong> 
      <span class="timestamp">${time}</span>
    </div>
    <div class="message-text ${isHistory ? "history" : ""}">
      ${message}
    </div>
  `;

  chatLog.appendChild(msgElement);
  chatLog.scrollTop = chatLog.scrollHeight;
}

// Mesaj gönder
async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage("user", message);
  input.value = "";

  typing.style.display = "block";

  const response = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await response.json();
  typing.style.display = "none";

  addMessage("bot", data.botMessageFinal);

  // LocalStorage geçmişine kaydet
  let history = JSON.parse(localStorage.getItem("chatHistory") || "[]");
  history.push({ user: message, bot: data.botMessageFinal });
  localStorage.setItem("chatHistory", JSON.stringify(history));
}

// Geçmiş sohbetleri göster
function showHistory() {
  chatLog.innerHTML = "";

  const historyTitle = document.createElement("div");
  historyTitle.className = "history-title";
  historyTitle.innerText = "📜 Geçmiş Sohbetler";
  chatLog.appendChild(historyTitle);

  const localHistory = JSON.parse(localStorage.getItem("chatHistory") || "[]");
  localHistory.forEach(item => {
    addMessage("user", item.user, true);
    addMessage("bot", item.bot, true);
  });
}

// Sohbeti temizle
function clearHistory() {
  localStorage.removeItem("chatHistory");
  chatLog.innerHTML = "";
}

// Event listeners
document.getElementById("send-btn").addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
clearBtn.addEventListener("click", clearHistory);
showBtn.addEventListener("click", showHistory);
