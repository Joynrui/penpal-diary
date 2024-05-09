<template>
  <div class="command-line">
    <div class="prompt">{{ prompt }}</div>
    <div class="output">
      <div
        v-for="(line, index) in commandLineLogs"
        :key="index"
        class="output-line"
      >
        {{ line }}
      </div>
    </div>
  </div>
</template>

<script>
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

export default {
  data() {
    return {
      prompt: "$",
      commandLineLogs: [],
      stompClient: null,
    };
  },
  created() {
    this.initializeWebSocket();
  },
  methods: {
    initializeWebSocket() {
      const socket = new SockJS("/ws-log");
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect({}, () => {
        this.stompClient.subscribe("/topic/logs", (logMessage) => {
          this.handleLogMessage(JSON.parse(logMessage.body));
        });
      });
    },
    handleLogMessage(logMessage) {
      this.commandLineLogs.push(logMessage);
    },
  },
};
</script>

<style lang="less" scoped>
.command-line {
  font-family: monospace;
  background-color: #000;
  color: #fff;
  padding: 10px;
}

.prompt {
  color: #0f0;
  margin-bottom: 5px;
}

.output-line {
  margin-bottom: 5px;
}
</style>
