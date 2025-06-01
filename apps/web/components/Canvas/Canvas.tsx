import { useEffect, useRef, useState } from "react";
import {
    Minus,
    Plus,
  } from "lucide-react";
import { Game } from "@/draw/Game";

export type Tool =
  | "circle"
  | "rect"
  | "pencil"
  | "erase"
  | "undo"
  | "redo"
  | "hand"
  | "point"
  | "select"
  | "line";

export function Canvas({
    roomId,
    socket
}: {
    socket: WebSocket;
    roomId: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("circle")
    const[zoom,setZoom]=useState(0.75)

    const decreaseZoom=()=>{
        setZoom((prevZoom)=>Math.max(0.5,prevZoom-0.1))
    }
    const increaseZoom=()=>{
        setZoom((prevZoom)=>Math.max(0.5,prevZoom+0.1))
    }
    useEffect(()=>{
        const handleSize=()=>{
        if(canvasRef.current){
            canvasRef.current.width=window.innerWidth
            canvasRef.current.height=window.innerHeight
        }
    }
    window.addEventListener("resize",handleSize)
    return ()=>window.removeEventListener("resize",handleSize)
    },[game])

   
    useEffect(() => {
        game?.setTool(selectedTool);
    }, [selectedTool, game]);
    useEffect(()=>{
        if(game){
            game.setZoom(zoom);
            game.redraw();
        }
    },[game,zoom])
    useEffect(() => {
        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket);
            setGame(g);
            return () => {
                g.destroy();
            }
        }
    }, [canvasRef]);

    return <div style={{
        height: "100vh",
        overflow: "hidden"
    }}>
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
         <Toolbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
        <div
        style={{
          padding: "10px",
          borderRadius: "10px",
        }}
        className={`fixed bg-blue-500  text-white transform shadow-md rounded-lg flex items-center justify-center gap-4 max-w-auto sm:bottom-5 sm:left-5 sm:translate-x-0`}
      >
        <button
          onClick={decreaseZoom}
          type="button"
          className="pl-4 pr-4 cursor-pointer"
        >
          <Minus size={20} />
        </button>
        <p className="text-xs">{Math.round(zoom * 100)}%</p>
        <button
          onClick={increaseZoom}
          type="button"
          className="pl-4 pr-4 cursor-pointer"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
}

