const net = require('net');
const fs = require('fs');

let writeStream = fs.createWriteStream('./serverChat.log');

let clientCounter = 1;
let clientArray = [];

function messageEveryone(client, message) {
    writeStream.write(`${client.username}: ${message} \n`);
    clientArray.forEach( (clientSocket) => {
        if(clientSocket.username === client.username) {
            return;
        }
        else {
            clientSocket.write(`${client.username}: ${message} \n`);
        }
    });
}

let server = net.createServer(client => {

    client.username = `Client${clientCounter}`;
    clientArray.push(client);
    clientCounter++;

    console.log(`${client.username} Connected \n`);
    messageEveryone(client, 'Joined the chat');

    client.write(`Welcome ${client.username}! Start typing to chat. Type exit to leave.\n`);

    client.on('data', (data) => {
        console.log(`${client.username}: ${data} \n`);
        messageEveryone(client, data);
    });

    client.on('close', () => {
        console.log(`${client.username} left the chat\n`);

        clientArray.forEach((clientSocket, index) => {
            if (clientSocket.username === client.username) {
                clientArray.splice(index, 1);
            }
        });

        messageEveryone(client, 'Left the chat');
    })

}).listen(5000);

console.log('Listening on port 5000.\n');
