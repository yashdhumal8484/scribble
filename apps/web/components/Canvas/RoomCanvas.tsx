"use client"
import { useEffect, useRef, useState } from "react";
import { WS_URL } from "@/config";
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId}:{roomId:string}){
    const[socket,setSocket]=useState<WebSocket |null>(null);
    const tokenValue =typeof window !== "undefined" ? localStorage.getItem("token") : null;
    useEffect(()=>{
        const ws=new WebSocket(`${WS_URL}?token=${tokenValue}`)
        ws.onopen=()=>{
            setSocket(ws);
            ws.send(JSON.stringify({
                type:"join_room",
                roomId
            }))
        }

    },[])
   
    if(!socket){
        return <div>
            Connecting to server
        </div>
    }
    return<div>
        <Canvas roomId={roomId} socket={socket}/>
    </div>
}