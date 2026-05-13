const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors'); // Adicione o pacote CORS

const app = express();
const server = http.createServer(app);

// Configuração do Socket.io com CORS para permitir o seu Front-end
const io = socketIo(server, {
    cors: {
        origin: "*", // Em produção, você pode colocar a URL do seu front aqui
        methods: ["GET", "POST"]
    }
});

app.use(cors()); // Habilita CORS para as rotas HTTP
app.use(express.json());

// 1. Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// 2. Rota para o ESP32
app.post('/dados', (req, res) => {
    const dadosRecebidos = req.body;
    
    // Verifique se o nome do evento aqui é o MESMO que você ouve no React
    // Se no React você usou socket.on('dadosAtualizados'), mude aqui para 'dadosAtualizados'
    io.emit('dadosAtualizados', dadosRecebidos); 
    
    console.log("Sinal enviado para o Dashboard:", dadosRecebidos);
    res.status(200).send("Dados recebidos");
});

// 3. Rota Curinga para React Router
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Robôbi online na porta ${PORT}`);
});