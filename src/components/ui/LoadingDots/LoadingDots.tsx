import React from 'react';
import styles from './LoadingDots.module.css';
import Box from '@mui/material/Box'

const LoadingDots = () => {
  return (
    <Box p={3}>
      <div className={styles.loadingDots}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
    </Box>
  );
};

export default LoadingDots;