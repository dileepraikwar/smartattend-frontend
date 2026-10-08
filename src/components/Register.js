import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Webcam from "react-webcam";
import api from "../api";

function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "EMPLOYEE" });
  const [otp, setOtp] = useState("");
  const [newUserId, setNewUserId] = useState(null);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await api.post("/auth/register/request-otp", form);
      setStep(2);
      setSuccess("OTP bhej diya gaya hai " + form.email + " par.");
    } catch (err) {
      setError("Kuch galat hua, dobara try karo.");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register/verify-otp", { email: form.email, otp });
      setNewUserId(res.data.id);
      setStep(3);
      setSuccess("Account ban gaya! Ab apna face enroll karo.");
    } catch (err) {
      setError("Invalid ya expired OTP.");
    }
    setLoading(false);
  };

  const capturePhoto = () => {
    const image = webcamRef.current.getScreenshot();
    if (image) {
      setCapturedPhotos((prev) => [...prev, image]);
    }
  };

  const handleEnrollFace = async () => {
    setError("");
    setLoading(true);
    try {
      await api.post("/users/enroll-face", { userId: newUserId, imagesBase64: capturedPhotos });
      setSuccess("Face enroll ho gaya! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError("Face enroll fail hua, dobara try karo.");
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h2>SmartAttend Register</h2>

      {step === 1 && (
        <form onSubmit={handleSendOtp}>
          <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <select
            name="role" value={form.role} onChange={handleChange}
            style={{ width: "100%", padding: "10px", margin: "8px 0", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }}
          >
            <option value="EMPLOYEE">Employee</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit" disabled={loading}>{loading ? "Sending..." : "Send OTP"}</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp}>
          <p>Email par bheja gaya 6-digit OTP daalo:</p>
          <input
            type="text" placeholder="Enter OTP" value={otp}
            onChange={(e) => setOtp(e.target.value)} required maxLength={6}
          />
          <button type="submit" disabled={loading}>{loading ? "Verifying..." : "Verify & Continue"}</button>
        </form>
      )}

      {step === 3 && (
        <div>
          <p>Apna face 3-5 baar thoda-thoda angle badal kar capture karo:</p>
          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" width={280} videoConstraints={{ facingMode: "user" }} />
          <div style={{ margin: "8px 0" }}>
            <button type="button" onClick={capturePhoto} disabled={loading}>
              Capture Photo ({capturedPhotos.length})
            </button>
          </div>
          <button
            type="button"
            onClick={handleEnrollFace}
            disabled={loading || capturedPhotos.length === 0}
          >
            {loading ? "Enrolling..." : "Finish Registration"}
          </button>
        </div>
      )}

      {error && <p className="error">{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      {step === 1 && (
        <p style={{ marginTop: "12px" }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      )}
    </div>
  );
}

export default Register;