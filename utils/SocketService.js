import express from 'express'
const app=express();

import http from 'http'
const server=http.createServer(app);
import {Server} from 'socket.io';
const io=new Server(server,{
    cors:{origin:'*'}
  });








export default io;