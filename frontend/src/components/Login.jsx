import { HiX } from 'react-icons/hi';
import axios from "axios";
import { useRef, useState } from "react";
import "./login.css";

export default function Login({ setShowLogin, setCurrentUsername,myStorage }) {
  const [error, setError] = useState(false);
  const userRef = useRef();
  const passRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: userRef.current.value,
      password: passRef.current.value,
    };
    try {
      const res = await axios.post("/users/login", user);
      setCurrentUsername(res.data.username);
      myStorage.setItem('user', res.data.username);
      myStorage.setItem('profile', res.data.profile);
      setShowLogin(false)
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="loginContainer">
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        <input autoFocus placeholder="username" ref={userRef} />
        <input
          type="password"
          min="6"
          placeholder="password"
          ref={passRef}
        />
        <button className="loginconfirm" type="submit">
          Login
        </button>
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <HiX className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
}
