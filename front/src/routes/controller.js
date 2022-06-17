import { HexColorPicker } from "react-colorful";

export default function Controller({ play, stop, color, setColor }) {
    return <div>
        <button onClick={play}>Play</button>
        <button onClick={stop}>Stop</button>
        <HexColorPicker color={color} onChange={setColor} />
    </div>
}