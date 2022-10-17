import { HiX } from 'react-icons/hi';
import axios from "axios";
import { useRef, useState } from "react";
import "./register.css";

export default function Register({ setShowRegister }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const userRef = useRef();
  const passRef = useRef();
  const emailRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const createuser = {
      username: userRef.current.value,
      email: emailRef.current.value,
      password: passRef.current.value,
    };

    try {
      await axios.post("/users/reg", createuser);
      setError(false);
      setSuccess(true);
    } catch (err) {
      setError(true);
    }
  };
  return (
    <div className="registerdiv">
      <div className="logo">
        <h3>Register</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <input autoFocus placeholder="username" ref={userRef} />
        <input type="email" placeholder="email" ref={emailRef} />
        <input
          type="password"
          min="6"
          placeholder="password"
          ref={passRef}
        />
        <button className="registerconfirm" type="submit">
          Register
        </button>
        {success && (
          <span className="success">Successfull. You can login now!</span>
        )}
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <HiX className="regExit" onClick={() => setShowRegister(false)}/>
    </div>
  );
}
