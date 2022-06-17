import { HexColorPicker } from "react-colorful";

export default function Controller({ play, playWithCorrection, stop, color, setColor }) {
    return <div>
        <button onClick={play}>Play</button>
        <button onClick={playWithCorrection}>play with correction</button>
        <button onClick={stop}>Stop</button>
        <HexColorPicker color={color} onChange={setColor} />
    </div>
}