import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getRobots, updateRobot } from "../utils/firestoreHelpers";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import SidebarLayout from "../components/SidebarLayout";

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

export default function Robots() {
  const { user } = useAuth();
  const [robots, setRobots] = useState<Robot[]>([]);
  const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null);
  const [userFirstName, setUserFirstName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editableRobot, setEditableRobot] = useState<Robot | null>(null);
  const [extraData, setExtraData] = useState<string>(
    "More data, make this whole panel scrollable"
  );
  const [tempExtraData, setTempExtraData] = useState<string>("");

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

  const handleEdit = () => {
    if (selectedRobot) {
      setEditableRobot({ ...selectedRobot });
      setTempExtraData(extraData);
      setEditMode(true);
    }
  };

  const handleSave = async () => {
    if (user?.uid && editableRobot && editableRobot.id) {
      const updatedRobot = {
        ...editableRobot,
        description: tempExtraData,
      };
      await updateRobot(user.uid, editableRobot.id, updatedRobot);
      const updatedRobots = await getRobots(user.uid);
      setRobots(updatedRobots as Robot[]);
      setSelectedRobot(updatedRobot);
      setExtraData(tempExtraData);
      setEditMode(false);
    }
  };

  const handleCancel = () => {
    setEditableRobot(null);
    setTempExtraData("");
    setEditMode(false);
  };

  return (
    <SidebarLayout currentPage="Robots" userFirstName={userFirstName || ""}>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 animate-spin border-t-blue-500"></div>
        </div>
      ) : (
        <div className="flex h-full gap-4 overflow-hidden">
          {/* Robot List */}
          <div className="w-1/3 overflow-y-auto pr-2">
            {robots.map((robot) => (
              <div
                key={robot.id}
                className="bg-white rounded shadow p-3 mb-2 flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold">{robot.name}</div>
                  <div className="text-sm text-gray-600">
                    {robot.type} • {robot.status} • Battery:{" "}
                    {robot.battery ?? "N/A"}%
                  </div>
                </div>
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  onClick={() => {
                    setSelectedRobot(robot);
                    setExtraData(robot.description || "");
                  }}
                >
                  View
                </button>
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          <div className="w-2/3 h-full overflow-y-auto">
            {selectedRobot && (
              <div className="bg-white p-6 rounded-xl shadow-md min-h-full">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-bold">
                    {selectedRobot.name} | {selectedRobot.type},{" "}
                    {selectedRobot.status}, Battery:{" "}
                    {selectedRobot.battery ?? "N/A"}%
                  </h2>
                  <div className="flex gap-2">
                    {editMode ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleEdit}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-100 p-4 rounded">
                    <h3 className="font-semibold mb-2">VIEW CAMERA</h3>
                    <p>
                      (click to turn on camera and view what the robot sees)
                    </p>
                  </div>

                  <div className="bg-gray-100 p-4 rounded">
                    <h3 className="font-semibold mb-2">CONSOLE LOG</h3>
                    <p>Outputs any data transmitted to and from robot</p>
                  </div>

                  <div className="bg-gray-100 p-4 rounded">
                    <h3 className="font-semibold mb-2">Robot Info</h3>
                    <p>
                      Type:{" "}
                      {editMode ? (
                        <input
                          className="border p-1 w-full"
                          value={editableRobot?.type || ""}
                          onChange={(e) =>
                            setEditableRobot({
                              ...editableRobot!,
                              type: e.target.value,
                            })
                          }
                        />
                      ) : (
                        selectedRobot.type
                      )}
                    </p>
                    <p>Status: {selectedRobot.status}</p>
                    <p>Battery: {selectedRobot.battery ?? "N/A"}%</p>
                    <p>
                      Serial #:{" "}
                      {editMode ? (
                        <input
                          className="border p-1 w-full"
                          value={editableRobot?.serialNumber || ""}
                          onChange={(e) =>
                            setEditableRobot({
                              ...editableRobot!,
                              serialNumber: e.target.value,
                            })
                          }
                        />
                      ) : (
                        selectedRobot.serialNumber || "-"
                      )}
                    </p>
                    <p>
                      Connection:{" "}
                      {editMode ? (
                        <input
                          className="border p-1 w-full"
                          value={editableRobot?.connectionProtocol || ""}
                          onChange={(e) =>
                            setEditableRobot({
                              ...editableRobot!,
                              connectionProtocol: e.target.value,
                            })
                          }
                        />
                      ) : (
                        selectedRobot.connectionProtocol || "-"
                      )}
                    </p>
                    <p>Health: -</p>
                    <p>#notis: -</p>
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded overflow-y-auto">
                  {editMode ? (
                    <textarea
                      className="w-full p-2 border rounded resize-y min-h-[8rem]"
                      value={tempExtraData}
                      onChange={(e) => setTempExtraData(e.target.value)}
                      rows={5}
                    />
                  ) : (
                    <p>{extraData}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
