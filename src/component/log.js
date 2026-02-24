import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js'; 
import { useNavigate } from 'react-router-dom';
import './log.css';

const config = require('../ApiConfig');

const LoginForm=()=>{
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
          navigate('/Expenses');
     
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

return(

<section>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<form className="signin" onSubmit={handleLogin}>
   


      <div className="content">
        <h2>Sign In</h2>
        
        <div className="form">
          <div className="inputBox">
          <input
                    type="text"
                    placeholder="User Code"
                    id="log-username"
                    autoComplete='off'
                    value={user_code}
                    onChange={(e) => setuser_code(e.target.value)}
                  />
          </div>
          <div class="inputBox">
          <input
                    placeholder="Password"
                    id="log-password"
                    autoComplete='off'
                    type={showPassword ? "text" : "password"}
                    value={user_password}
                    onChange={(e) => setuser_password(e.target.value)}
                  />
          </div>
          <div className="links">
            <a href="#">Forgot Password</a>
            {/* <a href="#">Signup</a> */}
          </div>
          <div className="inputBox">
          <input type="submit" value="Login" className="Submitbtn" />
          </div>
        </div>
      </div>
    
    </form> 
    </section>
  
);
}
export default LoginForm;