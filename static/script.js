var waitForResponse = false;
document.getElementById('clear').addEventListener('click', () => {
    var butt = document.getElementById('clear')
    butt.style.animationName = "clickanim";
    
    setTimeout(() => {
        butt.style.animationName = "none";
    }, 300);
})
document.getElementById('export').addEventListener('click', () => {
    var butt = document.getElementById('export')
    butt.style.animationName = "clickanim";
    
    setTimeout(() => {
        butt.style.animationName = "none";
    }, 300);
})

document.getElementById('submitbutton').addEventListener('click', () => {
    var butt = document.getElementById('submitbutton')
    butt.style.animationName = "clickanim";
    
    setTimeout(() => {
        butt.style.animationName = "none";
    }, 510);
})


function removeelement (idr) {
    const elementr = document.getElementById(idr);
    elementr.parentElement.remove();
}



let messageCounter = 0;
let chatText = '';

function botResponse(rawText) {
    const chats = document.querySelector('.content-area');
    const chatId = 'chat_' + String(messageCounter);

    if (messageCounter > 0) {
        document.getElementById('centre_msg').style.display = "none";
    }

    const chatMessage = document.createElement('div');
    chatMessage.setAttribute('class', 'chat-message');
    chatMessage.style.marginLeft = "30%";
    chatMessage.setAttribute('id', 'chats_msgs');
    chatMessage.style.alignSelf = 'flex-end';

    const chatContent = document.createElement('div');
    chatContent.setAttribute('class', 'chat-content');
    chatContent.setAttribute('id', chatId);

    const loadingAnimation = document.createElement('div');
    loadingAnimation.setAttribute('class', 'lds-ellipsis');
    for (let i = 0; i < 4; i++) {
        const loadingDot = document.createElement('div');
        loadingAnimation.appendChild(loadingDot);
    }
    chatContent.appendChild(loadingAnimation);
    chatMessage.appendChild(chatContent);
    chats.appendChild(chatMessage);
    chats.scrollTop = chats.scrollHeight;
    waitForResponse = true;

    $.get("/get", { msg: rawText }).done(function (data) {
        waitForResponse = false;
        chatContent.removeChild(loadingAnimation);
        chatContent.textContent = "";

        let i = 0;
        function typeNextCharacter() {
            if (i < data.length) {
                chatContent.textContent += data.charAt(i);
                i++;
                setTimeout(typeNextCharacter, 50);
            }
        }

        typeNextCharacter();
        chats.scrollTop = chats.scrollHeight;
    });
}

function chat_send() {
    if (waitForResponse)
    {
        return false
    } 
    const textbox = document.getElementById('chatholder');
    const chats = document.querySelector('.content-area');
    const messageText = textbox.value.trim();
    
    if (messageText.length > 0) {
        // Create a unique ID for each chat message
        messageCounter++;
        const chatId = 'chat_' + String(messageCounter);
        if (messageCounter > 0) {
            document.getElementById('centre_msg').style.display = "none"
        } 
        // Create a chat message container
        const chatMessage = document.createElement('div');
        chatMessage.setAttribute('class', 'chat-message');
        chatMessage.setAttribute('id', 'chats_msgs')

        // Create a chat message content
        const chatContent = document.createElement('div');
        chatContent.setAttribute('class', 'chat-content');
        chatContent.setAttribute('id', chatId);
        chatContent.innerText = messageText;

        // Append chat message content to the container
        chatMessage.appendChild(chatContent);

        // Append the chat message container to the chat area
        chats.appendChild(chatMessage);

        // Automatically scroll to the latest message
        chats.scrollTop = chats.scrollHeight;

        // Reset the textbox
        textbox.value = "";

        botResponse(messageText);
        // Add logic to handle special commands
        handleCommands(messageText, chatId);
    }
    
}

function handleCommands(messageText, chatId) {
    // Convert messageText to a string to avoid TypeError
    messageText = String(messageText).toUpperCase();
 
    switch (messageText) {
        case "EXPORT":
            removeelement(chatId);
            if (document.querySelectorAll('.chat-message').length < 1) {
                document.getElementById("centre_msg").style.display = "block";
            }
            exportChat();
            break;
        case "CLEAR":
            clearChat();
            break;
        // Add more commands here as needed
    }
}

function clearChat() {
    const chats = document.querySelectorAll('.chat-message');
    document.getElementById('centre_msg').style.display = "block"
    chats.forEach(chat => {
        
        chat.remove();
    }
    )
}

function exportChat(chatId) {
    const chatMessages = document.querySelectorAll('.chat-content');
    let chatText = "";
    if (chatMessages.length > 0){
    chatMessages.forEach(message => {
        chatText += message.innerText + '\n';
    });

    // Create a text file and trigger a download
    const blob = new Blob([chatText], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'chats.txt';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);}
}

document.getElementById('chatholder').addEventListener('keydown', (event) => {
    if (event.key === "Enter" && !event.ctrlKey && !event.shiftKey && !event.altKey) {
        event.preventDefault();
        chat_send();
    }
});

document.getElementById('submitbutton').addEventListener('click', chat_send);
document.getElementById('clear').addEventListener('click', clearChat);
document.getElementById('export').addEventListener('click', exportChat);
