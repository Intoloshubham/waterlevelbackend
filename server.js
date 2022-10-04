
import express from 'express'
import {PORT, APP_URL, WS_PORT, DATABASE_URL} from './config/index.js';
import connectDB from "./config/connectDB.js";
import routes from './routes/index.js';
import path from 'path';
import cors from 'cors'
import WebSocket from 'ws';

const app = express();

const port = PORT;

// Database Connection
connectDB(DATABASE_URL);

app.use(cors());

app.use(express.json({ limit: '5mb' })) 

app.use('/api', routes);
app.use('/uploads', express.static('uploads'));

const wsServer = new WebSocket.Server({port: WS_PORT}, ()=> console.log(`WS Server is listening at ${WS_PORT}`));
wsServer.on('connection', (ws, req) => {
    console.log('A new client is connected');
    ws.send(" Send Data ddjasdjas sfjsdfsdj sdd fsjdfhsdj");

    ws.on('message', (data) =>{
        console.log(data.toString());
    });
})

app.get("/", (req, res) => res.sendFile(path.resolve("./index.html")));

app.listen(port, () => {
    console.log(`Server listening at ${APP_URL}`)
}) 



// app.get('/', (req, res) =>{
//     res.sendFile(path.join(__dirname, 'index.html'));
// });


// app.listen(HTTP_PORT, ()=> console.log(`HTTP server listening at ${HTTP_PORT}`));

// let connectedClients = [];
// wsServer.on('connection', (ws, req)=>{
//     console.log('Connected');
//     connectedClients.push(ws);

//     ws.on('message', data => {
//         connectedClients.forEach((ws,i)=>{
//             if(ws.readyState === ws.OPEN){
//                 ws.send(data);
//             }else{
//                 connectedClients.splice(i ,1);
//             }
//         })
//     });
// });

// app.get('/client',(req,res)=>res.sendFile(path.resolve(__dirname, './client/index.html')));
// app.listen(HTTP_PORT, ()=> console.log(`HTTP server listening at ${HTTP_PORT}`));

//----------------------------------------------------------------------------------------

// const app = require("express")();
// const Stream = require('node-rtsp-stream')
// // const Stream = require('node-rtsp-stream-jsmpeg')
// // const cors = require('cors')

// const streams = {};

// const stream_config = [{
//   key:'waterlevel',
//   port:9000,
//   // url:'http://192.168.0.131'
//   url:'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4'
// }];

// const startStream = (name, streamUrl, wsPort) =>{
//   const stream = new Stream({
//     name,
//     streamUrl,
//     wsPort,
//     ffmpegOptions: { 
//       '-stats': '', 
//       '-r': 20 
//     }
//   })

//   streams[wsPort] = stream;
// }

// app.get('/start-stream', (req,res)=>{
//   //url = RTSP link
//   //port = wsPort
//   const {url, port, key="stream"} = req.query;
//   if(!url && !port){
//     return res.json({message:"Bad input"})
//   }

//   if (streams[port]) {
//     return req.json({message:"Port is in use"});
//   } 

//   startStream(key, url, port);

//   res.json({
//     message:"Started Stream",
//   })

// })

// app.listen(1999, ()=> {
//   console.log("Server running on 1999");
//   stream_config.forEach((config) =>{
//     startStream(config.key, config.url, config.port);
//   })
// })




// import express from 'express'
// import {APP_URL, PORT} from './config/index.js';
// // import connectDB from "./db/connectDB.js";
// //import connectDB from "./config/connectDB.js";
// // import errorHandler from './middlewares/errorHandler.js';
// import routes from './routes/index.js';
// import path from 'path';
// import cors from 'cors'

// const app = express()  
 
// // const port = process.env.PORT || '8000'
// // const DATABASE_URL = process.env.DATABASE_URL || "mongodb+srv://rohitnamdeo:rohitnamdeo123@cluster0.vkr7r.mongodb.net/consoft";
// const port = PORT;

// // Database Connection
// //connectDB(DATABASE_URL);

// //global
// global.appRoot = path.resolve();

// app.use(cors())
// // app.use(express.urlencoded({ extended: false}));

// app.use(express.urlencoded({ limit: "5mb", extended: false, parameterLimit: 5000 }))

// // JSON  
// // app.use(express.json()) 
// app.use(express.json({ limit: '5mb' })) 

// // Load Routes
// app.use('/api', routes);
// app.use('/uploads', express.static('uploads'));

// // app.use(errorHandler);

// app.listen(port, () => {
//   console.log(`Server listening at ${APP_URL}`)
// })  

//--------------------------------------------

// const path = require("path");
// const express = require("express");
// const WebSocket = require("ws");

// const dotenv = require("dotenv");
// dotenv.config();

// const app = express() ;

// const WS_PORT = 8889;
// const port = process.env.PORT || '8888'

// const wsServer = new WebSocket.Server({port:WS_PORT}, ()=>console.log(`WS server is listening at ${WS_PORT}`));

// let connectedClients = [];

// wsServer.on("connection", (ws, req) => {
// 	console.log("Connected");


//     //------------
//     // connectedClients.push(ws);
//     // ws.on('message', data => {
//     //     connectedClients.forEach((ws,i)=>{
//     //         if(ws.readyState === ws.OPEN){
//     //             ws.send(data);
//     //         }else{
//     //             connectedClients.splice(i ,1);
//     //         }
//     //     })
//     // });
//     //----------------

// 	// ws.on("message", (data) => {
// 	// 	if (data.indexOf("WEB_CLIENT") !== -1) {
// 	// 		connectedClients.push(ws);
// 	// 		console.log("WEB_CLIENT ADDED");
// 	// 		return;
// 	// 	}

// 	// 	connectedClients.forEach((ws, i) => {
// 	// 		if (connectedClients[i] == ws && ws.readyState === ws.OPEN) {
// 	// 			ws.send(data);
// 	// 		} else {
// 	// 			connectedClients.splice(i, 1);
// 	// 		}
// 	// 	});
// 	// });

// 	// ws.on("error", (error) => {
// 	// 	console.error("WebSocket error observed: ", error);
// 	// });
	
// });

// // app.use(express.static("."));
// // app.get("/client", (req, res) => res.sendFile(path.resolve(__dirname, "./client.html")));
// app.listen(port, () => console.log(`Server listening at ${process.env.APP_URL}`));


// const app = require('express')();
// const appWs = require('express-ws')(app);

// app.ws('/echo', ws => {
//     ws.on('message', msg => {
//         console.log('Received: ', msg);
//         ws.send(msg);
//     });
// });

// app.listen(1337, () => console.log('Server has been started'));