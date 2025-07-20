const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = userInput.value;
    userInput.value = '';

    // Display user message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.textContent = `You: ${userMessage}`;
    chatBox.appendChild(userMessageDiv);

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        });

        const data = await response.json();

        // Display bot response
        const botMessageDiv = document.createElement('div');
        botMessageDiv.textContent = `Bot: ${data.reply}`;
        chatBox.appendChild(botMessageDiv);

    } catch (error) {
        console.error('Error:', error);
        const errorMessageDiv = document.createElement('div');
        errorMessageDiv.textContent = 'Error: Could not connect to the chatbot.';
        chatBox.appendChild(errorMessageDiv);
    }
});