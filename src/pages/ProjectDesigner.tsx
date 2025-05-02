import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getRobots } from "../utils/firestoreHelpers";
import { useAuth } from "../context/AuthContext";

export default function ProjectDesigner() {
  const { id } = useParams();
  const { user } = useAuth();
  const [robots, setRobots] = useState([]);
  const [viewMode, setViewMode] = useState("2D");
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const canvasRef = useRef(null);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const fetchRobots = async () => {
      if (user?.uid) {
        const data = await getRobots(user.uid);
        setRobots(data);
      }
    };
    fetchRobots();
  }, [user]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left - rect.width / 2 - offset.x);
    const y = Math.floor(e.clientY - rect.top - rect.height / 2 - offset.y);
    setMouseCoords({ x, y });

    if (dragging) {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      lastPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const startDrag = (e) => {
    setDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const endDrag = () => {
    setDragging(false);
  };

  const gridSize = 5000;
  const origin = { x: offset.x, y: offset.y };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      {/* Top Bar */}
      <div className="h-12 bg-gray-800 text-white flex items-center justify-between px-4">
        <div>
          <span className="font-semibold">Robodyne Designer</span>
          <span className="ml-4 text-sm text-gray-400">Project ID: {id}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <button className="hover:underline">File</button>
          <button className="hover:underline">Config</button>
          <button className="hover:underline">Save</button>
          <button className="hover:underline">Download</button>
          <button className="hover:underline">Upload</button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-16 bg-gray-200 flex flex-col items-center py-2 border-r">
          <button className="mb-2 text-xs">🖊</button>
          <button className="mb-2 text-xs">📐</button>
          <button className="mb-2 text-xs">⬛</button>
        </div>

        {/* Center Drawing Area */}
        <div
          className="flex-1 bg-white relative overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseDown={startDrag}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          ref={canvasRef}
        >
          <svg
            className="absolute top-0 left-0"
            width="5000"
            height="5000"
            style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
          >
            <defs>
              <pattern
                id="smallGrid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth="1"
                />
              </pattern>
              <pattern
                id="grid"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <rect width="100" height="100" fill="url(#smallGrid)" />
                <path
                  d="M 100 0 L 0 0 0 100"
                  fill="none"
                  stroke="#ccc"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="5000" height="5000" fill="url(#grid)" />
            <line
              x1="2500"
              y1="0"
              x2="2500"
              y2="5000"
              stroke="red"
              strokeWidth="2"
            />
            <line
              x1="0"
              y1="2500"
              x2="5000"
              y2="2500"
              stroke="blue"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Right Robot Sidebar */}
        <div className="w-64 bg-gray-100 p-2 border-l overflow-y-auto">
          <h3 className="text-md font-semibold mb-2">Robots</h3>
          <div className="space-y-2">
            {robots.map((robot) => (
              <div key={robot.id} className="p-2 bg-white rounded shadow">
                {robot.name || robot.type}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-10 bg-gray-800 text-white text-sm px-4 flex items-center justify-between">
        <span>Tool: Select</span>
        <div className="flex items-center gap-4">
          <span className="text-gray-300">
            Mouse: x={mouseCoords.x}, y={mouseCoords.y}
          </span>
          <span>Status: Ready</span>
          <div>
            <label className="mr-2">View:</label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="bg-gray-700 text-white border-none rounded px-2 py-1"
            >
              <option value="2D">2D</option>
              <option value="3D" disabled>
                3D (coming soon)
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Info Panel (Bottom Tab) */}
      <div className="h-40 bg-gray-700 text-white flex items-center justify-center text-sm border-t">
        {selectedObject ? (
          <div>
            <p className="font-semibold">{selectedObject.name}</p>
            <p>{selectedObject.description}</p>
            <p>
              Location: ({selectedObject.x}, {selectedObject.y})
            </p>
            <p>Script: {selectedObject.script || "None"}</p>
          </div>
        ) : (
          <p className="italic">
            Click an object for more information and actions
          </p>
        )}
      </div>
    </div>
  );
}
