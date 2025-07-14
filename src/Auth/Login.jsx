import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; // your config
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // 🔐 EMAIL LOGIN
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      const q = query(collection(db, 'Users'), where('email', '==', user.email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        await signOut(auth);
        toast.error("User not found");
      } else {
        const userData = snapshot.docs[0].data();
        localStorage.setItem('userData', JSON.stringify(userData));
        toast.success("Login Successfull")
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      toast.error("Invalid Email / Password");
    }
  };

  // 🔐 GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const q = query(collection(db, 'Users'), where('email', '==', user.email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        await signOut(auth);
        toast.error("Google account not registered. Access Denied.");

      } else {
        const userData = snapshot.docs[0].data();
        localStorage.setItem('userData', JSON.stringify(userData));
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleEmailLogin}>
          <input
            type="email"
            required
            className='dropdown'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            required
            className='dropdown'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit" className='withdraw-btn '>Login</button>
        </form>

        <div style={{ margin: '15px 0', textAlign: 'center' }}>
          <span>or</span>
        </div>

        <button onClick={handleGoogleLogin} className="google-btn">
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            style={{ width: 20, marginRight: 8 }}
          />
          Sign in with Google
        </button>

        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      </div>
    </>
  );
};

export default Login;
