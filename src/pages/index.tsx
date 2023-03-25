import React from 'react';
import Link from 'next/link';
import { Button } from '@mui/material';

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/questions">
        <Button variant="contained">Go to Interview Questions</Button>
      </Link>
    </div>
  );
}