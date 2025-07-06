import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { ThreadPool } from './thread-pool.js';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
const threadPool = new ThreadPool(4); // 4 个工作线程
app.use(cors());

// WebSocket 连接处理
io.on('connection', (socket) => {
  console.log('用户已连接:', socket.id);

  socket.on('message1', async (data) => {
    console.log('收到消息:', data);

    // 将消息交给线程池处理
    const result = await threadPool.runTask(data);
    io.emit('message1', result); // 广播处理后的消息
    socket.broadcast.emit('message1', {
      user: '系统',
      text: `用户 ${socket.id} 加入了聊天室`,
      type: 'notification'
    });
  });
  socket.on('message2', async (data) => {
    console.log('收到短消息:', data);

    // 将消息交给线程池处理
    const result = await threadPool.runTask(data);
    io.emit('message2', result); // 广播处理后的消息
  });
  socket.on('disconnect', () => {
    console.log('用户已断开:', socket.id);
  });
});

const PORT = 7109;
httpServer.listen(PORT, () => {
  console.log(`服务运行在: http://localhost:${PORT}`);
});