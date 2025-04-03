import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [userType, setUserType] = useState("individual");
  const [isStudent, setIsStudent] = useState("no");
  const [studentOf, setStudentOf] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const capitalize = (s: string) =>
    s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userData: any = {
        email: user.email,
        createdAt: serverTimestamp(),
        role: "user",
        settings: {
          notificationsEnabled: true,
        },
        profile: {
          firstName: capitalize(firstName),
          lastName: capitalize(lastName),
          dob,
          userType,
        },
      };

      if (userType === "individual") {
        userData.profile.isStudent = isStudent;
        if (isStudent === "yes") userData.profile.studentOf = studentOf;
      } else if (userType === "organization") {
        userData.profile.organizationName = organizationName;
      }

      await setDoc(doc(db, "users", user.uid), userData);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSignup();
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-md text-center">
        <img
          src="/robodyne-logo.png"
          alt="Robodyne Logo"
          className="w-28 mx-auto mb-4"
        />
        <h2 className="text-xl font-bold mb-4">Sign Up for Robodyne</h2>

        <div className="grid grid-cols-1 gap-2">
          <input
            type="text"
            placeholder="First Name"
            className="w-full p-2 border rounded"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="w-full p-2 border rounded"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <input
            type="date"
            placeholder="Date of Birth"
            className="w-full p-2 border rounded"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <select
            className="w-full p-2 border rounded"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            disabled={loading}
          >
            <option value="individual">Individual</option>
            <option value="organization">Organization</option>
          </select>

          {userType === "individual" && (
            <>
              <label className="text-sm text-left">Are you a student?</label>
              <select
                className="w-full p-2 border rounded"
                value={isStudent}
                onChange={(e) => setIsStudent(e.target.value)}
                disabled={loading}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
              {isStudent === "yes" && (
                <input
                  type="text"
                  placeholder="Student of (e.g. University)"
                  className="w-full p-2 border rounded"
                  value={studentOf}
                  onChange={(e) => setStudentOf(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                />
              )}
            </>
          )}

          {userType === "organization" && (
            <input
              type="text"
              placeholder="Organization Name"
              className="w-full p-2 border rounded"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          onClick={handleSignup}
          disabled={loading}
          className={`w-full mt-4 py-2 rounded text-white ${
            loading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? (
            <span className="flex justify-center items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating Account...
            </span>
          ) : (
            "Sign Up"
          )}
        </button>

        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
