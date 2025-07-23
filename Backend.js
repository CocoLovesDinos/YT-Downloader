import { WebSocketServer } from 'ws';
import { spawn } from 'child_process';
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const wsServer = new WebSocketServer({ port: 3000 });

wsServer.on('connection', (socket) => {
    console.log('Client connected');
    socket.onmessage = async (event) => {
        const message = JSON.parse(event.data);

        if (message.action === 'close') {
            console.log('Received close signal. Shutting down.');
            await browser.close();
            process.exit(0);
        }

        const URL = message.URL;
        const codec = message.codec;
        console.log(`Received URL: ${URL}, Codec: ${codec}`);

        const pythonProcess = spawn('python', ['Downloader.py', URL, codec], {
            env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
        });


        pythonProcess.stdout.on('data', (data) => {
            const output = data.toString();
            console.log(`Python Script: ${output}`);
            socket.send(JSON.stringify({ status: 'progress', data: output }));
        });


        pythonProcess.stderr.on('data', (data) => {
            const error = data.toString();
            console.error(`Python Error: ${error}`);
            socket.send(JSON.stringify({ status: 'error', data: error }));
        });


        pythonProcess.on('close', (code) => {
            console.log(`Python script exited with code ${code}`);
            if (code === 0) {
                socket.send(JSON.stringify({ status: 'success', message: 'Download finished successfully!' }));
            } else {
                socket.send(JSON.stringify({ status: 'error', message: `Download failed with exit code ${code}.` }));
            }
        });
    }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
        '--window-size=650,400'
    ]
});

const [page] = await browser.pages();

await page.goto(`file://${path.join(__dirname, 'Head.html')}`);