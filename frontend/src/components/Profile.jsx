
import axios from "axios";
import { useRef, useState } from "react";
import "./profile.css";
import { HiX } from 'react-icons/hi';

export default function Profile({ setShowProfile }) {

  const inputRef = useRef(null);
   
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert(inputRef.current.value);
    };

  return (
    <div className="profileContainer">
      <h1>Profile</h1>
  
      <HiX
        className="profileCancel"
        onClick={() => setShowProfile(false)}
      />

      </div>

  );
}
