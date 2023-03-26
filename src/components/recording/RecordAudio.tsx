import React, { useState, useEffect, useRef } from 'react';
import AudioDot from './AudioDot';
import { Box, Button } from '@mui/material';

interface RecordAudioProps {
    deviceId: string;
}

const RecordAudio: React.FC<RecordAudioProps> = ({ deviceId }) => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [recording, setRecording] = useState<boolean>(false);
    const [audioVolume, setAudioVolume] = useState<number>(0);
    const [audioURL, setAudioURL] = useState<string>("");
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const recordingRef = useRef<boolean>(false);
    const audioChunks = useRef<Blob[]>([]);

    const createMediaDevice = async (deviceId: string) => {
        const constraints = { audio: { deviceId: deviceId } };
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        const testDevice = new MediaRecorder(mediaStream);
        setMediaRecorder(testDevice);
        setStream(mediaStream);
        return testDevice;
    };

    useEffect(() => {
        if (!mediaRecorder) return;

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
        const recordingDevice = await createMediaDevice(deviceId);

        setRecording(true);
        recordingRef.current = true;
        audioChunks.current = []; // Clear the audioChunks ref
        setAudioURL('');
        recordingDevice.start(500); // Set timeslice to 100ms for dataavailable event to fire

        const newAudioContext = new AudioContext();
        setAudioContext(newAudioContext);
        const stream = recordingDevice.stream;
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
        if (!mediaRecorder) return;

        setRecording(false);
        recordingRef.current = false;
        setAudioVolume(0);
        mediaRecorder.stop();
        audioContext && audioContext.close();
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
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

export default RecordAudio;