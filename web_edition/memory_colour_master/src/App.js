import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [pattern, setPattern] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [responseMatchMessage, setResponseMatchMessage] = useState('');
  const [gameBoardSize, setGameBoardSize] = useState('80vw'); // Default size
  const [interactive, setInteractive] = useState(true);
  const [whiteSquareVisibility, setWhiteSquareVisibility] = useState({
    Red: false,
    Blue: false,
    Green: false,
    Yellow: false,
  }); // State to manage visibility of white squares
  

  const [count, setCount] = useState(0); // State to hold the counter value
  const [isRunning, setIsRunning] = useState(true); // State to control the loop
  const [isMatching, setIsMatching] = useState(true); // State to control the loop
  const [matched, setMatched] = useState(false);

  
   // Function to update game board size based on window width
   const updateGameBoardSize = () => {
    if (window.innerWidth >= 1200) { // Check if width is full screen (or a certain threshold)
      setGameBoardSize('600px'); // Set a fixed size for larger screens
    } else {
      setGameBoardSize('60vw'); // Set to a percentage for smaller screens
    }
  };


  const displayPatternWithDelay = async () => {
    setInteractive(false);
    for (let i = 0; i < pattern.length ; i++) {
      console.log("PATTERN : " + pattern[i]);

      // Set visibility based on the character
      setWhiteSquareVisibility((prev) => ({
        ...prev,
        Red: pattern[i] === '1',
        Blue: pattern[i] === '2',
        Green: pattern[i] === '3',
        Yellow: pattern[i] === '4',
      }));
  
      // Wait for 1 second (1000 ms) before continuing to the next character
      await new Promise((resolve) => setTimeout(resolve, 750));
      setWhiteSquareVisibility({
        Red: false,
        Blue: false,
        Green: false,
        Yellow: false,
      });
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    // After the loop, reset visibility of all squares
    setWhiteSquareVisibility({
      Red: false,
      Blue: false,
      Green: false,
      Yellow: false,
    });
    setInteractive(true);
  };

  
  // Game Loop
  useEffect(() => {
    const intervalId = setInterval(async() => {
      if (isRunning) {
        console.log("isRunning...");
        getMatch();
        
        setCount((prevCount) => prevCount + 1); // Increment count after pattern display
      }
    }, 1000);
    // Cleanup interval when isMatching changes or on unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run only once when the component mounts



  // Effect to start the interval loop when isMatching is true
  useEffect(() => {
    if (!isMatching) return; // Only run if isMatching is true

    const intervalId = setInterval(async() => {
      if (matched) {
        console.log("Matched");
        //Generate new pattern to match
        getPattern();

        //Clear player session match string
        clearPlayerPattern();
        
        setMatched(false); // Reset matched for the next interval
        setIsMatching(false);
      }
    }, 100);

    // Cleanup interval when isMatching changes or on unmount
    return () => clearInterval(intervalId);
  }, [isMatching, matched]); // Re-run effect when `isMatching` or `matched` changes

 
  const handleSquareClick = (colour) => {
    console.log(`${colour} square clicked!`);
  };

  const getPattern = async () => {
      try {
        const response = await axios.get('/api/memorycolourmaster/getpattern');
        console.log("Generating new pattern from server");
        console.log("New Pattern : " + response.data.message);
        // Update the state with the response message
        setPattern(response.data.message);
      } catch (error) {
        // Handle error case
        console.error("Error fetching the greeting: ", error);
      }      
   };

  // Use useEffect to track when pattern changes
  useEffect(() => {
    console.log("Updated PATTERN: " + pattern);
    displayPatternWithDelay();
  }, [pattern]); // This will run when the pattern state changes

  
   const clearPattern = async () => {
    try {
      const response = await axios.get('/api/memorycolourmaster/clearpattern');
      setResponseMessage(response.data.message);
      setPattern("");
    } catch (error) {
      console.error("Error clearing the pattern : ", error);
    }
  };
   
  const clearPlayerPattern = async () => {
    try {
      const response = await axios.get('/api/memorycolourmaster/clearplayerpattern');
      setResponseMessage(response.data.message);
      // setPattern("");
    } catch (error) {
      console.error("Error clearing the pattern : ", error);
    }
  };
   
  const getMatch = async () => {
    try {
      const response = await axios.get('/api/memorycolourmaster/getmatch');
      setResponseMatchMessage(response.data.message);
      console.log("PRITING RESPONCE : " + response.data.message);
      if(response.data.message === "True")
      // if(responseMatchMessage === "True")
      {
        console.log("True");
        console.log(`${responseMatchMessage}`);
        setMatched(true)
        setIsMatching(true);
      }
      else if (response.data.message === "GAME OVER")
      {
        clearPattern();
        clearPlayerPattern();
        getPattern();
      }
      else
      {
        console.log("False");
        console.log(`${responseMatchMessage}`);
        // clearPattern();
        // getPattern();
        setMatched(false);
        setIsMatching(false);
      }
    } catch (error) {
      console.error("Error clearing the pattern : ", error);
    }
  };


  //POST
  // Send message to ASP.NET 
  const sendPattern = async (newSendValue) => {
    try {
      const response = await axios.post('/api/memorycolourmaster/send', { text: newSendValue});
      setResponseMessage(response.data.message);
    } catch (error) {
      console.error("Error sending the message: ", error);
    }
  };

   // Function to toggle visibility of white squares based on hovered color
   const toggleWhiteSquareVisibility = (color, isVisible) => {
    setWhiteSquareVisibility((prev) => ({
      ...prev,
      [color]: isVisible,
    }));
  };


  // Function to toggle the game loop on and off
  const toggleGameLoop = () => {
    setIsRunning((prev) => !prev); // Toggle the isRunning state
  };

  useEffect(() => {
    updateGameBoardSize();
    
    const fetchPattern = async () => {
      try {
        const response = await axios.get('/api/memorycolourmaster/getpattern');
        // Update the state with the response message
        setPattern(response.data.message);
      } catch (error) {
        // Handle error case
        console.error("Error fetching the greeting: ", error);
      }      
    };
    
    fetchPattern(); 
    
    // Add event listener to update size on resize
    window.addEventListener('resize', updateGameBoardSize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', updateGameBoardSize);
    };
}, []); // The empty array ensures the effect runs only once (when the component mounts)

  return (
    <div className="App" style={styles.container}>
      <div style={{...styles.gameboard, width: gameBoardSize}}>
    
          <div
            style={{ ...styles.square, ...styles.red, backgroundColor: 'red'}}
            onMouseEnter={() => interactive ? (toggleWhiteSquareVisibility('Red', true)) : null} 
            onMouseLeave={() => interactive ? (toggleWhiteSquareVisibility('Red', false)) : null} 
            onClick={() => {
              if (interactive){
                handleSquareClick('Red');
                sendPattern('1');
                // setIsMatching(true);
                // validatePattern('1');
              }
            }}
           ></div>
          <div
            style={{ ...styles.square, ...styles.blue, backgroundColor: 'blue'}}
            onMouseEnter={() => interactive ? (toggleWhiteSquareVisibility('Blue', true)) : null} 
            onMouseLeave={() => interactive ? (toggleWhiteSquareVisibility('Blue', false)) : null} 
            onClick={() => {
              if(interactive){
                handleSquareClick('Blue');
                sendPattern('2');
                // setIsMatching(true);
                // validatePattern('2');
              }
            }}
          ></div>
          <div
            style={{ ...styles.square, ...styles.green, backgroundColor: 'green'}}
            onMouseEnter={() => interactive ? (toggleWhiteSquareVisibility('Green', true)) : null} 
            onMouseLeave={() => interactive ? (toggleWhiteSquareVisibility('Green', false)) : null} 
            onClick={() => {
              if(interactive)
              {
                handleSquareClick('Green')
                sendPattern('3');
                // setIsMatching(true);
                // validatePattern('3');
              }
            }}
          ></div>
          <div
            style={{ ...styles.square, ...styles.yellow, backgroundColor: 'yellow'}}
            onMouseEnter={() => interactive ? (toggleWhiteSquareVisibility('Yellow', true)) : null} 
            onMouseLeave={() => interactive ? (toggleWhiteSquareVisibility('Yellow', false)) : null} 
            onClick={() => {
              if(interactive)
              {
                handleSquareClick('Yellow')
                sendPattern('4');
                // setIsMatching(true);
                // console.log("#############PATTERN########## : " + pattern);
                // validatePattern('4');
              }
            }}
          ></div>

          {whiteSquareVisibility.Red && (
            <div style={{ ...styles.white, ...styles.white_red, backgroundColor: interactive ? 'white' : 'cyan' }}></div>
          )}
          {whiteSquareVisibility.Blue && (
            <div style={{ ...styles.white, ...styles.white_blue, backgroundColor: interactive ? 'white' : 'cyan'}}></div>
          )}
          {whiteSquareVisibility.Green && (
            <div style={{ ...styles.white, ...styles.white_green, backgroundColor: interactive ? 'white' : 'cyan'}}></div>
          )}
          {whiteSquareVisibility.Yellow && (
            <div style={{ ...styles.white, ...styles.white_yellow, backgroundColor: interactive ? 'white' : 'cyan' }}></div>
          )}
      </div>
    
      <div id="player_ui" className='ui' style={styles.ui}>
        <h1>{pattern}</h1>
        <button onClick={getPattern}>Generate new pattern </button>
        <button onClick={clearPattern}>Clear pattern </button>
        <button
          style={styles.button}
          onClick={() => setInteractive((prev) => !prev)} // Directly toggle the state
        >
          {interactive? 'Disable Interaction' : 'Enable Interaction'}
        </button>
    
        <h3>Counter: {count}</h3>
        <button 
          disabled={!interactive}
          onClick={toggleGameLoop}
        >
            {interactive ? 'Start Loop' : 'Looping'}
            {/* {isRunning ? 'Stop Loop' : 'Start Loop'} */}
        </button>


        <h2>{responseMessage}</h2>
        <h2>{responseMatchMessage}</h2>
      </div>
    
    </div>
  );
}

//Inline styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column', // Arrange children in a column
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    gap: '20px',
  },
  gameboard: {
    position: 'relative', // Set position relative for absolute children
    display: 'grid', // Enable grid layout
    gridTemplateColumns: 'repeat(2, 1fr)', // 2 equal columns
    gridTemplateRows: 'repeat(2, 1fr)', // 2 equal rows
    height: '80vh', // Fill the full height of the viewport
    gap: '10px', // Space between grid items
    backgroundColor: '#000', // Black background for the game board
    border: '2px solid #FF4500', // Border for the game board
    padding: '20px', // Padding around the grid container
    marginBottom: '20px', // Space below the game board
    marginTop: '20px', // Space at the top of the game board
    zIndex: 0, // Set behind colored squares
  },
  square: {
    // position: 'absolute', // Absolute positioning for overlapping squares
    display: 'flex', // Use flexbox for centering content inside the squares
    justifyContent: 'center', // Center content horizontally
    alignItems: 'center', // Center content vertically
    backgroundColor: '#007bff', // Background color for squares
    borderRadius: '5px', // Rounded corners for squares
    fontSize: '24px', // Font size for square text
    color: '#fff', // Text color for visibility
    cursor: 'pointer', // Pointer cursor for interactive squares
  },
    red: {
      backgroundColor: 'red',
      zIndex: 2, // Set behind colored squares
    },
    blue: {
      backgroundColor: 'blue',
      zIndex: 2, // Set behind colored squares
    },
    green: {
      backgroundColor: 'green',
      zIndex: 2, // Set behind colored squares
    },
    yellow: {
      backgroundColor: 'yellow',
      zIndex: 2, // Set behind colored squares
    },
    white: {
      backgroundColor: 'white',
      width: '47.5%', // Larger width for white squares
      height: '46.5%', // Larger height for white squares
      position: 'absolute', // Make it absolute to fill the gameboard
      zIndex: 1, // Set behind colored squares
    },
    white_red: {
      top: '3.5%', // Align to the top of the gameboard
      left: '2.5%', // Align to the left of the gameboard
    },
    white_blue: {
      top: '3.5%', // Align to the top of the gameboard
      left: '50%', // Align to the right of the gameboard
    },
    white_green: {
      top: '50%', // Align to the bottom of the gameboard
      left: '2.5%', // Align to the left of the gameboard
    },
    white_yellow: {
      top: '50%', // Align to the bottom of the gameboard
      left: '50%', // Align to the right of the gameboard
    },
  
  
  ui: {
    backgroundColor: '#f0f0f0',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column', // Stack items vertically
    alignItems: 'center', // Center align items horizontally
    gap: '10px', // Add some space between items
  },
};

export default App;
