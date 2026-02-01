import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import Chat from './models/Chat.js'
import './database.js';


const PORT = 4000;

// 1️⃣ Crear servidor HTTP a partir de tu app de Express
const server = http.createServer(app);

// 2️⃣ Inicializar Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // cambiar por tu frontend en producción
    methods: ['GET', 'POST'],
  },
});

// Estructura: { chatId, productId, buyerId, sellerId, messages: [{senderId, text, timestamp}] }

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Unirse a un chat
  socket.on('joinRoom', ({ chatId }) => {
  socket.join(chatId);
  console.log('🔗 Usuario unido al chat:', chatId);
});

  // Enviar mensaje
  socket.on('sendMessage', async ({ chatId, senderId, text, imageUrl }) => {
  try {
    console.log('✉️ sendMessage:', { chatId, senderId, text });

    const chat = await Chat.findById(chatId);

    if (!chat) {
      console.log('❌ Chat no encontrado:', chatId);
      return;
    }

    const message = {
      senderId,
      text,
      imageUrl,
      timestamp: new Date(),
    };

    chat.messages.push(message);
    await chat.save();

    console.log('📨 Mensaje guardado en Mongo');

    io.to(chatId).emit('receiveMessage', message);
  } catch (error) {
    console.error('❌ Error sendMessage:', error);
  }
});

  // Crear chat si no existe
  socket.on('createChat', async ({ productId, buyerId, sellerId }) => {
  try {
    console.log('🆕 createChat recibido:', { productId, buyerId, sellerId });

    let chat = await Chat.findOne({
      productId,
      buyerId,
      sellerId,
    });

    if (!chat) {
      chat = await Chat.create({
        productId,
        buyerId,
        sellerId,
        messages: [],
      });

      console.log('✅ Chat guardado en Mongo:', chat._id);
    }

    socket.emit('chatCreated', {
      chatId: chat._id,
      productId,
      productName: chat.productId?.name ?? 'Producto x',
      buyerId,
      sellerId,
      messages: chat.messages,
    });
  } catch (error) {
    console.error('❌ Error createChat:', error);
  }
});

  // Obtener chats del usuario
  socket.on('getChats', async ({ userId }) => {
  try {
    console.log('📩 getChats recibido:', userId);

    const chats = await Chat.find({
      $or: [{ buyerId: userId }, { sellerId: userId }],
    })
      .sort({ updatedAt: -1 })
      .populate('productId', 'name');

    console.log('📤 Chats encontrados:', chats.length);

    socket.emit(
      'chatsList',
      chats.map(chat => ({
        chatId: chat._id,
        productName: chat.productId.name,
        productId: chat.productId,
        buyerId: chat.buyerId,
        sellerId: chat.sellerId,
        messages: chat.messages,
      }))
    );
  } catch (error) {
    console.error('❌ Error getChats:', error);
  }
});

});

// 4️⃣ Escuchar en el puerto 4000
server.listen(PORT, () => console.log('Backend server is running on port', PORT));