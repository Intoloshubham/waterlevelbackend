import express from "express";
import { Server } from "socket.io";
import constants from "../constants/index.js";


const io = new Server();



const socketConn=(data)=>{

  io.on(constants.CONN, (socket) => {
    console.log('data===',data)
    console.log("on connection", socket.id);  

    socket.emit("send_online_friend", "i m from server  d");
    socket.emit("notify", data);    
  
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

}

export   {socketConn,io};
