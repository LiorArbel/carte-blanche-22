import {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

let context = null;
var exampleSocket;
const publicUrl = process.env.REACT_APP_PUBLIC_URL || "localhost:8080";

const beep = (freq = 340, duration = 200, vol = 10) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.connect(gain);
    oscillator.frequency.value = freq;
    oscillator.type = "square";
    gain.connect(context.destination);
    gain.gain.value = vol * 0.01;
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration * 0.001);
}

function App() {
  useEffect(() => {
    context = new AudioContext();
    exampleSocket = new WebSocket("wss://" + publicUrl, );
    exampleSocket.onopen = (e) => {
      console.log("connected successfully!!!");
    }
    exampleSocket.onmessage = (e) => {
      console.log(e);
      beep();
    }
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          server address is {publicUrl}.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
