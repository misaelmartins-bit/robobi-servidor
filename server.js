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

// Essencial para converter o JSON que vem do ESP32 em um objeto JavaScript
app.use(express.json());

// 1. Serve os arquivos estáticos primeiro (Garante o carregamento do JS, CSS, Imagens)
app.use(express.static(path.join(__dirname, 'public')));

// 2. Rota para receber dados do ESP32 (Fumaça, Calor, etc.)
app.post('/dados', (req, res) => {
    const dadosRecebidos = req.body;
    
    // Proteção: Verifica se o ESP32 mandou um JSON válido
    if (!dadosRecebidos || Object.keys(dadosRecebidos).length === 0) {
        console.log("⚠️ Aviso: Requisição recebida, mas sem dados JSON.");
        return res.status(400).send("Nenhum dado recebido.");
    }

    console.log("🔥 Dados recebidos do ESP32:", dadosRecebidos);
    
    // Envia para o front em tempo real via Socket
    io.emit('dados', dadosRecebidos);
    
    // Resposta rápida para o ESP32 liberar a conexão
    res.status(200).send("Dados recebidos com sucesso!");
});

// 3. Rota Fallback para o React Router (CORREÇÃO PARA O EXPRESS 5)
// Usamos a Expressão Regular /(.*)/ em vez da string '*' que causa erro no Express 5.
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Gerenciamento básico de erro global (Boa prática para o Render não cair)
app.use((err, req, res, next) => {
    console.error("❌ Erro interno no servidor:", err.stack);
    res.status(500).send('Algo deu errado!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando perfeitamente na porta ${PORT}`);
});