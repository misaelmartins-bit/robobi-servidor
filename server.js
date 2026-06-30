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
    
    res.status(200).send("Dados recebidos com sucesso!");
});

// 3. Rota Fallback para o React Router (COMPATÍVEL COM EXPRESS 5)
// Substitui o app.get('*') por um middleware seguro.
// Tudo que não foi pego nas rotas acima cai aqui. Se for GET, envia o React.
app.use((req, res, next) => {
    if (req.method === 'GET') {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        res.status(404).send("Rota não encontrada");
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando perfeitamente na porta ${PORT}`);
});