import { WebSocketServer } from 'ws';
import WebSocket from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken"
import {prismaClient} from "@repo/db/client"
import { JWT_SECRET } from '@repo/backend-common/config';
const wss = new WebSocketServer({ port: 8080 });

interface User{
  ws:WebSocket,
  rooms:string[],
  userId:string
}
const users:User[]=[];
function checkUser(token:string){
  try{
    const decoded=jwt.verify(token,JWT_SECRET);
    if(typeof decoded==="string"){
      return null;
    }
    if(!decoded || !decoded.id){
      return null;
    }
    return decoded.id;
  }catch(e){
    console.log(e);
  }
}
wss.on('connection', function connection(ws,request) {
  const url=request.url
  if(!url){
    return;
  }
  const queryParams=new URLSearchParams(url.split('?')[1]);
  const token=queryParams.get('token') ||""
  const userId=checkUser(token)
  if(!userId){
    ws.close();
    return;
  }
  users.push({
    userId,
    rooms:[],
    ws
  })
  ws.on('message', async function message(data) {
    let parsedData;
    if(typeof data !=="string"){
      parsedData=JSON.parse(data.toString());
    }else{
      parsedData=JSON.parse(data)
    }
    if(parsedData.type==="join_room"){
      const user=users.find(x=>x.ws===ws);
      user?.rooms.push(parsedData.roomId)
    }
    if(parsedData.type==="leave_room"){
      const user=users.find(x=>x.ws===ws);
      if(!user){
        return;
      }
      user.rooms=user?.rooms.filter(x=>x!=parsedData.room)
    }
    if(parsedData.type=="chat"){
      const roomId = parsedData.roomId;
      const id = parsedData.id;
      const message = parsedData.message;
      try{
          await prismaClient.chat.create({
              data:{
                  id,
                  roomId:(roomId),
                  message,
                  userId
              }
          });
          console.log(users);
          users.forEach(user=>{
              if(user.rooms.includes(roomId)){
                  user.ws.send(JSON.stringify({
                      type:"chat",
                      id,
                      message:message,
                      roomId
                  }))
              }
          })
      }
      catch(e){
          console.log("An error occured");
          console.log(e);
          return;
      }
  }
  });
});