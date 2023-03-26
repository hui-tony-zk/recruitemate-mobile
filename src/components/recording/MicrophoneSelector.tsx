import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import RecordAudio from './RecordAudio';
import { SelectChangeEvent } from '@mui/material';

interface Device {
  deviceId: string;
  kind: string;
  label: string;
}

interface MicrophoneDialogProps { }

const MicrophoneDialog: React.FC<MicrophoneDialogProps> = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const getDevices = async () => {
    try {
      // Request microphone permission by calling getUserMedia
      const permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      permissionStream.getTracks().forEach((track) => track.stop()); // Stop the stream to release the microphone
  
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = devices.filter((device) => device.kind === 'audioinput');
      console.log(audioDevices);
      setDevices(audioDevices);
    } catch (error) {
      console.error('Error getting microphone permission:', error);
    }
  };
  const handleOpen = () => {

    if (!navigator.mediaDevices) {
      alert('MediaDevices are not supported on this browser');
      return;
    }
    getDevices();
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const selectDevice = async (event: SelectChangeEvent) => {
    const deviceId = event.target.value as string;
    setSelectedDeviceId(deviceId);
  };

  return (
    <>
      <Button onClick={handleOpen}>Select Microphone</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Microphone</InputLabel>
            <Select value={selectedDeviceId} onChange={selectDevice}>
              {devices &&
                devices.map((device) => (
                  <MenuItem key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          {selectedDeviceId && <RecordAudio deviceId={selectedDeviceId} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MicrophoneDialog;

