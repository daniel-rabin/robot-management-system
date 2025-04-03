import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getRobots } from "../utils/firestoreHelpers";
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
  const [userFirstName, setUserFirstName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <SidebarLayout currentPage="Robots" userFirstName={userFirstName || ""}>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 animate-spin border-t-blue-500"></div>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4">Robot Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {robots.map((robot) => (
              <div key={robot.id} className="bg-white shadow p-4 rounded-xl">
                <h3 className="text-lg font-bold mb-2">{robot.name}</h3>
                <p className="text-sm">Type: {robot.type}</p>
                <p className="text-sm">Status: {robot.status}</p>
                <p className="text-sm">Battery: {robot.battery ?? "N/A"}%</p>
                <p className="text-sm">
                  Description: {robot.description || "-"}
                </p>
                <p className="text-sm">Serial #: {robot.serialNumber || "-"}</p>
                <p className="text-sm">
                  Connection: {robot.connectionProtocol || "-"}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </SidebarLayout>
  );
}
