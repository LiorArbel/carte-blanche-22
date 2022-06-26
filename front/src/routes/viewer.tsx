import { useState } from "react";

export default function Viewer({audio}: {audio: HTMLAudioElement}) {
    console.log(audio);
    let [pressedPlay, setPressedPlay] = useState(false);

    return <div>
        <p>Bonjour</p>
        <button style={{visibility: pressedPlay? 'hidden' : 'visible'}} onClick={() => {audio.play();setPressedPlay(true); console.log("asdasd")}}>Play</button>
    </div>
}