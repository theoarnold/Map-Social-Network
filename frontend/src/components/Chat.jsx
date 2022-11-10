import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";
const socket = io.connect("http://localhost:5000");

export default function Chat() {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
  const [ items, setItems ] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let welcome = "Welcome to Cardograffy! 🥳   This is the chat box, you can use it to talk with other Cardiff students! 👨‍🎓"
    setItems([...items, welcome]);
  }, []);
  
  const inp = useRef(null);
  
  
  useEffect(() => {
  
    const keyDownHandler = event => {
      console.log('User pressed: ', event.key);
      
      if (event.key === 'Enter') {
        const el = inp.current;
        if (el !== null && el.value === "")
        {
          event.preventDefault();
        }
        else{
          event.preventDefault();
          sendMsg();
        }
      }
    };
  
    document.addEventListener('keydown', keyDownHandler);
  
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, []);
  
  var Filter = require('bad-words'),
  filter = new Filter();
  
  const sendMsg = () => {
    let name = setCurrentUsername;
    name += ': ';
    let fil = filter.clean(inp.current.value);
    let result = name.concat(fil);
    socket.emit('chat message', result );
    document.getElementById('inp').value='';
  };
  
  
  // talk about how you had to add useeffect or it was laggy https://stackoverflow.com/questions/64645360/multiple-messages-makes-socket-io-app-slower
  useEffect(() => {
  socket.on('chat message', (msg) =>{
    setItems([...items, msg]);
  });
  return()=>{
    socket.off('chat message')
    }
  }, [items]);




  return (
    <div id="chat">
    <form id="chatinp"  >
    <ScrollToBottom className="mes">
    <ul id="chatlist">{items.map(item => <li>{item}</li>)}</ul>
      </ScrollToBottom>

      

      <input id="inp" ref={inp} autocomplete="off" placeholder="Say something!"/>
      </form>
      </div>
  );
}
