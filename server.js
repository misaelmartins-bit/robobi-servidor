const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

// 1. Serve os arquivos estáticos (CSS, JS do build, Imagens)
app.use(express.static(path.join(__dirname, 'public')));

// 2. Rota para receber dados do ESP32 (Fumaça, Calor, etc.)
app.post('/dados', (req, res) => {
    const dadosRecebidos = req.body;
    console.log("Dados do ESP32:", dadosRecebidos); // Útil para ver no log do Render
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