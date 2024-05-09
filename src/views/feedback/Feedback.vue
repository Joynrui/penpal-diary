<template>
  <div class="chat-box">
    <div class="message-container" ref="messageContainer">
      <div v-for="(message, index) in messages" :key="index" class="message" :class="{ 'sent': message.sentByMe }">
        <div class="message-content">{{ message.content }}</div>
      </div>
    </div>
    <div class="input-container">
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type your message...">
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: [],
      newMessage: ""
    };
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim() === "") {
        return;
      }
      this.sendToOtherUser(this.newMessage);
      this.messages.push({
        content: this.newMessage,
        sentByMe: true
      });
      this.newMessage = "";
      this.scrollToBottom();
    },
    sendToOtherUser(message) {
      console.log("Sending message to other user:", message);
    },
    scrollToBottom() {
      this.$refs.messageContainer.scrollTop = this.$refs.messageContainer.scrollHeight;
    }
  }
};
</script>

<style scoped>
.chat-box {
  width: 300px;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
}

.message-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.message {
  max-width: 80%;
  margin: 8px;
  padding: 10px;
  border-radius: 8px;
}

.message-content {
  word-wrap: break-word;
}

.sent {
  background-color: #cce5ff;
}

.input-container {
  display: flex;
  padding: 10px;
}

.input-container input {
  flex: 1;
  padding: 8px;
  margin-right: 10px;
}

.input-container button {
  padding: 8px;
  cursor: pointer;
}
</style>
