const outputDiv = document.getElementById('content_serial');
const ws = new WebSocket('ws://localhost:8081'); 

ws.onopen = function() {
    console.log('WebSocket connected.');
    ws.send('Client connected via WebSocket');
};

ws.onmessage = function(event) {
    outputDiv.innerHTML += event.data + '<br>';
    outputDiv.scrollTop = outputDiv.scrollHeight;
};

ws.onclose = function() {
    console.log('WebSocket disconnected.');
    ws.send('Client disconnected');
};