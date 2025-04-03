// src/utils/firestoreHelpers.ts
import { db } from "../firebase";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export const getUserData = async (uid: string) => {
  const docRef = doc(db, "users", uid);
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data() : null;
};

export const updateUserSettings = async (uid: string, newSettings: object) => {
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, {
    settings: newSettings,
  });
};

export const getRobots = async (uid: string) => {
  const robotsCol = collection(db, "users", uid, "robots");
  const snapshot = await getDocs(robotsCol);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addRobot = async (uid: string, robot: object) => {
  const robotsCol = collection(db, "users", uid, "robots");
  await addDoc(robotsCol, robot);
};

export const updateRobot = async (
  uid: string,
  robotId: string,
  data: object
) => {
  const robotRef = doc(db, "users", uid, "robots", robotId);
  await updateDoc(robotRef, data);
};

export const deleteRobot = async (uid: string, robotId: string) => {
  const robotRef = doc(db, "users", uid, "robots", robotId);
  await deleteDoc(robotRef);
};
