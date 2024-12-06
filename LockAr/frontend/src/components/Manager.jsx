import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Modal from "react-modal";
import { Modal, ModalFooter, ModalHeader, ModalBody } from "reactstrap";
import { encryptPassword, decryptPassword } from "../utils/encryptionUtils"; // Assuming these functions are implemented as shown earlier
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { Navigate, useNavigate } from "react-router-dom";

// Modal.setAppElement("#root");
const INIT_STATE = {
  site: "",
  username: "",
  password: "",
};

const Manager = (props) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;

  const toggleLogin = props.toggleLogin;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const passwordRef = useRef(INIT_STATE);
  const [form, setForm] = useState("");
  const [refresh, setrefresh] = useState(0);
  const [masterPassword, setMasterPassword] = useState(""); // Stores entered master password
  const [passwordArray, setPasswordArray] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [actionType, setActionType] = useState(""); // To track the current action
  const [currentEntry, setCurrentEntry] = useState(null); // Stores current password entry for decryption

  useEffect(() => {
    const response = async () => {
      try {
        console.log(token)
        const data = await fetch("http://localhost:3000/api/auth/status", {
          method: "GET",
          headers: { "Content-Type": "application/json", token: token },
        });
        const res = data.json();
        if (res.isLoggedIn == false) {
          navigate("/login");
        }
      } catch {
        console.log("error while getting status in manager ");
        navigate("/login");
      }
    };
    response();
  });

  useEffect(() => {
    // Fetch stored passwords when component mounts
    const fetchPasswords = async () => {
      try {
        const username = localStorage.getItem("username");
        console.log("username", username);
        if (username == null) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `http://localhost:3000/api/passwords/user/${username.toString()}`,
          {
            headers: { "Content-Type": "application/json", token: token },
          }
        );
        const encryptedData = await response.json();
        // console.log(encryptedData, "see this")
        setPasswordArray(encryptedData);
      } catch (error) {
        console.error("Error fetching passwords", error);
      }
    };
    fetchPasswords();
  }, [refresh]);

  useEffect(() => {
    toggleLogin(true);
  });

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
      const userId = localStorage.getItem("username");
      const newEntry = {
        site: form.site,
        username: form.username,
        encryptedPassword,
        iv,
        salt,
        userId,
      };

      const token = localStorage.getItem("token");
      fetch("http://localhost:3000/api/passwords/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", token: token },
        body: JSON.stringify(newEntry),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status == 401) {
            navigate("/login");
            return;
          }
        })
        .then((data) => {
          toast.success("Password saved successfully!");
          setPasswordArray((prevArray) => [...prevArray, data]);
          setrefresh(!refresh);
          setForm(INIT_STATE);
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Failed to save password.");
        });
    } else {
      toast.error("Please fill out all fields!");
    }
  };

  const deleteEntry = async (id) => {
    try {
  
      const response = await fetch(
        `http://localhost:3000/api/passwords/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log(result.message); // Success message from the backend
        setrefresh(!refresh);
        toast.success(result.message);
        // Update state to remove the deleted entry
        setPasswordArray((prevArray) =>
          prevArray.filter((item) => item.id !== id)
        );
      } else {
        const error = await response.json();
        console.error("Error deleting password:", error.message);
        toast.error(error.message || "Failed to delete password.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while deleting the password.");
    }
  };

  const viewRealPswrd = (item) => {
    setCurrentEntry(item);
    setIsModalOpen(true);
    setActionType("view");
    console.log(item, "sikik");
  };
  // Handle Modal Submission
  const handleMasterPasswordSubmit = () => {
    if (actionType === "save") {
      savePassword();
    } else if (actionType === "view" && currentEntry) {
      const decryptedPassword = decryptPasswordForEntry(currentEntry);

      if (decryptedPassword) {
        setPasswordArray((prevArray) =>
          prevArray.map(
            (item) =>
              item._id === currentEntry._id // Match the ID of the current entry
                ? { ...item, decryptedPassword } // Update decryptedPassword for this entry
                : { ...item, decryptedPassword: null } // Reset decryptedPassword for others
          )
        );
      }
    }
    closeMasterPasswordModal();

    // Use a timeout to check the updated state after React processes the state change
    setTimeout(() => {
      console.log("Updated passwordArray:", passwordArray);
    }, 0);
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
    } catch {
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
        size="md"
        toggle={closeMasterPasswordModal}
        className="modal"
        centered
      >
        <ModalHeader>
          <h2 className="text-lg font-bold">Enter Master Password</h2>
        </ModalHeader>
        <ModalBody>
          <input
            value={masterPassword}
            onChange={(e) => {
              setMasterPassword(e.target.value);
            }}
            placeholder="Master Password"
            type="password"
            className="p-2 border border-gray-400 rounded w-100"
          />
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={() => {

                if (masterPassword.length < 8) {
                  alert("Password length should be atleast 8");
                  return;
                }
                if (!regex.test(masterPassword)) {
                  alert("Password must contain both alphabets and numbers");
                  return;
                }
                handleMasterPasswordSubmit();
              }}
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
        </ModalBody>
      </Modal>

      <div className="p-4">
        <div>
          <h2 className="text-2xl font-bold">Save a New Password</h2>
          <div className="flex flex-col gap-4 mt-4">
            <input
              value={form?.site}
              onChange={(e) => setForm({ ...form, site: e.target.value })}
              placeholder="Enter website URL"
              className="p-2 border border-gray-400 rounded"
            />
            <input
              value={form?.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Enter Username"
              className="p-2 border border-gray-400 rounded"
            />
            <input
              ref={passwordRef}
              value={form?.password}
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
              {/* {console.log(passwordArray, "lklklk")} */}
              {passwordArray?.map((item, index) => (
                <tr key={index} className="bg-white">
                  <td className="px-4 py-2">{item?.site}</td>
                  <td className="px-4 py-2">{item?.username}</td>
                  <td className="px-4 py-2">
                    {item?.decryptedPassword || (
                      <button
                        onClick={() => viewRealPswrd(item)}
                        className="text-blue-500 underline"
                      >
                        {item?.encryptedPassword}
                      </button>
                    )}
                  </td>

                  <td className="px-4 py-2">
                    <button
                      onClick={() => deleteEntry(item._id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
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
