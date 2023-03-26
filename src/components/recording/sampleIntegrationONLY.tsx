import { Socket } from "dgram";
import { useState, useEffect, useRef } from "react";

const TranscribeAudio = ({ }) => {
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [socket, setSocket] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [transcribedText, setTranscribedText] = useState(""); //response from GPT
    const [userText, setUserText] = useState(""); //user spoken text

    useEffect(() => {
        const audioContext = new AudioContext();

        function handleUserTextData(jsonData: string) {
            const parsedData = JSON.parse(jsonData);
            const text = parsedData.user_text;

            if (text) {
                let currentTextIndex = 0;

                const intervalId = setInterval(() => {
                    if (currentTextIndex < text.length) {
                        setUserText((prevUserText) => {
                            return prevUserText + text[currentTextIndex];
                        });
                        currentTextIndex++;
                    } else {
                        clearInterval(intervalId);
                    }
                }, 50);
            }
        }

        function handleAudioData(jsonData: string) {
            const parsedData = JSON.parse(jsonData);
            const audioData = parsedData.audio_data;

            // Convert the base64-encoded audio data to a binary string
            const binaryString = window.atob(audioData);

            // Convert the binary string to a typed array
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            // Decode the typed array into an AudioBuffer
            audioContext.decodeAudioData(bytes.buffer, (buffer: AudioBuffer) => {
                // Create a new AudioBufferSourceNode
                const source = audioContext.createBufferSource();
                source.buffer = buffer;

                // Connect the AudioBufferSourceNode to the AudioContext output
                source.connect(audioContext.destination);

                // Start playing the audio
                source.start();

                // Update the transcript textarea as the audio is being played
                const text = parsedData.ai_text;
                console.log('here is the parsed text')
                console.log(typeof text)
                console.log(text)
                let currentTextIndex = transcribedText.length;

                const intervalId = setInterval(() => {
                    if (currentTextIndex < text.length) {
                        setTranscribedText((prevTranscribedText) => {
                            return prevTranscribedText + text[currentTextIndex];
                        });
                        currentTextIndex++;
                        console.log('the newText')
                        console.log(text)
                    } else {
                        clearInterval(intervalId);
                    }
                }, 50);
            });
        }

        const question = "Tell me about yourself"; // default question

        const createdSocket = createSocket(question, setSocket, handleAudioData, handleUserTextData);
        setSocket(createSocket)

        navigator.mediaDevices
            .getUserMedia({
                audio: { sampleSize: 16, channelCount: 1, sampleRate: 44100 },
            })
            .then((stream) => {
                if (!MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
                    return alert("Browser not supported");
                }
                const mediaRecorder = new MediaRecorder(stream, {
                    mimeType: "audio/webm;codecs=opus",
                });
                setMediaRecorder(mediaRecorder);
            });
    }, []);

    const handleSendButtonClick = () => {
        if (!mediaRecorder) {
            console.log('mediarecorder not working')
            return;
        }

        if (isRecording) {
            mediaRecorder.stop();
            setIsRecording(false);
            return;
        }

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            console.log('mediarecorder stopped')
            const audioBlob = new Blob(chunks, { type: "audio/webm;codecs=opus" });
            socket.send(audioBlob);
        };

        mediaRecorder.start(250);
        setIsRecording(true);
    };

    return (
        <>
            <button onClick={handleSendButtonClick}>
                {isRecording ? "Recording..." : "Start Recording"}
            </button>
            <p>User: {userText}</p>
            <p>AI: {transcribedText}</p>
        </>
    );
};

export default TranscribeAudio;

function createSocket(question: string, handleAudioData: (jsonData: string) => void, handleUserTextData: (jsonData: string) => Socket) {
    const socket = new WebSocket(`ws://127.0.0.1:8000/practice?question=${question}`);

    socket.onopen = () => {
        console.log({ event: "onopen" });
    };

    socket.onclose = () => {
        console.log({ event: "onclose" });
    };

    socket.onerror = (error) => {
        console.log({ event: "onerror", error });
    };

    socket.onmessage = async (event) => {
        console.log({ event: "onmessage", data: event.data });

        const jsonData = JSON.parse(event.data);

        if (jsonData.hasOwnProperty("audio_data")) { // this is AI voice
            handleAudioData(event.data);
        } else if (jsonData.hasOwnProperty("user_text")) { // this is AI text
            console.log(event.data);
            handleUserTextData(event.data);
        }
    };

    return socket
}
