const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors'); 

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/dados', (req, res) => {
    const dadosRecebidos = req.body;
    // Emitindo o nome que o React está ouvindo:
    io.emit('dadosAtualizados', dadosRecebidos); 
    res.status(200).send("Dados recebidos");
});

// Fallback para o React Router
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Robôbi rodando na porta ${PORT}`);
});