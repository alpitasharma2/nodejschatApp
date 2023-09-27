// const socket = io('http://localhost:8000');
var socket = io('http://localhost:8000', { transports: ['websocket', 'polling', 'flashsocket'] });

// Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")

// Audio that will play on receiving messages
var audio = new Audio('ting.mp3');

// Function which will append event info to the contaner
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position =='left'){ 
        audio.play();
    }
}


// Ask new user for his/her name and let the server know
const namee = prompt("Enter your name to join");
socket.emit('new-user-joined', namee);

// If a new user joins, receive his/her name from the server
socket.on('user-joined', namee =>{
    append(`${namee} joined the chat`, 'right')
})

// If server sends a message, receive it
socket.on('receive', data =>{
    append(`${data.namee}: ${data.message}`, 'left')
})

// If a user leaves the chat, append the info to the container
socket.on('left', namee =>{
    append(`${namee} left the chat`, 'right')
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''
})