import express from "express";
import { Server } from "socket.io";
import constants from "../constants/index.js";


const io = new Server();



const socketConn=()=>{

  io.on(constants.CONN, (socket) => {
    console.log("on connection", socket.id);  

    socket.emit("send_online_friend", "i m from server  d");
    socket.emit("notify", "i m from ser");    
  
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

}

export   {socketConn,io};
