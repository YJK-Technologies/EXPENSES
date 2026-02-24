import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const config = require('./ApiConfig');

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      // Check if the OTP is valid before adding the user to the database
      const otpResponse = await fetch(`${config.apiBaseUrl}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      if (otpResponse.status === 200) {
        // OTP verification successful, add user to the database
        const response = await fetch(`${config.apiBaseUrl}/add-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
          }),
        });

        if (response.status === 200) {
          alert("User added successfully!");
          navigate("/Navbar");
        } else {
          console.error("Failed to add user to the database");
          alert("Failed to add user to the database");
        }
      } else {
        console.error("OTP verification failed");
        alert("OTP verification failed");
      }
    } catch (error) {
      console.error("Error during user registration:", error);
    }
  };

  return (
    <div>
      <h2>New User Registration</h2>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <br />
      <label>
        OTP:
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleSignup}>Register</button>
    </div>
  );
}

export default Signup;
