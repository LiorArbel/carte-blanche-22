import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Viewer from './routes/viewer';
import Controller from './routes/controller';

let exampleSocket;
const publicUrl = process.env.REACT_APP_PUBLIC_URL || "localhost:8081";
// const publicUrl = process.env.REACT_APP_PUBLIC_URL || "carte-blanche22-server.azurewebsites.net";
let aud = new Audio("/15step.mp3");
aud.preload = "auto";

function App() {
  const [recievedPlay, setRecievedPlay] = useState(false);
  useEffect(() => {
    exampleSocket = new WebSocket("ws://" + publicUrl,);
    exampleSocket.onopen = (e) => {
      console.log("connected successfully!!!");
    }
    exampleSocket.onmessage = (e) => {
      console.log(e);
      if (e.data === "play") {
        aud.play();
      } else if (e.data === "stop") {
        aud.pause();
        aud.currentTime = 0;
      }
      setRecievedPlay(e.data === "play");
      setTimeout(() => setRecievedPlay(false), 2000);
    }
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          server address is {publicUrl}.
        </p>
        {recievedPlay && <p>
          recieved a play request!
        </p>}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Viewer />} />
            <Route path="viewer" element={<Viewer />} />
            <Route path="controller" element={
              <Controller
                play={() => exampleSocket.send("play")}
                stop={() => exampleSocket.send("stop")}
              />
            } />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
