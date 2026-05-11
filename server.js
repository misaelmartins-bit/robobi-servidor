const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

// 1. AJUSTE: Servir a pasta public
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/dados')) return next(); // Deixa a rota do ESP32 passar
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/dados', (req, res) => {
    const dadosRecebidos = req.body;
    console.log("Dados do ESP32:", dadosRecebidos);
    io.emit('atualizarDados', dadosRecebidos);
    res.status(200).send("Dados recebidos com sucesso!");
});

// 3. AJUSTE: Porta do Render (Geralmente 10000, mas o process.env resolve)
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});