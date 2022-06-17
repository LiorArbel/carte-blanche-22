export default function Controller({play, stop}) {
    return <div>
        <button onClick={play}>Play</button>
        <button onClick={stop}>Stop</button>
    </div>
}