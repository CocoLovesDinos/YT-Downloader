const ws = new WebSocket('ws://localhost:3000');


const progressOutput = document.getElementById('progress-output');

ws.onopen = () => {
    console.log('Connected to WebSocket server.');
    progressOutput.textContent = 'Ready.';
};

ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log(message);

    switch (message.status) {
        case 'progress':
            progressOutput.textContent = message.data;
            break;
        case 'success':
            progressOutput.textContent = `Success: ${message.message}`;
            break;
        case 'error':
            progressOutput.textContent = `Error: ${message.message}\n\nDetails:\n${message.data || 'No details'}`;
            break;
        default:
            if (typeof message === 'string') {
                 console.log('Server response:', message);
            }
            break;
    }
};

ws.onclose = () => {
    console.log('Disconnected from WebSocket server.');
    progressOutput.textContent = 'Connection lost. Please refresh the page.';
};

ws.onerror = (error) => {
    console.error('WebSocket Error:', error);
    progressOutput.textContent = 'A connection error occurred.';
};


async function sendMSG() {
    const URL = document.getElementById('URL').value;
    const codec = document.getElementById('codec').value;

    if (!URL) {
        progressOutput.textContent = 'Please enter a URL.';
        return;
    }


    progressOutput.textContent = 'Starting download...';


    ws.send(JSON.stringify({ URL, codec }));
    console.log(`Sent to backend: URL=${URL}, Codec=${codec}`);
};

function closeApp() {
    progressOutput.textContent = 'Closing application...';
    ws.send(JSON.stringify({ action: 'close' }));
}