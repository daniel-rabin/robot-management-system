import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getRobots,
  addRobot,
  updateRobot,
  deleteRobot,
} from "../utils/firestoreHelpers";
import { RobotDetailsPane } from "../components/RobotDetailsPane";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  FiSettings,
  FiMenu,
  FiArrowLeft,
  FiArrowRight,
  FiGrid,
  FiCpu,
  FiCode,
  FiSliders,
  FiCalendar,
  FiFileText,
} from "react-icons/fi";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";

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
  const { user, logout } = useAuth();
  const [robots, setRobots] = useState<Robot[]>([]);
  const [paneOpen, setPaneOpen] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null);
  const [mode, setMode] = useState<"view" | "create">("create");
  const [userFirstName, setUserFirstName] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const AUTO_LOGOUT_TIME = 15 * 60 * 1000;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        logout();
        alert("You've been logged out due to inactivity.");
      }, AUTO_LOGOUT_TIME);
    };

    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeout);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [logout]);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.uid) {
        const robotData = await getRobots(user.uid);
        setRobots(robotData as Robot[]);

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const name = data?.profile?.firstName || null;
          if (name && typeof name === "string") {
            const formatted =
              name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
            setUserFirstName(formatted);
          } else {
            setUserFirstName(null);
          }
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

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
    setRobots(updated as Robot[]);
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

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(robots);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setRobots(reordered);
  };

  const navItems = [
    { label: "Dashboard", icon: <FiGrid /> },
    { label: "Robots", icon: <FiCpu /> },
    { label: "Code", icon: <FiCode /> },
    { label: "Control", icon: <FiSliders /> },
    { label: "Planner", icon: <FiCalendar /> },
    { label: "Logs", icon: <FiFileText /> },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={`bg-gray-800 text-white p-4 flex flex-col justify-between ${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300`}
      >
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1
              className={`text-2xl font-bold cursor-pointer hover:text-blue-400 ${
                !sidebarOpen && "hidden"
              }`}
              onClick={() => navigate("/")}
            >
              Robodyne
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white"
            >
              {sidebarOpen ? (
                <FiArrowLeft size={20} />
              ) : (
                <FiArrowRight size={20} />
              )}
            </button>
          </div>
          <nav className="space-y-2">
            {navItems.map(({ label, icon }) => (
              <button
                key={label}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded"
              >
                {icon}
                {sidebarOpen && <span>{label}</span>}
              </button>
            ))}
          </nav>
        </div>
        <button className="block w-full text-left hover:bg-gray-700 p-2 rounded">
          {sidebarOpen ? "Settings" : <FiSettings />}
        </button>
      </aside>

      <main className="flex-1 p-6 bg-gray-100 relative overflow-x-hidden overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 animate-spin border-t-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="bg-white p-4 rounded-xl shadow mb-6 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">
                  Welcome,{" "}
                  <span className="text-blue-600">
                    {userFirstName || user?.email}
                  </span>
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  All systems nominal • 1 notification • warning
                </p>
              </div>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-200"
                >
                  <span className="text-sm font-medium">Account Settings</span>
                  <FiSettings size={18} />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow z-10">
                    <div className="px-4 py-2 font-semibold text-gray-800 border-b">
                      {userFirstName}
                    </div>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                      Account Settings
                    </button>
                    <div className="border-t my-1"></div>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 text-sm"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Connected Robots</h2>
            <button
              onClick={handleCreateClick}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create New Bot
            </button>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="robots" direction="horizontal">
                {(provided) => (
                  <div
                    className="flex flex-wrap gap-4 overflow-x-hidden"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {robots.map((robot, index) => (
                      <Draggable
                        key={robot.id}
                        draggableId={robot.id!}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white shadow rounded-xl p-4 w-80"
                          >
                            <h3 className="text-lg font-semibold mb-1">
                              {robot.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Type: {robot.type}
                            </p>
                            <p className="text-sm text-green-600">
                              Status: {robot.status}
                            </p>
                            <p className="text-sm">
                              Battery: {robot.battery ?? "N/A"}%
                            </p>
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
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <RobotDetailsPane
              isOpen={paneOpen}
              onClose={() => setPaneOpen(false)}
              robot={selectedRobot || {}}
              onChange={handleFieldChange}
              onSave={handleSave}
              mode={mode}
            />
          </>
        )}
      </main>
    </div>
  );
}
