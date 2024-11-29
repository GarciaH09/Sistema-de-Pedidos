const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const clientes = [];

wss.on('connection', (ws) => {
    console.log('Novo cliente conectado');
    clientes.push(ws);

    ws.on('message', (message) => {
        console.log(`Recebido: ${message}`);
        // Enviar a mensagem para todos os clientes conectados
        clientes.forEach(cliente => {
            if (cliente !== ws && cliente.readyState === WebSocket.OPEN) {
                cliente.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Cliente desconectado');
        const index = clientes.indexOf(ws);
        if (index !== -1) {
            clientes.splice(index, 1);
        }
    });
});

console.log('Servidor WebSocket em funcionamento na porta 8080');
