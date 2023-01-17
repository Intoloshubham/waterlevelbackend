import express from "express";
import { Server } from "socket.io";
import constants from "../constants/index.js";

const io = new Server();

io.on("connection", function (socket) {
  console.log("socket user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const socketConn = {
  emit: function (event, data, notification_type) {
    console.log(event, data, notification_type);

    io.sockets.emit(event, data);
  },
  // io.on(constants.CONN, (socket) => {
  //   console.log('data===',data)
  //   console.log("on connection", socket.id);

  //   socket.emit("send_online_friend", "i m from server  d");
  //   socket.emit("notifications", data);

  // });
};

export { socketConn, io };
