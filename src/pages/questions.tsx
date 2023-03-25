import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const questions = [
  'What are your strengths?',
  'What are your weaknesses?',
  'Why do you want this job?'
];

export default function Questions() {
  return (
    <List>
      {questions.map((question) => (
        <ListItem key={question}>
          <ListItemText primary={question} />
        </ListItem>
      ))}
    </List>
  );
}