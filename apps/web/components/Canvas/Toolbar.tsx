import React from "react";
import {
  MousePointerClick,
  Circle,
  Square,
  Hand,
  Eraser,
  Minus,
  SquareDashedMousePointer,
  Pencil,
} from "lucide-react";
import { Tool } from "./Canvas";
interface ToolbarArrI {
  name: Tool;
  title: string;
  icon: JSX.Element;
}
const toolbarArr: ToolbarArrI[] = [
  { name: "point", title: "Pointer", icon: <MousePointerClick /> },
  { name: "pencil", title: "Line", icon: <Pencil /> },
  { name: "circle", title: "Circle", icon: <Circle /> },
  { name: "rect", title: "Rectangle", icon: <Square /> },
  { name: "hand", title: "Pan", icon: <Hand /> },
  { name: "erase", title: "Eraser", icon: <Eraser /> },
  { name: "select", title: "Select", icon: <SquareDashedMousePointer /> },
];

// IconButton Component
interface iconButtonI {
  onClick: () => void;
  activated: boolean;
  icon?: JSX.Element;
  title: string;
  className?: string;
}
function IconButton({
  onClick,
  activated,
  icon,
  title,
  className,
}: iconButtonI) {
  return (
    <button
      onClick={onClick}
      className={`
        p-2 rounded-lg focus:outline-none transition-all
        ${activated ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}
        ${className}
      `}
      title={title}
    >
      {icon || title}
    </button>
  );
}

const Toolbar = ({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Tool;
  setSelectedTool: (t: Tool) => void;
}) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        left: "50%",
        transform: "translateX(-50%)",
      }}
      className={`
        sticky left-1/2 
       flex gap-2 items-center justify-center shadow-lg
        bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90
        rounded-lg px-4 py-2 text-xs font-mono
        sm:flex-wrap sm:justify-start sm:left-5 sm:top-5 sm:translate-x-0
      `}
    >
      {toolbarArr.map((tool, id) => (
        <IconButton
          key={id}
          onClick={() => setSelectedTool(tool.name)}
          activated={selectedTool === tool.name}
          icon={tool.icon}
          title={tool.title}
        />
      ))}
    </div>
  );
};

export default Toolbar;