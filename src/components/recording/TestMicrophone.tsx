import React, { useState, useEffect, useRef } from 'react';
import AudioDot from './AudioDot';
import { Box, Button } from '@mui/material';

interface TestMicrophoneProps {
    mediaRecorder: MediaRecorder;
}

const TestMicrophone: React.FC<TestMicrophoneProps> = ({ mediaRecorder }) => {
    const [recording, setRecording] = useState<boolean>(false);
    const [audioVolume, setAudioVolume] = useState<number>(0);
    const [audioURL, setAudioURL] = useState<string>("");
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const recordingRef = useRef<boolean>(false);
    const audioChunks = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        const handleDataAvailable = (event: BlobEvent) => {
            if (event.data.size > 0) {
                audioChunks.current.push(event.data);
            }
        };

        mediaRecorder.addEventListener('dataavailable', handleDataAvailable);

        return () => {
            mediaRecorder.removeEventListener('dataavailable', handleDataAvailable);
        };
    }, [mediaRecorder]);

    const handleStartRecording = async () => {
        setRecording(true);
        recordingRef.current = true;
        audioChunks.current = []; // Clear the audioChunks ref
        setAudioURL('');
        mediaRecorder.start(500); // Set timeslice to 100ms for dataavailable event to fire

        const newAudioContext = new AudioContext();
        setAudioContext(newAudioContext);
        const stream = mediaRecorder.stream;
        streamRef.current = stream;
        const source = newAudioContext.createMediaStreamSource(stream);
        const analyser = newAudioContext.createAnalyser();
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateAudioVolume = () => {
            if (!recordingRef.current) return;

            analyser.getByteFrequencyData(dataArray);
            const maxVolume = Math.max(...dataArray);
            setAudioVolume(maxVolume);

            requestAnimationFrame(updateAudioVolume);
        };

        updateAudioVolume();
    };

    const handleStopRecording = () => {
        setRecording(false);
        recordingRef.current = false;
        setAudioVolume(0);
        mediaRecorder.stop();
        audioContext && audioContext.close();
        streamRef && streamRef.current && streamRef.current.getTracks().forEach((track) => track.stop());
        replayAudio();
    };

    const replayAudio = () => {
        const audioBlob = new Blob(audioChunks.current);
        const audioURL = URL.createObjectURL(audioBlob);
        setAudioURL(audioURL);
    };

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
            <AudioDot volume={audioVolume / 255} />
            {audioURL && (
                <audio controls>
                    <source src={audioURL} type="audio/ogg" />
                </audio>
            )}
        </Box>
    );
};

export default TestMicrophone;