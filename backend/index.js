const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/users");
const pinRoute = require("./routes/pins");
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);
const cors = require("cors");
app.use(cors());

const io = new Server(server, {
  cors:{
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


var i = 0;

dotenv.config();
// maybe change this:
app.use(express.json());
mongoose 
 .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,   })   
 .then(() => console.log("MongoDB connected!"))
 .catch(err => console.log(err));

app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);



app.listen(8800, () => {
  console.log("Express is working!");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  i = i + 1;
  console.log(i);
  socket.on("disconnect", () => {
    console.log("user disconnected");
    i = i - 1;
    console.log(i);
  });
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    console.log("message:" + msg);
  });
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message" , msg);
  });
});

server.listen(5000, () => {
  console.log("listening on *:5000");
});