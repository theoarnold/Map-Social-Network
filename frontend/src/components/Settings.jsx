import { HiX } from 'react-icons/hi';
import axios from "axios";
import { useRef, useState } from "react";
import "./settings.css";

export default function Settings({ setShowSettings }) {

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const profileRef = useRef();
  const myStorage = window.localStorage;
  const  [name, setName] = useState(() => myStorage.getItem("user"));
  const  [profile, setProfile] = useState(() => myStorage.getItem("profile"));
  const handleSubmit = async (e) => {
    e.preventDefault();
    const update = {
      profile: profileRef.current.value, }
    try {
      await axios.post(`http://localhost:3000/users/update/${name}`, update);
      setError(false);
      setSuccess(true);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="settingsContainer">
      <h1>{name}'s Settings</h1>
      <HiX className="settingsCancel" onClick={() => setShowSettings(false)}/>
      <form onSubmit={handleSubmit}>
      <textarea ref={profileRef} type="textarea"  placeholder="Choose your Bio!"/>
        <button id="settingsBtn" type="submit">
          Save
        </button>
        {success && (
          <span className="success">Your bio has been changed.</span>
        )}
        {error && <span className="failure">Something went wrong!</span>}
      </form>

      </div>

  );
}
