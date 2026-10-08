import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import api from "../api";

function CheckIn() {
  const webcamRef = useRef(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId") || 1;

  const capture = () => webcamRef.current.getScreenshot();

  const handleCheckIn = async () => {
    setLoading(true);
    setMessage("");
    try {
      const image = capture();
      const res = await api.post("/attendance/checkin", { userId, imageBase64: image });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Check-in failed");
    }
    setLoading(false);
  };

  const handleCheckOut = async () => {
    setLoading(true);
    setMessage("");
    try {
      const image = capture();
      const res = await api.post("/attendance/checkout", { userId, imageBase64: image });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Check-out failed");
    }
    setLoading(false);
  };

  return (
    <div className="checkin-container">
      <h2>Mark Attendance</h2>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        videoConstraints={{ facingMode: "user" }}
      />
      <div>
        <button onClick={handleCheckIn} disabled={loading}>
          {loading ? "Processing..." : "Check In"}
        </button>
        <button onClick={handleCheckOut} disabled={loading}>
          {loading ? "Processing..." : "Check Out"}
        </button>
      </div>
      {loading && <p style={{ color: "#4f46e5" }}>Verifying face, please wait...</p>}
      {!loading && message && <p>{message}</p>}
    </div>
  );
}

export default CheckIn;