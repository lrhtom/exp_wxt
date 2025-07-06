

<template>
  <div class="chat-container">
    <h1>实时聊天室</h1>
    <div class="message-list">
      <div v-for="(msg, index) in messages" :key="index" class="message">
        <span class="user">{{ msg.user }}：</span>
        <span class="text">{{ msg.text }}</span>
      </div>
    </div>
    <div class="input-area">
      <input
        v-model="inputText"
        @keyup.enter="sendMessage"
        placeholder="输入消息..."
      />
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue' // 从同一行导入
import { io } from 'socket.io-client'

// 消息列表和输入框
const messages = ref<Array<{ user: string; text: string }>>([]);
const inputText = ref('');
const currentUser = ref('用户' + Math.floor(Math.random() * 1000)); // 随机用户名

// 连接到 WebSocket 服务（端口需与后端一致）
const socket = io('http://localhost:7109');

// 监听服务端消息
onMounted(() => {
  socket.on('message1', (data: { user: string; text: string }) => {
    messages.value.push(data);
  });
  socket.on('message2', (data: { user: string; text: string }) => {
    messages.value.push(data);
  });
});

// 发送消息
const sendMessage = () => {
  if (inputText.value.trim()) {
    if(inputText.value.length>10){
    socket.emit('message1', {
      user: currentUser.value,
      text: inputText.value,
    });
    }
else{
  console.log("st")
  socket.emit('message2', {
      user: currentUser.value,
      text: inputText.value,
    });
}

    inputText.value = ''; // 清空输入框
  }
};
</script>
<style scoped>
.chat-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.message-list {
  height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
}

.message {
  padding: 8px;
  margin: 6px 0;
  border-bottom: 1px solid #eee;
}

.user {
  font-weight: bold;
  color: #42b983;
}

.input-area {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3aa876;
}
</style>