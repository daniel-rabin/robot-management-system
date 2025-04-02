import React from 'react';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6">Robodyne</h1>
        <nav className="space-y-2">
          <button className="block w-full text-left hover:bg-gray-700 p-2 rounded">Dashboard</button>
          <button className="block w-full text-left hover:bg-gray-700 p-2 rounded">Robots</button>
          <button className="block w-full text-left hover:bg-gray-700 p-2 rounded">Code</button>
          <button className="block w-full text-left hover:bg-gray-700 p-2 rounded">Control</button>
          <button className="block w-full text-left hover:bg-gray-700 p-2 rounded">Planner</button>
          <button className="block w-full text-left hover:bg-gray-700 p-2 rounded">Logs</button>
          <button className="block w-full text-left hover:bg-gray-700 p-2 rounded">Settings</button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-100">
        <h2 className="text-2xl font-semibold mb-4">Connected Robots</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white shadow rounded-xl p-4">
            <h3 className="text-lg font-semibold">Drone Alpha</h3>
            <p className="text-sm text-gray-600">Type: Drone</p>
            <p className="text-sm text-green-600">Status: Connected</p>
            <p className="text-sm">Battery: 89%</p>
            <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Details</button>
          </div>
          <div className="bg-white shadow rounded-xl p-4">
            <h3 className="text-lg font-semibold">Robotic Arm 1</h3>
            <p className="text-sm text-gray-600">Type: Arm</p>
            <p className="text-sm text-yellow-600">Status: Idle</p>
            <p className="text-sm">Battery: N/A</p>
            <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Details</button>
          </div>
        </div>
      </main>
    </div>
  );
}
