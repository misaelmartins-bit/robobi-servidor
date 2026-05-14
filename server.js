const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  },
  allowEIO3: true, 
  transports: ['websocket', 'polling'] 
});

app.use(express.json());

// 1. Serve os arquivos estáticos primeiro (Garante o carregamento do JS, CSS, Imagens)
app.use(express.static(path.join(__dirname, 'public')));

// 2. Rota para receber dados do ESP32 (Fumaça, Calor, etc.)
app.post('/dados', (req, res) => {
    const dadosRecebidos = req.body;
    console.log("Dados do ESP32:", dadosRecebidos);
    
    // Envia para o front em tempo real via Socket
    io.emit('dados', dadosRecebidos);
    
    res.status(200).send("Dados recebidos com sucesso!");
});

// 3. SOLUÇÃO COMPATÍVEL: Middleware curinga seguro para o Express 5
// Se não for a rota '/dados' e não for um arquivo estático, entrega o index.html pro React Router
app.use((req, res, next) => {
    if (req.url === '/dados') {
        return next();
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});