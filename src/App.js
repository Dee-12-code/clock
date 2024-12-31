import React, { useState, useEffect } from 'react';
import './App.css'; // Add your CSS file

function App() {
  const [sessionLength, setSessionLength] = useState(25); // Default session length 25 minutes
  const [breakLength, setBreakLength] = useState(5); // Default break length 5 minutes
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60); // Time left in seconds
  const [isRunning, setIsRunning] = useState(false); // Timer state
  const [isSession, setIsSession] = useState(true); // True for session, false for break
  const [intervalId, setIntervalId] = useState(null); // Store interval id
  const beep = document.getElementById('beep'); // Beep sound

  // Effect for handling timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const id = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1); // Decrement the time every second
      }, 1000);
      setIntervalId(id);
    } else if (timeLeft === 0) {
      beep.play(); // Play beep sound when timer hits 0
      if (isSession) {
        setIsSession(false); // Switch to break
        setTimeLeft(breakLength * 60); // Set break time
      } else {
        setIsSession(true); // Switch back to session
        setTimeLeft(sessionLength * 60); // Set session time
      }
    }

    return () => clearInterval(intervalId); // Cleanup the interval when effect runs again or on unmount
  }, [isRunning, timeLeft, isSession, sessionLength, breakLength, beep, intervalId]);

  // Start or stop the timer
  const handleStartStop = () => {
    setIsRunning(!isRunning); // Toggle running state
  };

  // Reset the timer to initial values
  const handleReset = () => {
    setIsRunning(false); // Stop the timer
    setSessionLength(25); // Reset session length
    setBreakLength(5); // Reset break length
    setIsSession(true); // Set session to true
    setTimeLeft(25 * 60); // Reset timer to 25 minutes
    beep.pause(); // Stop beep sound and reset it
    beep.currentTime = 0;
  };

  // Decrease break length
  const handleBreakDecrement = () => {
    if (breakLength > 1) setBreakLength(breakLength - 1); // Ensure break length is > 0
  };

  // Increase break length
  const handleBreakIncrement = () => {
    if (breakLength < 60) setBreakLength(breakLength + 1); // Ensure break length is <= 60
  };

  // Decrease session length
  const handleSessionDecrement = () => {
    if (sessionLength > 1) setSessionLength(sessionLength - 1); // Ensure session length is > 0
    setTimeLeft((sessionLength - 1) * 60); // Update timeLeft based on session length
  };

  // Increase session length
  const handleSessionIncrement = () => {
    if (sessionLength < 60) setSessionLength(sessionLength + 1); // Ensure session length is <= 60
    setTimeLeft((sessionLength + 1) * 60); // Update timeLeft based on session length
  };

  // Convert time in seconds to mm:ss format
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div id="app">
      <div id="timer">
        <h2 id="timer-label">{isSession ? 'Session' : 'Break'}</h2>
        <p id="time-left">{formatTime(timeLeft)}</p>
        <div id="controls-bottom">
          <button id="start_stop" onClick={handleStartStop}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button id="reset" onClick={handleReset}>Reset</button>
        </div>
      </div>

      <div id="controls">
        <div>
          <h3 id="break-label">Break Length</h3>
          <button id="break-decrement" onClick={handleBreakDecrement}>-</button>
          <span id="break-length">{breakLength}</span>
          <button id="break-increment" onClick={handleBreakIncrement}>+</button>
        </div>
        <div>
          <h3 id="session-label">Session Length</h3>
          <button id="session-decrement" onClick={handleSessionDecrement}>-</button>
          <span id="session-length">{sessionLength}</span>
          <button id="session-increment" onClick={handleSessionIncrement}>+</button>
        </div>
      </div>

      {/* Audio element for the beep sound */}
      <audio id="beep" src="https://www.soundjay.com/button/beep-07.wav" preload="auto"></audio>
    </div>
  );
}

export default App;
