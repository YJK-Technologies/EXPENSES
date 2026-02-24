/*import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css"

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5500/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setOtpSent(true);
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5500/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, enteredOtp }),
      });

      if (response.ok) {
        
        console.log('OTP verified successfully');
       
        navigate('/Navbar');
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {otpSent ? (
        <div>
          <p>An OTP has been sent to your email.</p>
          <form onSubmit={handleOtpSubmit}>
            <label>
              Enter OTP:
              <input type="text" value={enteredOtp} onChange={(e) => setEnteredOtp(e.target.value)} required />
            </label>
            <button type="submit">Verify OTP</button>
          </form>
        </div>
      ) : (
        <form onSubmit={handleEmailSubmit}>
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <button type="submit">Send OTP</button>
        </form>
      )}
    </div>
  );
};

export default Login;
*/
// Login.js




import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js'; 
import login from './login.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const config = require('./ApiConfig');


const Login = () => {
  const navigate = useNavigate();
  const [user_email, setuser_email] = useState('');
  const [user_code, setuser_code] = useState('');
  const [user_password, setuser_password] = useState('');
  const [user_code_signup, setuser_code_signup] = useState('');
  const [user_password_signup, setuser_password_signup] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [open, setOpen] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [showCapsLockWarning, setShowCapsLockWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [screenType,setScreenType] = useState(null)


  const secretKey = 'yjk26012024';

  useEffect(() => {
    const handleCapsLock = (e) => {
      if (e instanceof KeyboardEvent && e.getModifierState('CapsLock')) {
        setIsCapsLockOn(true);
        setShowCapsLockWarning(true);
        setTimeout(() => setShowCapsLockWarning(false), 2000); 
      } else {
        setIsCapsLockOn(false);
        setShowCapsLockWarning(false);
      }
    };

    window.addEventListener('keydown', handleCapsLock);
    window.addEventListener('keyup', handleCapsLock);

    return () => {
      window.removeEventListener('keydown', handleCapsLock);
      window.removeEventListener('keyup', handleCapsLock);
    };
  }, []);


  const arrayBufferToBase64 = (arrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(arrayBuffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsPageLoading(true);

    try {
      // Encrypt user_code and user_password
      const encryptedUserCode = CryptoJS.AES.encrypt(user_code, secretKey).toString();
      const encryptedPassword = CryptoJS.AES.encrypt(user_password, secretKey).toString();

      console.log("encryptedUserCode",encryptedUserCode)
      console.log("encryptedPassword",encryptedPassword)

      const response = await fetch(`${config.apiBaseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          user_code: encryptedUserCode, 
          user_password: encryptedPassword 
        }),
      });

      if (response.ok) {
        sessionStorage.setItem('isLoggedIn', true);
        navigate('/Navbar');
   
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
        setLoginError(errorData.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
      setLoginError('Internal server error occurred!');
    } finally {
      setIsPageLoading(false);
    }
  };





 

 
  
  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsSignUp(false); // Switch back to sign-in form
    setuser_email('');
    setuser_code_signup('');
    setuser_password_signup('');
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
    {isPageLoading && <LoadingScreen />}
      <div className="container2">
        <div className="forms-container">
          <div className="signin-signup">
            {isSignUp ? (
              <form className="sign-up-form" onSubmit={handleSignUp}>
                <h2 className="title">Sign up</h2>
                <div className="input-field">
                  <i><FontAwesomeIcon icon={faUser} /></i>
                  <input
                    type="text"
                    placeholder="Email"
                    id="sign-up-email"
                    autoComplete='off'
                    value={user_email}
                    onChange={(e) => setuser_email(e.target.value)}
            
                  />
                </div>
                <div className="input-field">
                  <i><FontAwesomeIcon icon={faUser} /></i>
                  <input
                    type="text"
                    placeholder="User Code"
                    id="sign-up-usercode"
                    autoComplete='off'
                    value={user_code_signup}
                    onChange={(e) => setuser_code_signup(e.target.value)}
                  
                  />
                </div>
                <div className="input-field">
                  <i><FontAwesomeIcon icon={faLock} /></i>
                  <input
                    placeholder="Password"
                    id="sign-up-password"
                    autoComplete='off'
                    type={showPassword ? "text" : "password"}
                    value={user_password_signup}
                    onChange={(e) => setuser_password_signup(e.target.value)}
                    
                  />
                  <span className="eye" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                  </span>
                </div>
                {showCapsLockWarning && isCapsLockOn && (<div style={{ color: 'red', padding: '5px' }}>Caps Lock is on </div>)}
                <input type="submit" value="Register" className="Submitbtn" />
              </form>
            ) : (
              <form className="sign-in-form" onSubmit={handleLogin}>
                <h2 className="title">Sign in</h2>
                {loginError && (
                  <div style={{ color: 'red', padding: '5px' }}>
                    {loginError}
                  </div>
                )}
                <div className="input-field">
                  <i><FontAwesomeIcon icon={faUser} /></i>
                  <input
                    type="text"
                    placeholder="User Code"
                    id="log-username"
                    autoComplete='off'
                    value={user_code}
                    onChange={(e) => setuser_code(e.target.value)}
                  />
                </div>
                <div className="input-field">
                  <i><FontAwesomeIcon icon={faLock} /></i>
                  <input
                    placeholder="Password"
                    id="log-password"
                    autoComplete='off'
                    type={showPassword ? "text" : "password"}
                    value={user_password}
                    onChange={(e) => setuser_password(e.target.value)}
                  />
                  <span className="eye" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                  </span>
                </div>
                {showCapsLockWarning && isCapsLockOn && (<div style={{ color: 'red', padding: '5px' }}>Caps Lock is on </div>)}
                <div className='fp'>
                  <div className="mt-3 mb-3">
                    {!isSignUp && <a onClick={handleClick} style={{ cursor: "pointer", fontStyle: "normal" }} className="forgot-password">Forgot Password</a>}
                  </div>
                </div>
                <input type="submit" value="Login" className="Submitbtn" />
              </form>
            )}
          </div>
        </div>
        <div className="panels-container">
          <div className="panel left-panel">
            
            <img src={login} className="image" alt="" />
          </div>
          
        </div>
      </div>
    </>
  );
};

const LoadingScreen = () => (
  <div className="loading-screen">
    <FontAwesomeIcon icon={faSpinner} spin size="3x" />
  </div>
);

export default Login;
