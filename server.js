const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
// SUBSTITUA A LINHA ANTIGA POR ESTA AQUI:
const io = socketIo(server, {
  cors: {
    origin: "*", // Permite que o seu frontend (site) se conecte sem bloqueios
    methods: ["GET", "POST"]
  },
  allowEIO3: true, // Compatibilidade extra
  transports: ['websocket', 'polling'] // Tenta WebSocket primeiro, se falhar usa polling
});

app.use(express.json());

// 1. Serve os arquivos estáticos (CSS, JS do build, Imagens)
app.use(express.static(path.join(__dirname, 'public')));

// 2. Rota para receber dados do ESP32 (Fumaça, Calor, etc.)
app.post('/dados', (req, res) => {
    const dadosRecebidos = req.body;
    console.log("Dados do ESP32:", dadosRecebidos);
    
    // Agora o io.emit vai enviar para o front em tempo real
    io.emit('atualizarDados', dadosRecebidos); 
    
    res.status(200).send("Dados recebidos com sucesso!");
});
// 3. Rota Curinga (Middleware) - DEVE SER A ÚLTIMA
// Isso garante que o React Router funcione sem erros de MIME type
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});