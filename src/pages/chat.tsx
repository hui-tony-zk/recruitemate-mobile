import React, { useState, useRef, useEffect } from 'react'
import LoadingDots from '@/components/ui/LoadingDots';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton'
import MicIcon from '@mui/icons-material/Mic';

import TranscribeAudio from '@/components/recording/recordHandler'
import MicrophoneSelector from '@/components/recording/MicrophoneSelector'

const AI_DISPLAY_NAME = 'Interviewer'
const MESSAGE_INITIAL_STATE = [{
    text: 'How would you improve the experience of dissatisfied customers?', author: AI_DISPLAY_NAME
}]
const MessagePage = () => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [messages, setMessages] = useState(MESSAGE_INITIAL_STATE);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getAIResponse(messages)
    }, [messages]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const sendMessage = async () => {
        if (!input) return;
        const userInput = { text: input, author: 'You' }
        setMessages((prevMessages) => [...prevMessages, userInput]);
        setInput('');
    };

    const getAIResponse = async (messages: any) => {
        if (messages.at(-1).author != AI_DISPLAY_NAME) {
            setIsLoading(true);
            // Make API call here for response
            await new Promise(resolve => setTimeout(resolve, 2000)); // Mock API delay
            setMessages((prevMessages) => [...prevMessages, { text: 'Pending integration', author: AI_DISPLAY_NAME }]);
            setIsLoading(false);
        }
    }

    const resetThread = () => {
        setMessages(MESSAGE_INITIAL_STATE);
    }

    const AlwaysScrollToBottom: React.FC = () => {
        const elementRef = useRef<HTMLDivElement>(null);
        useEffect(() => {
          if (elementRef.current) {
            elementRef.current.scrollIntoView();
          }
        });
        return <div ref={elementRef} />;
      };

    return (
        <Box width="100%" height="100%" display="flex" flexDirection="column">
            <Box style={{ overflowY: 'auto' }} flexGrow={1} >
                <Box maxHeight="60vh">
                    {messages.map((message, index) => (
                        <Box key={index} m={1} display="flex" justifyContent={message.author === AI_DISPLAY_NAME ? 'flex-start' : 'flex-end'}>
                            <Box
                                bgcolor={message.author === AI_DISPLAY_NAME ? 'primary.main' : '#555'}
                                px={2}
                                py={1}
                                m={1}
                                borderRadius={3}
                            >
                                <Box display="flex" justifyContent="flex-start">
                                    <Typography variant="body2">
                                        {message.author}:
                                    </Typography>
                                </Box>
                                <Typography variant="body1">
                                    {message.text}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                    {isLoading && <LoadingDots />}
                    <AlwaysScrollToBottom />
                </Box>
            </Box>
            <Box>
                <Box display="flex" alignItems="center">
                    {/* <TextField
                        label="Type your message"
                        value={input}
                        onChange={handleInputChange}
                    /> */}
                    <MicrophoneSelector/>
                    <IconButton onClick={() => sendMessage()} color='primary'>
                        <MicIcon />
                    </IconButton>
                    {messages.length > 1 && (
                        <IconButton onClick={resetThread} color="warning">
                            <RefreshIcon />
                        </IconButton>
                    )}
                </Box>
                <p id="status">Connection status will go here</p>
            </Box>
        </Box>
    );
};

export default MessagePage;
