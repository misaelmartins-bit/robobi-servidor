const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors'); // Recomendado para evitar bloqueios de conexão

const app = express();
const server = http.createServer(app);

// Configuração do Socket.io com CORS para permitir conexões externas
const io = socketIo(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// 1. Serve os arquivos estáticos (CSS, JS do build, Imagens)
app.use(express.static(path.join(__dirname, 'public')));

// 2. Rota para receber dados do ESP32 (Fumaça, Calor, etc.)
app.post('/dados', (req, res) => {
    const dadosRecebidos = req.body;
    console.log("Dados do ESP32:", dadosRecebidos);
    
    // IMPORTANTE: Use o nome de evento que você configurou no seu React
    // Se no React você usou 'dadosAtualizados', mude aqui.
    io.emit('dadosAtualizados', dadosRecebidos); 
    
    res.status(200).send("Dados recebidos com sucesso!");
});

// 3. Rota Curinga CORRIGIDA
// O uso de (.*) resolve o erro "Missing parameter name at index 1" visto no log
app.get('(.*)', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Robôbi rodando na porta ${PORT}`);
});