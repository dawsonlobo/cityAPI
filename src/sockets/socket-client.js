// socket-client.js
const io = require('socket.io-client');
const socket = io('http://localhost:3000', {
  auth: {
    token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OTc0ZmFlOTI0MWMxYmJhMGVhYWNhOCIsInBob25lIjoiOTg3NDU2MTIzMCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzM4MTI4MjExLCJleHAiOjE3Mzg5OTIyMTF9.HsDYj5JlK7z3WTBgwpY8OhlVabq6NAmsbULeqvnQu88' // Add your JWT token here
  }
});

// Listening for the 'state-added' event
socket.on('state-added', (payload) => {
  console.log('State Added:', payload);
  // This will print the message and data sent with the event
});

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
