import { useEffect, useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Viewer from './routes/viewer';
import Controller from './routes/controller';
import _ from 'lodash';

let exampleSocket;
// const publicUrl = process.env.REACT_APP_PUBLIC_URL || "localhost:8081";
const publicUrl = process.env.REACT_APP_PUBLIC_URL || "carte-blanche22-server.azurewebsites.net";
let aud = new Audio("/15step.mp3");
aud.preload = "auto";

function App() {
  const [recievedPlay, setRecievedPlay] = useState(false);
  const [ping, setPing] = useState(0);
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
      pingLoop(exampleSocket);
    }
    exampleSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data);
      if(data.type === "ping"){
        setPing(() => (ping + ((new Date()).getTime() - (new Date(data.startTime)).getTime()))/2);
      }
      if (data.music) {
        if(data.music === "playWithCorrection"){
          aud.play();
          aud.currentTime = ping/2/1000;
        }
        if (data.music === "play") {
          aud.play();
          aud.currentTime = 0;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="App">
      <header style={{ backgroundColor: color }} className="App-header">
        <p>
          server address is {publicUrl}.
        </p>
        <p>
          ping is {ping}
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
                playWithCorrection={() => exampleSocket.send(JSON.stringify({ music: "playWithCorrection" }))}
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

function pingLoop(socket:WebSocket){
  socket.send(JSON.stringify({type: "ping", startTime: new Date()}));
  setTimeout(() => pingLoop(socket), 500);
}

export default App;