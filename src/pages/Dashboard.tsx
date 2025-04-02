import React, { useEffect, useState } from "react";

interface Robot {
  id: string;
  name: string;
  type: string;
  status: string;
  battery: number | null;
}

export default function Dashboard() {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("drone");

  useEffect(() => {
    const stored = localStorage.getItem("robots");
    if (stored) {
      setRobots(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("robots", JSON.stringify(robots));
  }, [robots]);

  const addRobot = () => {
    const newRobot: Robot = {
      id: crypto.randomUUID(),
      name: newName || `Robot ${robots.length + 1}`,
      type: newType,
      status: "idle",
      battery: Math.floor(Math.random() * 100),
    };
    setRobots([...robots, newRobot]);
    setNewName("");
    setNewType("drone");
  };

  const deleteRobot = (id: string) => {
    setRobots(robots.filter((r) => r.id !== id));
  };

  const updateRobotName = (id: string, name: string) => {
    setRobots(robots.map((r) => (r.id === id ? { ...r, name } : r)));
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6">Robodyne</h1>
        <nav className="space-y-2">
          {[
            "Dashboard",
            "Robots",
            "Code",
            "Control",
            "Planner",
            "Logs",
            "Settings",
          ].map((tab) => (
            <button
              key={tab}
              className="block w-full text-left hover:bg-gray-700 p-2 rounded"
            >
              {tab}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-100">
        <h2 className="text-2xl font-semibold mb-4">Connected Robots</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Robot name"
            className="p-2 border rounded w-full"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="drone">Drone</option>
            <option value="arm">Arm</option>
            <option value="humanoid">Humanoid</option>
            <option value="vacuum">Vacuum</option>
            <option value="uav">UAV</option>
          </select>
          <button
            onClick={addRobot}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {robots.map((robot) => (
            <div key={robot.id} className="bg-white shadow rounded-xl p-4">
              <input
                type="text"
                value={robot.name}
                onChange={(e) => updateRobotName(robot.id, e.target.value)}
                className="text-lg font-semibold mb-1 w-full border-b"
              />
              <p className="text-sm text-gray-600">Type: {robot.type}</p>
              <p className="text-sm text-green-600">Status: {robot.status}</p>
              <p className="text-sm">Battery: {robot.battery ?? "N/A"}%</p>
              <div className="flex justify-end">
                <button
                  onClick={() => deleteRobot(robot.id)}
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
