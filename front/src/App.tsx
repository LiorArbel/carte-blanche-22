import { useEffect, useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Viewer from './routes/viewer.tsx';
import Controller from './routes/controller';
import _ from 'lodash';

let exampleSocket;
// const publicUrl = process.env.REACT_APP_PUBLIC_URL || "localhost:8081";
const publicUrl = process.env.REACT_APP_PUBLIC_URL || "carte-blanche22-server.azurewebsites.net";

function App() {
  let audio = useMemo(() => new Audio("/15step.mp3"), []);
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
    audio.preload = "auto";
    audio.currentTime = 10000;
    exampleSocket = new WebSocket("wss://" + publicUrl,);
    exampleSocket.onopen = (e) => {
      console.log("connected successfully!!!");
      pingLoop(exampleSocket);
    }
    exampleSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "ping") {
        setPing(() => (ping + ((new Date()).getTime() - (new Date(data.startTime)).getTime())) / 2);
        return;
      }
      console.log(data);
      if (data.music) {
        if (data.music === "playWithCorrection") {
          audio.play();
          audio.currentTime = ping / 2 / 1000;
        }
        if (data.music === "play") {
          audio.play();
          audio.currentTime = 0;
        } else if (data.music === "stop") {
          // audio.pause();
          audio.currentTime = 300000;
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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Viewer audio={audio}/>} />
            <Route path="controller" element={
              <Controller
                play={() => exampleSocket.send(JSON.stringify({ music: "play" }))}
                playWithCorrection={() => exampleSocket.send(JSON.stringify({ music: "playWithCorrection" }))}
                stop={() => exampleSocket.send(JSON.stringify({ music: "stop" }))}
                setColor={(c) => {
                  setColor(c);
                  optimisedSendColor(c);
                }}
                {...{ color, ping, recievedPlay, publicUrl, audio }}
              />
            } />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

function pingLoop(socket: WebSocket) {
  socket.send(JSON.stringify({ type: "ping", startTime: new Date() }));
  setTimeout(() => pingLoop(socket), 500);
}

export default App;