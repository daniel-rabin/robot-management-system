import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import SidebarLayout from "../components/SidebarLayout";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { FiPlus, FiTrash2, FiEdit2, FiPlay } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface Project {
  id: string;
  title: string;
  description?: string;
}

export default function Planner() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.uid) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    const ref = collection(db, "users", user!.uid, "projects");
    const snap = await getDocs(ref);
    const data = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[];
    setProjects(data);
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    const ref = collection(db, "users", user!.uid, "projects");
    await addDoc(ref, {
      title: newTitle,
      description: newDescription,
    });
    setNewTitle("");
    setNewDescription("");
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    const ref = doc(db, "users", user!.uid, "projects", id);
    await deleteDoc(ref);
    fetchProjects();
  };

  const handleEditOpen = (project: Project) => {
    setEditProject(project);
    setEditTitle(project.title);
    setEditDescription(project.description || "");
  };

  const handleEditSave = async () => {
    if (!editProject) return;
    const ref = doc(db, "users", user!.uid, "projects", editProject.id);
    await updateDoc(ref, {
      title: editTitle,
      description: editDescription,
    });
    setEditProject(null);
    fetchProjects();
  };

  const handleOpenProject = (id: string) => {
    window.open(`/planner/project/${id}`, "_blank");
  };

  return (
    <SidebarLayout currentPage="Planner" userFirstName={user?.email || ""}>
      <div className="flex flex-col h-[calc(100vh-5rem)] overflow-hidden">
        <h1 className="text-2xl font-bold mb-4">Project Planner</h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Project Title"
            className="border p-2 rounded w-1/3"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description (optional)"
            className="border p-2 rounded w-1/2"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-1"
          >
            <FiPlus /> Create
          </button>
        </div>

        <div className="overflow-y-auto pr-2">
          <div className="grid grid-cols-3 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-white p-4 rounded shadow-md">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">{project.title}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenProject(project.id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FiPlay />
                    </button>
                    <button
                      onClick={() => handleEditOpen(project)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {project.description || "No description."}
                </p>
              </div>
            ))}
          </div>
        </div>

        {editProject && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-md w-1/3">
              <h3 className="text-xl font-bold mb-4">Edit Project</h3>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="border p-2 rounded w-full mb-2"
                placeholder="Title"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="border p-2 rounded w-full mb-4"
                rows={4}
                placeholder="Description"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditProject(null)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
