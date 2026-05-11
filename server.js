const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware para entender JSON enviado pelo ESP32
app.use(express.json());

// Servir arquivos estáticos (HTML, CSS, JS) da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// ROTA QUE O ESP32 VAI ACESSAR (POST)
app.post('/dados', (req, res) => {
    const dadosRecebidos = req.body;
    
    console.log("Dados do ESP32:", dadosRecebidos);

    // Envia os dados imediatamente para todos os navegadores abertos via Socket.io
    io.emit('atualizarDados', dadosRecebidos);

    res.status(200).send("Dados recebidos com sucesso!");
});

// Iniciar o servidor na porta da Umbler ou na 3000 localmente
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});