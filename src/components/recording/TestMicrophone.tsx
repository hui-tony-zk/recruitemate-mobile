import React, { useState, useEffect, useRef } from 'react';
import AudioDot from './AudioDot';
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

interface Props {
    mediaRecorder: MediaRecorder | null;
}

const TestMicrophone: React.FC<Props> = ({ mediaRecorder }) => {
    const [recording, setRecording] = useState<boolean>(false);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [audioURL, setAudioURL] = useState<string>("");
    const [audioVolume, setAudioVolume] = useState<number>(0);

    const handleStartRecording = () => {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream: MediaStream) => {
                mediaRecorder?.start();

                mediaRecorder?.addEventListener("dataavailable", (event: BlobEvent) => {
                    const { data } = event;
                    setAudioChunks((prevChunks: Blob[]) => [...prevChunks, data]);
                });

                mediaRecorder?.addEventListener("stop", () => {
                    const audioBlob = new Blob(audioChunks);
                    const audioURL = URL.createObjectURL(audioBlob);
                    setAudioURL(audioURL);
                });

                setRecording(true);
                handleVolume(stream);
            })
            .catch((error: Error) => {
                console.error(error);
            });
    };

    const handleStopRecording = () => {
        recording && mediaRecorder?.stop();
        setRecording(false);
    };

    const handleVolume = (stream: MediaStream) => {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);
        analyser.fftSize = 32;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const draw = () => {
            requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / bufferLength;
            setAudioVolume(average);
        };
        draw();
    };

    const dotSize = recording ? Math.min(5 + audioVolume / 255 * 15, 20) : 5;

    if (!mediaRecorder) {
        return null;
    }

    return (
        <Box>
            {!recording ? (
                <Button onClick={handleStartRecording} disabled={recording}>
                    Start Recording
                </Button>
            ) : (
                <Button onClick={handleStopRecording} disabled={!recording}>
                    Stop Recording
                </Button>
            )}
            <AudioDot size={dotSize} />
            {audioURL && (
                <audio controls>
                    <source src={audioURL} type="audio/ogg" />
                </audio>
            )}
        </Box>
    );
};

export default TestMicrophone;
