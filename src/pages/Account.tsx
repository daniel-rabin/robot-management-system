import React from "react";

export default function Account() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Profile</h3>
          <p>Email: user@example.com</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Billing</h3>
          <p>Plan: Free Tier</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Account Options</h3>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
