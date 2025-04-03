import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RobotDetailsPaneProps {
  isOpen: boolean;
  onClose: () => void;
  robot: any;
  onChange: (field: string, value: any) => void;
  onSave: () => void;
  mode: "view" | "create";
}

export const RobotDetailsPane: React.FC<RobotDetailsPaneProps> = ({
  isOpen,
  onClose,
  robot,
  onChange,
  onSave,
  mode,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background overlay */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Sliding up panel */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-50 bg-white w-full max-w-2xl mx-auto p-6 rounded-xl shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {mode === "create" ? "Create New Bot" : "Robot Details"}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Robot Name"
                value={robot.name}
                onChange={(e) => onChange("name", e.target.value)}
                className="w-full border rounded p-2"
              />
              <textarea
                placeholder="Description"
                value={robot.description || ""}
                onChange={(e) => onChange("description", e.target.value)}
                className="w-full border rounded p-2"
              />
              <select
                value={robot.type}
                onChange={(e) => onChange("type", e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="drone">Drone</option>
                <option value="arm">Arm</option>
                <option value="humanoid">Humanoid</option>
                <option value="vacuum">Vacuum</option>
                <option value="uav">UAV</option>
              </select>
              <input
                type="text"
                placeholder="Serial Number"
                value={robot.serialNumber || ""}
                onChange={(e) => onChange("serialNumber", e.target.value)}
                className="w-full border rounded p-2"
              />
              <input
                type="text"
                placeholder="Connection Protocol (e.g. Bluetooth, Wi-Fi)"
                value={robot.connectionProtocol || ""}
                onChange={(e) => onChange("connectionProtocol", e.target.value)}
                className="w-full border rounded p-2"
              />

              <button
                onClick={onSave}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                {mode === "create" ? "Create Bot" : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
