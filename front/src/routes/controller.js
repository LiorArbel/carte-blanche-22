import { HexColorPicker } from "react-colorful";

export default function Controller({ play, playWithCorrection, stop, color, setColor, publicUrl, ping, recievedPlay }) {
    return <div>
        <p>
          server address is {publicUrl}.
        </p>
        <p>
          ping is {ping}
        </p>
        {recievedPlay && <p>
          recieved a play request!
        </p>}
        <button onClick={play}>Play</button>
        <button onClick={playWithCorrection}>play with correction</button>
        <button onClick={stop}>Stop</button>
        <HexColorPicker color={color} onChange={setColor} />
    </div>
}