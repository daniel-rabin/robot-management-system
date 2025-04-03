// src/pages/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getRobots,
  addRobot,
  updateRobot,
  deleteRobot,
} from "../utils/firestoreHelpers";
import { RobotDetailsPane } from "../components/RobotDetailsPane";

interface Robot {
  id?: string;
  name: string;
  type: string;
  status: string;
  battery: number | null;
  description?: string;
  serialNumber?: string;
  connectionProtocol?: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [robots, setRobots] = useState<Robot[]>([]);
  const [paneOpen, setPaneOpen] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null);
  const [mode, setMode] = useState<"view" | "create">("create");

  useEffect(() => {
    if (user?.uid) {
      getRobots(user.uid).then(setRobots);
    }
  }, [user]);

  const handleCreateClick = () => {
    setSelectedRobot({
      name: "",
      type: "drone",
      status: "idle",
      battery: Math.floor(Math.random() * 100),
    });
    setMode("create");
    setPaneOpen(true);
  };

  const handleSave = async () => {
    if (!user?.uid || !selectedRobot) return;
    if (mode === "create") {
      await addRobot(user.uid, selectedRobot);
    } else if (selectedRobot.id) {
      await updateRobot(user.uid, selectedRobot.id, selectedRobot);
    }
    const updated = await getRobots(user.uid);
    setRobots(updated);
    setPaneOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!user?.uid) return;
    await deleteRobot(user.uid, id);
    setRobots((prev) => prev.filter((r) => r.id !== id));
  };

  const handleEdit = (robot: Robot) => {
    setSelectedRobot(robot);
    setMode("view");
    setPaneOpen(true);
  };

  const handleFieldChange = (field: string, value: any) => {
    if (!selectedRobot) return;
    setSelectedRobot({ ...selectedRobot, [field]: value });
  };

  // ✅ New quick status summary
  const robotCount = robots.length;
  const statusMessage =
    robotCount > 0 ? "All systems nominal" : "No bots connected";
  const [warnings, setWarnings] = useState<string[]>([]);
  const notifications = 1; // placeholder

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

      <main className="flex-1 p-6 bg-gray-100 relative">
        {/* ✅ New welcome + system status section */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold text-gray-700">
            Welcome,{" "}
            <span className="text-blue-600">{user?.email || "Operator"}</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {statusMessage} • {notifications} notification
            {notifications !== 1 ? "s" : ""} • {warnings} warning
            {warnings.length > 0 && (
              <p className="text-red-500">
                {warnings.length} warning{warnings.length !== 1 ? "s" : ""}
              </p>
            )}
          </p>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Connected Robots</h2>
        <button
          onClick={handleCreateClick}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create New Bot
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {robots.map((robot) => (
            <div key={robot.id} className="bg-white shadow rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-1">{robot.name}</h3>
              <p className="text-sm text-gray-600">Type: {robot.type}</p>
              <p className="text-sm text-green-600">Status: {robot.status}</p>
              <p className="text-sm">Battery: {robot.battery ?? "N/A"}%</p>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => handleEdit(robot)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(robot.id!)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <RobotDetailsPane
          isOpen={paneOpen}
          onClose={() => setPaneOpen(false)}
          robot={selectedRobot || {}}
          onChange={handleFieldChange}
          onSave={handleSave}
          mode={mode}
        />
      </main>
    </div>
  );
}
