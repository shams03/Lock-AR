import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import {
  encryptPassword,
  decryptPassword,
} from "../utils/encryptionUtils"; // Assuming these functions are implemented as shown earlier
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";

Modal.setAppElement("#root");

const Manager = () => {
  const passwordRef = useRef();
  const [form, setForm] = useState({
    site: "",
    username: "",
    password: "",
  });
  const [masterPassword, setMasterPassword] = useState(""); // Stores entered master password
  const [passwordArray, setPasswordArray] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [actionType, setActionType] = useState(""); // To track the current action
  const [currentEntry, setCurrentEntry] = useState(null); // Stores current password entry for decryption

  useEffect(() => {
    // Fetch stored passwords when component mounts
    const fetchPasswords = async () => {
      try {
        const username = localStorage.getItem('username');
        const response = await fetch(`http://localhost:3000/api/passwords/user/${username}`);
        const encryptedData = await response.json();
        console.log(encryptedData, "see this")
        setPasswordArray(encryptedData);
      } catch (error) {
        console.error("Error fetching passwords", error);
      }
    };
    fetchPasswords();
  }, []);

  // Open Modal to Request Master Password
  const openMasterPasswordModal = (type, entry = null) => {
    setActionType(type); // Set action type (save or view)
    setCurrentEntry(entry); // Store entry if viewing
    setIsModalOpen(true);
  };

  // Close Modal
  const closeMasterPasswordModal = () => {
    setIsModalOpen(false);
    setMasterPassword("");
  };

  // Save Password
  const savePassword = () => {
    if (form.site && form.username && form.password) {
      const { encryptedPassword, iv, salt } = encryptPassword(
        form.password,
        masterPassword
      );

      const newEntry = {
        site: form.site,
        username: form.username,
        encryptedPassword,
        iv,
        salt,
      };

      fetch("http://localhost:3000/api/passwords/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      })
        .then((response) => response.json())
        .then((data) => {
          setPasswordArray((prevArray) => [...prevArray, data]);
          toast.success("Password saved successfully!");
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Failed to save password.");
        });
    } else {
      toast.error("Please fill out all fields!");
    }
  };

 // Handle Modal Submission
const handleMasterPasswordSubmit = () => {
  if (actionType === "save") {
    savePassword();
  } else if (actionType === "view" && currentEntry) {
    const decryptedPassword = decryptPasswordForEntry(currentEntry);
    console.log(currentEntry,"kya hai",passwordArray)
    if (decryptedPassword) {
      setPasswordArray((prevArray) =>
        prevArray.map((item) =>
          item.id === currentEntry.id // Match the ID
            ? { ...item, decryptedPassword } // Update only the specific entry
            : { ...item, decryptedPassword: null }
        )
      );
    }
  }
  closeMasterPasswordModal();
};

// Decrypt Password
const decryptPasswordForEntry = (entry) => {
  if (!masterPassword) return null; // Ensure master password is entered
  try {
    const decryptedPassword = decryptPassword(
      entry.encryptedPassword,
      masterPassword,
      entry.iv,
      entry.salt
    );
    return decryptedPassword;
  } catch (error) {
    toast.error("Incorrect Master Password!");
    return null; // Return null if decryption fails
  }
};

  return (
    <>
      <ToastContainer autoClose={5000} />
      {/* Modal for Master Password */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeMasterPasswordModal}
        className="modal"
        overlayClassName="overlay"
      >
        <h2 className="text-lg font-bold">Enter Master Password</h2>
        <input
          value={masterPassword}
          onChange={(e) => setMasterPassword(e.target.value)}
          placeholder="Master Password"
          type="password"
          className="p-2 border border-gray-400 rounded"
        />
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={handleMasterPasswordSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Submit
          </button>
          <button
            onClick={closeMasterPasswordModal}
            className="px-4 py-2 bg-gray-300 text-black rounded"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <div className="p-4">
        <div>
          <h2 className="text-2xl font-bold">Save a New Password</h2>
          <div className="flex flex-col gap-4 mt-4">
            <input
              value={form.site}
              onChange={(e) => setForm({ ...form, site: e.target.value })}
              placeholder="Enter website URL"
              className="p-2 border border-gray-400 rounded"
            />
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Enter Username"
              className="p-2 border border-gray-400 rounded"
            />
            <input
              ref={passwordRef}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter Password"
              className="p-2 border border-gray-400 rounded"
              type="password"
            />
            <button
              onClick={() => openMasterPasswordModal("save")}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Save Password
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold">Stored Passwords</h2>
          <table className="table-auto w-full mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Site</th>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Password</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {passwordArray.map((item) => (
                <tr key={item.id} className="bg-white">
                  <td className="px-4 py-2">{item.site}</td>
                  <td className="px-4 py-2">{item.username}</td>
                  <td className="px-4 py-2">
                    {item.decryptedPassword || (
                      <button
                        onClick={() => openMasterPasswordModal("view", item)}
                        className="text-blue-500 underline"
                      >
                        View Password
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <button className="text-red-500">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </>
  );
};

export default Manager;
