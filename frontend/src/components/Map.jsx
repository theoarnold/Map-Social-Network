import "./map.css";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { useEffect, useState, useRef } from "react";
import { FaFileUpload, FaMapMarker } from 'react-icons/fa';
import axios from "axios";
import Register from "./Register";
import Login from "./Login";
import Settings from "./Settings";
import Profile from "./Profile";
import Chat from "./Chat";
import AWS from 'aws-sdk'
import { format } from "timeago.js";
import SimpleReactLightbox from 'simple-react-lightbox'
import { SRLWrapper } from "simple-react-lightbox";
import { useInView } from "react-intersection-observer";
import { v4 as uuidv4 } from 'uuid';


function App() {
//remember cors or whatever for the chat

  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [picture, setPicture] = useState(null);
  const [newXY, setNewXY] = useState(null);
  const [title, setTitle] = useState(null);
  const [open, setOpen] = useState(false);
  const [desc, setDesc] = useState(null);
  const [image, setImage] = useState(null);
  const [progress , setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  let awsUrl = "https://cardograffy.s3.eu-west-2.amazonaws.com/"
  let fileURL = null;
  var clicked = false;
  const [map, setMap] = useState({
    zoom: 13.5,
    latitude: 51.488037637494216,
    longitude: -3.1797887503010145,

  });
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [onHover, setOnHover] = useState(false);
  const [onClick, setOnClick] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [fileup, setFileup] = useState(false);
  const S3_BUCKET ='cardograffy';
  const REGION ='eu-west-2';


  const click = (e) => {
    const [longitude, latitude] = e.lngLat;
    setNewXY({
      lat: latitude,
      long: longitude,
    });
  };

  const markHover = (id) => {
    setOnClick(false);
    setOnHover(true);
    setCurrentPlaceId(id);
  };

  const markClick = (id, lat, long) => {
    setOnClick(true);
    setCurrentPlaceId(id);
    setMap({ ...map, latitude: lat, longitude: long });
    clicked = true;
  };
  const closed = () => {
    setCurrentPlaceId(null);
    setOnClick(false);
  };

  const markLeave = (id) => {
    if (onClick == false){
    setOnHover(false);
    setCurrentPlaceId(null);
    }
  };
 
  
  const [vis, inView] = useInView({
    rootMargin: '0px 0px',
  })
  AWS.config.update({
    accessKeyId: '',
    secretAccessKey: ''
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
})

const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
    setPicture(URL.createObjectURL(e.target.files[0]) );
    setFileup(true);
}


const uploadFile = (file) => {
  fileURL = (uuidv4().concat(file.name));
  setImage(awsUrl.concat(fileURL));
  if (fileup == true){
    console.log(fileURL);
    const params = {
        ACL: 'public-read',
        Body: file,
        Bucket: S3_BUCKET,
        Key: fileURL,
    };

    
    myBucket.putObject(params)
        .on('httpUploadProgress', (evt) => {
            setProgress(Math.round((evt.loaded / evt.total) * 100))
        })
        .send((err) => {
            if (err) console.log(err)
        })
        setPicture(null);
      }
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      image,
      lat: newXY.lat,
      long: newXY.long,
    };

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewXY(null);
    } catch (err) {
      console.log(err);
    }



  };

  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("/pins");
        setPins(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);



  const handleLogout = () => {
    setCurrentUsername(null);
    myStorage.removeItem("user");
  };






  return (
    <SimpleReactLightbox>
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactMapGL
        {...map}
        mapboxApiAccessToken=""
        width="100%"
        height="100%"
        transitionDuration="20"
        mapStyle="mapbox://styles/the0o/cl57u4uik002214nue0ufo7k5"
        onViewportChange={(map) => setMap(map)}
        onDblClick={currentUsername && click}
      >
        {pins.map((mark) => (
          <>
            <Marker
              latitude={mark.lat}
              longitude={mark.long}
              offsetLeft={-2 * map.zoom}
              offsetTop={-3 * map.zoom}
            >
              <FaMapMarker
                style={{
                  fontSize: 3 * map.zoom,
                  cursor: "pointer",
                  color:"#f54248",
                  scale: 0.2,
                }}
                onClick={() => markClick(mark._id, mark.lat, mark.long)}
                onMouseEnter={() => markHover(mark._id, mark.lat, mark.long)}
                onMouseLeave={() => markLeave(mark.id)}
              />
              
            </Marker>
            {mark._id === currentPlaceId && (
              <Popup
                closeButton={true}  // change this 
                closeOnClick={false}
                onClose={() => closed()}
                anchor="left"
                key={mark._id}
                latitude={mark.lat}
                longitude={mark.long}
              >
                <div className="post">
                  <p className="title">{mark.title}</p>
                  <div id="namepost">
                  <span className="username">
                    Posted by <u><href onClick={() => setShowProfile(true)}><b>{mark.username}</b></href></u>
                  </span>
                  <p className="date">{format(mark.createdAt)}</p>
                  </div>
                  <p id="desc">{mark.desc}</p>
                  <SRLWrapper>
                  <img id="image" onError={(event) => event.target.style.display = 'none'} src={mark.image} />
                  <object id="video"  onError={(event) => event.target.style.display = 'none'} data={mark.image} ></object> 
                  </SRLWrapper>
                  </div>
              </Popup>
            )}
          </>
        ))}
        
        {newXY && (
          <>
            <Marker
              latitude={newXY.lat}
              longitude={newXY.long}
              offsetLeft={-3 * map.zoom}
              offsetTop={-5 * map.zoom}
            >
              <FaMapMarker
                style={{
                  color: "#f54248",
                  fontSize: 5 * map.zoom,
                  cursor: "pointer",
                  
                }}
              />
            </Marker>
            <Popup
              closeButton={true}
              closeOnClick={false}
              onClose={() => setNewXY(null)}
              latitude={newXY.lat}
              longitude={newXY.long}
              anchor="left"
            >
              <div>
                <form onSubmit={handleSubmit}>
                  <input id="title"
                    placeholder="Enter a title"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <textarea
                    placeholder="Say something about this place."
                    onChange={(e) => setDesc(e.target.value)} />
                  <div className="dropZoneContainer">
                  <input className="upload" type="file" onChange={handleFileInput} accept="image/gif, image/jpeg, image/png, video/mp4, video/avi, video/webm, " />
                  <div className="dropZoneOverlay">Drag and drop your image <br />or<br />Click to add</div>
                  </div>
                  <div className="preview" >
                  <img className="previewpic"  src={picture && picture}></img>
                  </div>

                  <button onClick={() => uploadFile(selectedFile)}  type="submit" className="submitButton">
                    Add Pin
                  </button>
                </form>
              </div>
            </Popup>
          </>
        )}

{currentUsername ? (
          <div className="buttons">
          <button className="button settings" onClick={() => setShowSettings(true)}>Settings</button>
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
          <hr></hr>
          <p id="name">Hello,  {currentUsername}! </p>
          </div>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Log in
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showSettings && <Settings setShowSettings={setShowSettings} />}
        {showProfile && <Profile setShowProfile={setShowProfile} />}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            setCurrentUsername={setCurrentUsername}
            myStorage={myStorage}
          />
        )}


      </ReactMapGL>
      <Chat />
 





</div>
</SimpleReactLightbox>

  );
}

export default App;
