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
import TestMicrophone from './TestMicrophone';
import { SelectChangeEvent } from '@mui/material';

interface Device {
  deviceId: string;
  kind: string;
  label: string;
}

interface MicrophoneDialogProps {}

const MicrophoneDialog: React.FC<MicrophoneDialogProps> = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    if (!navigator.mediaDevices) {
      alert('MediaDevices are not supported on this browser');
      return;
    }
    const getDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = devices.filter((device) => device.kind === 'audioinput');
      console.log(audioDevices);
      setDevices(audioDevices);
      const defaultDevice = audioDevices[0].deviceId;
      setSelectedDeviceId(defaultDevice);
      const testDevice = await createMediaDevice(defaultDevice);
      setMediaRecorder(testDevice);
    };
    getDevices();
  }, []);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
  };

  const selectDevice = async (event: SelectChangeEvent) => {
    const deviceId = event.target.value as string;
    setSelectedDeviceId(deviceId);
    const testDevice = await createMediaDevice(deviceId);
    setMediaRecorder(testDevice);
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
          <TestMicrophone mediaRecorder={mediaRecorder} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MicrophoneDialog;

async function createMediaDevice(deviceId: string) {
  const constraints = { audio: { deviceId: deviceId } };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const testDevice = new MediaRecorder(stream);
  return testDevice;
}
