// File: /src/pages/Dashboard.tsx
import React from 'react';

export default function Dashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Robot Management Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="text-xl font-semibold">Connected Robots</h2>
          {/* Placeholder for robot list */}
        </div>
        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="text-xl font-semibold">Live Telemetry</h2>
          {/* Placeholder for real-time data */}
        </div>
      </div>
    </div>
  );
}
