// Select elements
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.getElementById('typing-indicator');

// Show welcome message on page load
document.addEventListener('DOMContentLoaded', function() {
    showWelcomeMessage();
});

// Function to show a welcome message
function showWelcomeMessage() {
    const welcomeMessage = "Hello! I'm your chatbot. How can I assist you today?";
    addMessage(welcomeMessage, 'ai-message');
}

// Function to show typing indicator
function showTypingIndicator() {
    typingIndicator.style.display = 'block';
}

// Function to hide typing indicator
function hideTypingIndicator() {
    typingIndicator.style.display = 'none';
}

// Function to disable chat input
function disableChatInput() {
    userInput.disabled = true;
    sendBtn.disabled = true;
    userInput.style.backgroundColor = '#f0f0f0';
    userInput.style.cursor = 'not-allowed';
    sendBtn.style.cursor = 'not-allowed';
    userInput.placeholder = 'Chat session ended';
}

// Event listener for the "Send" button
sendBtn.addEventListener('click', async function() {
    await sendMessage();
});

// Send message on pressing Enter key
userInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Function to send message
async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        addMessage(userMessage, 'user-message');
        userInput.value = '';
        showTypingIndicator();

        try {
            const response = await fetch('https://api.example.com/chat', { // Update with your actual API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            hideTypingIndicator();
            addMessage(data.response, 'ai-message');
            resetInactivityTimer();
        } catch (error) {
            hideTypingIndicator();
            addMessage("Sorry, I couldn't get a response. Please try again.", 'ai-message');
        }
    }
}

// Function to add messages to the chat
function addMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.className = type;
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Variable to hold the inactivity timeout
let inactivityTimeout;

// Function to reset the inactivity timer
function resetInactivityTimer() {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(showInactivityMessage, 60000); // 1 minute timeout
}

// Function to show the inactivity message
function showInactivityMessage() {
    addMessage("Do you want to continue the conversation?", 'ai-message');

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';

    const yesButton = document.createElement('button');
    yesButton.textContent = 'Yes';
    yesButton.className = 'conversation-option';
    yesButton.onclick = () => {
        addMessage("Great! How can I assist you further?", 'ai-message');
        resetInactivityTimer();
    };

    const noButton = document.createElement('button');
    noButton.textContent = 'No';
    noButton.className = 'conversation-option';
    noButton.onclick = showEndConversationOptions;

    optionsContainer.appendChild(yesButton);
    optionsContainer.appendChild(noButton);
    chatBox.appendChild(optionsContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Event listeners for user input to reset the timer
userInput.addEventListener('input', resetInactivityTimer);
sendBtn.addEventListener('click', resetInactivityTimer);

// Initialize the inactivity timer on page load
resetInactivityTimer();

// Function to show end conversation options
function showEndConversationOptions() {
    disableChatInput();

    addMessage("Thank you for chatting! Feel free to connect again!", 'ai-message');
    const resourcesContainer = document.createElement('div');
    resourcesContainer.className = 'resources-container';

    const articlesButton = document.createElement('button');
    articlesButton.textContent = 'Check out our articles';
    articlesButton.className = 'resource-option';

    const resourcesButton = document.createElement('button');
    resourcesButton.textContent = 'Check out resources';
    resourcesButton.className = 'resource-option';

    resourcesContainer.appendChild(articlesButton);
    resourcesContainer.appendChild(resourcesButton);
    chatBox.appendChild(resourcesContainer);
    
    // Clear any existing inactivity timers
    clearTimeout(inactivityTimeout);
    chatBox.scrollTop = chatBox.scrollHeight;
}
