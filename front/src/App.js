import { useEffect, useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Viewer from './routes/viewer';
import Controller from './routes/controller';
import _ from 'lodash';

let exampleSocket;
const publicUrl = process.env.REACT_APP_PUBLIC_URL || "localhost:8081";
// const publicUrl = process.env.REACT_APP_PUBLIC_URL || "carte-blanche22-server.azurewebsites.net";
let aud = new Audio("/15step.mp3");
aud.preload = "auto";

function App() {
  const [recievedPlay, setRecievedPlay] = useState(false);
  const [color, setColor] = useState("#000000");

  const sendColor = (c) => {
    exampleSocket.send(JSON.stringify({ color: c }));
  }
  const optimisedSendColor = useMemo(() =>
    _.throttle(sendColor, 300),
    []
  );

  useEffect(() => {
    exampleSocket = new WebSocket("wss://" + publicUrl,);
    exampleSocket.onopen = (e) => {
      console.log("connected successfully!!!");
    }
    exampleSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data);
      if (data.music) {
        if (data.music === "play") {
          aud.play();
        } else if (data.music === "stop") {
          aud.pause();
          aud.currentTime = 0;
        }
        setRecievedPlay(data.music === "play");
        setTimeout(() => setRecievedPlay(false), 2000);
      }
      if (data.color) {
        setColor(data.color);
      }
    }
  }, [])
  return (
    <div className="App">
      <header style={{ backgroundColor: color }} className="App-header">
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
                play={() => exampleSocket.send(JSON.stringify({ music: "play" }))}
                stop={() => exampleSocket.send(JSON.stringify({ music: "stop" }))}
                setColor={(c) => {
                  setColor(c);
                  optimisedSendColor(c);
                }}
                {...{ color }}
              />
            } />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;