import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import kilter_board from '../assets/kilter_board.png'; // Ensure the path is correct
import './Create.css'; // Make sure the CSS file is named correctly and imported
import { useNavigate } from 'react-router-dom';


function KilterBoard() {
    const [selectedHolds, setSelectedHolds] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [newHold, setNewHold] = useState(null);
    const navigate = useNavigate();
    const [response, setResponse] = useState(null);
    
    const handleClick = async (e) => {
        const NUM_GRID_COLUMNS = 35; // Number of columns in the grid
        const NUM_GRID_ROWS = 38; // Number of rows in the grid
        const GRID_X_INCREMENT = 1; // Number of pixels between each column
        const GRID_Y_INCREMENT = 1; // Number of pixels between each row
        const rect = e.target.getBoundingClientRect();

        const originalHeight = e.target.naturalHeight;
        const originalWidth = e.target.naturalWidth;

        const clickX = e.clientX - rect.left; // X coordinate relative to the image
        const clickY = e.clientY - rect.top; // Y coordinate relative to the image
        console.log("clickX: ", clickX);
        console.log("clickY: ", clickY);
        console.log("e.clientX: ", e.clientX);
        console.log("e.clientY: ", e.clientY);
        const cellWidth = rect.width / NUM_GRID_COLUMNS; // Width of one cell
        const cellHeight = rect.height / NUM_GRID_ROWS; // Height of one cell
    
        const x = Math.floor(clickX / cellWidth) * GRID_X_INCREMENT;
        const y = NUM_GRID_ROWS - Math.ceil(clickY / cellHeight) -1;


        try {
            // Update this URL to the correct endpoint
            const url = 'http://localhost:8000/create/identify_hold/';
            
            const response = await axios.post(url, { x, y });
            
            if (response.data.success) {
                const holdX = response.data.x_coordinate;
                const holdY = response.data.y_coordinate;

                // Convert grid coordinates back to pixel coordinates
                const pixelX = holdX * cellWidth + cellWidth / 2;
                const pixelY = (NUM_GRID_ROWS - holdY - 1) * cellHeight + cellHeight / 2;

                const newHold = {
                    id: response.data.holdId,
                    x_grid: response.data.x_coordinate,
                    y_grid: response.data.y_coordinate,
                    x_coor: e.clientX,
                    y_coor: e.clientY,
                    hold_type: response.data.type,
                    hold_function: response.data.function,
                    hold_depth: response.data.depth,
                    hold_orientation: response.data.orientation,
                    hold_size: response.data.size,
                    isSelected: true,
                };
                setSelectedHolds(prevHolds => prevHolds.map(hold => ({ ...hold, isSelected: false })).concat(newHold));
        
                // console.log('Hold identified:', response.data.holdId, response.data.x_coordinate, response.data.y_coordinate, pixelX, pixelY);
                // console.log('Hold identified:', selectedHolds);
                // pass to selectedHolds to backend

            } else {
                console.error('No hold identified:', response.data.message);
            }
        } catch (error) {
            console.error('Error when identifying hold:', error);
        }
    };



    useEffect(() => {
        console.log('Updated Holds:', selectedHolds);
    }, [selectedHolds]);
    
    const updateHoldType = (holdType) => {
        setSelectedHolds(prevHolds => 
            prevHolds.map(hold => 
                hold.isSelected ? { ...hold, hold_position_in_route: holdType, isSelected: false } : hold
            )
        );
    };

    const getCircleColor = (holdType) => {
        switch (holdType) {
            case 'Start': return 'green';
            case 'Middle': return 'blue';
            case 'Finish': return 'purple';
            case 'Foot Only': return 'orange';
            default: return 'red';
        }
    };

    
    const renderCircles = () => {
        return selectedHolds.map((hold, index) => (
            <div 
                key={index}
                className="circle"
                style={{
                    top: hold.y_coor,
                    left: hold.x_coor,
                    borderColor: getCircleColor(hold.hold_position_in_route),
                }}
            />
        ));
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:8000/create/create_route/', { holds: selectedHolds });
            console.log('Response:', response.data);
            setResponse(response.data);
            // Handle response or further actions here
        } catch (error) {
            console.error('Error sending holds to backend:', error);
            // Handle error here
        }
    };

    const handleChange = async () => {
      // Navigate to the chatbot page with state
      navigate("/routeops/", { state: { holds: selectedHolds, response: response} });
    };
    
    // Render the dropdown for the currently selected hold
    const dropdownForSelectedHold = selectedHolds.find(hold => hold.isSelected);
    const renderDropdown = () => {
        return dropdownForSelectedHold && (
            <DropdownMenu currentHold={dropdownForSelectedHold} updateHoldType={updateHoldType} />
        );
    };


    const DropdownMenu = ({ currentHold, updateHoldType }) => {
        const handleSelection = (holdType) => {
            updateHoldType(holdType);
            setShowDropdown(false); // Hide dropdown after selection
        };
    
        return (
        
            <div className="dropdown-menu" style={{ top: currentHold.y_coor, left: currentHold.x_coor + 50 }}>
                <button onClick={() => handleSelection('Start')}>Start</button>
                <button onClick={() => handleSelection('Middle')}>Middle</button>
                <button onClick={() => handleSelection('Finish')}>Finish</button>
                <button onClick={() => handleSelection('Foot Only')}>Foot Only</button>
                </div>

        );
    };

    return (
        <div className="kilterBoardContainer">
            <img src={kilter_board} alt="Kilter Board" className="kilter-board" onClick={handleClick} />
            {renderCircles()}
            {renderDropdown()}
            <button onClick={handleSubmit} className = "buttonx">Generate Beta</button>
            <button onClick={handleChange} className = "buttonx">Route Operations</button>
        </div>
    );
    
    
    }

export default KilterBoard;




    // return (
    //     <div className="kilterBoardContainer">
    //         <img src={kilter_board} alt="Kilter Board" className="kilter-board" onClick={handleClick} />
    //         {renderCircles()}
    //     </div>
    // );

    // return (
    //     <div className="kilterBoardContainer">
    //         <img src={kilter_board} alt="Kilter Board" className="kilter-board" onClick={handleClick} />
    //         {renderCircles()}
    //         {renderDropdown()}
    //     </div>
    // );


// Working! well... kinda
// function KilterBoard() {
//     const [selectedHolds, setSelectedHolds] = useState([]);
//     const [currentHold, setCurrentHold] = useState(null);
//     const [showDropdown, setShowDropdown] = useState(false);
    
//     const handleClick = async (e) => {
//         const NUM_GRID_COLUMNS = 35; // Number of columns in the grid
//         const NUM_GRID_ROWS = 38; // Number of rows in the grid
//         const GRID_X_INCREMENT = 1; // Number of pixels between each column
//         const GRID_Y_INCREMENT = 1; // Number of pixels between each row
//         const rect = e.target.getBoundingClientRect();

//         const originalHeight = e.target.naturalHeight;
//         const originalWidth = e.target.naturalWidth;

//         const clickX = e.clientX - rect.left; // X coordinate relative to the image
//         const clickY = e.clientY - rect.top; // Y coordinate relative to the image
//         console.log("clickX: ", clickX);
//         console.log("clickY: ", clickY);
//         console.log("e.clientX: ", e.clientX);
//         console.log("e.clientY: ", e.clientY);
//         const cellWidth = rect.width / NUM_GRID_COLUMNS; // Width of one cell
//         const cellHeight = rect.height / NUM_GRID_ROWS; // Height of one cell
    
//         const x = Math.floor(clickX / cellWidth) * GRID_X_INCREMENT;
//         const y = NUM_GRID_ROWS - Math.ceil(clickY / cellHeight) -1;
//         setCurrentHold({
//             x_coor: e.clientX,
//             y_coor: e.clientY,
//             holdType: 'default', // default hold type
//         });
//         setShowDropdown(true);

//         try {
//             // Update this URL to the correct endpoint
//             const url = 'http://localhost:8000/create/identify_hold/';
            
//             const response = await axios.post(url, { x, y });
            
//             if (response.data.success) {
//                 const holdX = response.data.x_coordinate;
//                 const holdY = response.data.y_coordinate;

//                 // Convert grid coordinates back to pixel coordinates
//                 const pixelX = holdX * cellWidth + cellWidth / 2;
//                 const pixelY = (NUM_GRID_ROWS - holdY - 1) * cellHeight + cellHeight / 2;

//                 setSelectedHolds([...selectedHolds, {
//                     id: response.data.holdId,
//                     x_grid: response.data.x_coordinate,
//                     y_grid: response.data.y_coordinate,
//                     x_coor: e.clientX,
//                     y_coor: e.clientY,
//                     hold_type: response.data.type,
//                     hold_function: response.data.function,
//                     hold_depth: response.data.depth,
//                     hold_orientation: response.data.orientation,
//                 }]);
//                 // console.log('Hold identified:', response.data.holdId, response.data.x_coordinate, response.data.y_coordinate, pixelX, pixelY);
//                 // console.log('Hold identified:', selectedHolds);
//                 // pass to selectedHolds to backend

//             } else {
//                 console.error('No hold identified:', response.data.message);
//             }
//         } catch (error) {
//             console.error('Error when identifying hold:', error);
//         }
//     };

//     useEffect(() => {
//         console.log('Updated Holds:', selectedHolds);
//     }, [selectedHolds]);
    
//     const updateHoldType = (holdType) => {
//         if (currentHold) {
//             setSelectedHolds([
//                 ...selectedHolds,
//                 { ...currentHold, holdType: holdType }
//             ]);
//         }
//     };

//     const renderCircles = () => {
//         return selectedHolds.map((hold, index) => (
//             <div 
//                 key={index}
//                 className="circle"
//                 style={{
//                     top: hold.y_coor,
//                     left: hold.x_coor,
//                     borderColor: getCircleColor(hold.holdType),
//                 }}
//             />
//         ));
//     };
    
//     const getCircleColor = (holdType) => {
//         switch (holdType) {
//             case 'Start': return 'green';
//             case 'Middle': return 'blue';
//             case 'End': return 'purple';
//             case 'Foot Only': return 'orange';
//             default: return 'red';
//         }
//     };

    
    
//     const DropdownMenu = ({ currentHold, updateHoldType }) => {
//         const handleSelection = (holdType) => {
//             updateHoldType(holdType);
//             setShowDropdown(false); // Hide dropdown after selection
//         };
    
//         return (
//             <div className="dropdown-menu" style={{ top: currentHold.y_coor, left: currentHold.x_coor + 50 }}>
//                 <button onClick={() => handleSelection('Start')}>Start</button>
//                 <button onClick={() => handleSelection('Middle')}>Middle</button>
//                 <button onClick={() => handleSelection('End')}>End</button>
//                 <button onClick={() => handleSelection('Foot Only')}>Foot Only</button>
//             </div>
//         );
//     };
//     // return (
//     //     <div className="kilterBoardContainer">
//     //         <img src={kilter_board} alt="Kilter Board" className="kilter-board" onClick={handleClick} />
//     //         {renderCircles()}
//     //     </div>
//     // );

//     return (
//         <div className="kilterBoardContainer">
//             <img src={kilter_board} alt="Kilter Board" className="kilter-board" onClick={handleClick} />
//             {renderCircles()}
//             {showDropdown && currentHold && <DropdownMenu currentHold={currentHold} updateHoldType={updateHoldType} />}
//         </div>
//     );
    
// }

// export default KilterBoard;




////////////////////////////////////////////////////////////////////////////////////////////////////////

// function KilterBoard() {
//     const [selectedHolds, setSelectedHolds] = useState([]);
    
//     const handleClick = async (e) => {
//         const NUM_GRID_COLUMNS = 35; // Number of columns in the grid
//         const NUM_GRID_ROWS = 38; // Number of rows in the grid
//         const GRID_X_INCREMENT = 1; // Number of pixels between each column
//         const GRID_Y_INCREMENT = 1; // Number of pixels between each row
//         const rect = e.target.getBoundingClientRect();

//         const originalHeight = e.target.naturalHeight;
//         const originalWidth = e.target.naturalWidth;
    
//         // Scaling factor
//         // const scaleY = rect.height / originalHeight;
//         // const scaleX = rect.width / originalWidth;
    
//         // const clickX = (e.clientX - rect.left) / scaleX;
//         // const clickY = (e.clientY - rect.top) / scaleY;

//         // const clickX1 = e.clientX/ scaleX;
//         // const clickY1 = e.clientY/ scaleY;
    

//         const clickX = e.clientX - rect.left; // X coordinate relative to the image
//         const clickY = e.clientY - rect.top; // Y coordinate relative to the image
//         console.log("clickX: ", clickX);
//         console.log("clickY: ", clickY);
//         console.log("e.clientX: ", e.clientX);
//         console.log("e.clientY: ", e.clientY);
//         const cellWidth = rect.width / NUM_GRID_COLUMNS; // Width of one cell
//         const cellHeight = rect.height / NUM_GRID_ROWS; // Height of one cell
    
//         const x = Math.floor(clickX / cellWidth) * GRID_X_INCREMENT;
//         const y = NUM_GRID_ROWS - Math.ceil(clickY / cellHeight) -1;



//         try {
//             // Update this URL to the correct endpoint
//             const url = 'http://localhost:8000/create/identify_hold/';
            
//             const response = await axios.post(url, { x, y });
            
//             if (response.data.success) {
//                 const holdX = response.data.x_coordinate;
//                 const holdY = response.data.y_coordinate;

//                 // Convert grid coordinates back to pixel coordinates
//                 const pixelX = holdX * cellWidth + cellWidth / 2;
//                 const pixelY = (NUM_GRID_ROWS - holdY - 1) * cellHeight + cellHeight / 2;

//                 setSelectedHolds([...selectedHolds, {
//                     id: response.data.holdId,
//                     x_grid: response.data.x_coordinate,
//                     y_grid: response.data.y_coordinate,
//                     x_coor: e.clientX,
//                     y_coor: e.clientY,
//                     hold_type: response.data.type,
//                     hold_function: response.data.function,
//                     hold_depth: response.data.depth,
//                     hold_orientation: response.data.orientation,
//                     hold_size: response.data.size

//                     // x_coor: clickX,
//                     // y_coor: clickY
//                     // x_coor: pixelX,
//                     // y_coor: pixelY
//                     // x_coor: clickX1,
//                     // y_coor: clickY1
//                 }]);
//                 // console.log('Hold identified:', response.data.holdId, response.data.x_coordinate, response.data.y_coordinate, pixelX, pixelY);
//                 console.log('Hold identified:', selectedHolds);
//                 // pass to selectedHolds to backend

//             } else {
//                 console.error('No hold identified:', response.data.message);
//             }
//         } catch (error) {
//             console.error('Error when identifying hold:', error);
//         }
//     };

//     // Function to render circles on selected holds
//     const renderCircles = () => {
//         return selectedHolds.map(hold => (
//             <div 
//                 key={hold.id} 
//                 className="circle" 
//                 style={{ top: hold.y_coor, left: hold.x_coor }} 
//                 // style = {{top: clickX, left: e.clientX}}
//             />
//         ));
//     };

//     return (
//         <div className="kilterBoardContainer">
//             <img src={kilter_board} alt="Kilter Board" className="kilter-board" onClick={handleClick} />
//             {renderCircles()}
//         </div>
//     );
// }

// export default KilterBoard;
















////////////////////////////////////////////////////////////////////////////////////////////////////////

// const Board = ({ numberOfRows, numberOfColumns }) => {
//   const [selectedHold, setSelectedHold] = useState('');
//   const boardRef = useRef();

//   const handleBoardClick = async (event) => {
//     const board = boardRef.current;
//     const rect = board.getBoundingClientRect();
//     const scaleX = board.width / rect.width;   // relationship bitmap vs. element for X
//     const scaleY = board.height / rect.height; // relationship bitmap vs. element for Y

//     const gridX = Math.ceil((event.clientX - rect.left) * scaleX / (board.width / numberOfColumns));
//     const gridY = Math.ceil((event.clientY - rect.top) * scaleY / (board.height / numberOfRows));
    
//     const holdLabel = `${String.fromCharCode(64 + gridY)}${gridX}`;
//     setSelectedHold(holdLabel);
//     try {
//         // Update this URL to the correct endpoint
//         const url = 'http://localhost:8000/create/identify_hold/';
        
//         const response = await axios.post(url, { gridX, gridY });
        
//         if (response.data.success) {
//             setSelectedHold([...selectedHold, {
//                 id: response.data.holdId,
//                 x: response.data.x_coordinate,
//                 y: response.data.y_coordinate
//             }])
//             console.log('Hold identified:', response.data.holdId);
//         } else {
//             console.error('No hold identified:', response.data.message);
//         }
//     } catch (error) {
//         console.error('Error when identifying hold:', error);
//     }
// };

//   return (
//     <div>
//       <img
//         ref={boardRef}
//         src={kilter_board}
//         alt="Kilter Board"
//         onClick={handleBoardClick}
//       />
//       {selectedHold && <p>Selected Hold: {selectedHold}</p>}
//     </div>
//   );
// };

// export default Board;






// function KilterBoard() {
//     const [selectedHolds, setSelectedHolds] = useState([]);

    

//     const handleClick = async (e) => {
//         const NUM_GRID_COLUMNS = 35; // Number of columns in the grid
//         const NUM_GRID_ROWS = 38; // Number of rows in the grid
//         const GRID_X_INCREMENT = 1; // Number of pixels between each column
//         const GRID_Y_INCREMENT = 1; // Number of pixels between each row
//         const rect = e.target.getBoundingClientRect();
//         const clickX = e.clientX - rect.left; // X coordinate relative to the image
//         const clickY = e.clientY - rect.top; // Y coordinate relative to the image
    
//         const cellWidth = rect.width / NUM_GRID_COLUMNS; // Width of one cell
//         const cellHeight = rect.height / NUM_GRID_ROWS; // Height of one cell
    
//         const gridX = Math.floor(clickX / cellWidth) * GRID_X_INCREMENT;
//         // const gridY = Math.floor(clickY / cellHeight) * GRID_Y_INCREMENT;
//         const gridY = (NUM_GRID_ROWS - 1 - Math.floor(clickY / cellHeight)) * GRID_Y_INCREMENT;

    
//         try {
//             // Update this URL to the correct endpoint
//             const url = 'http://localhost:8000/create/identify_hold/';
            
//             const response = await axios.post(url, { gridX, gridY });
            
//             if (response.data.success) {
//                 setSelectedHolds([...selectedHolds, {
//                     id: response.data.holdId,
//                     x: response.data.x_coordinate,
//                     y: response.data.y_coordinate
//                 }])
//                 console.log('Hold identified:', response.data.holdId);
//             } else {
//                 console.error('No hold identified:', response.data.message);
//             }
//         } catch (error) {
//             console.error('Error when identifying hold:', error);
//         }
//     };

    
//     // const handleClick = async (e) => {
//     //     const rect = e.target.getBoundingClientRect();
//     //     const x = e.clientX - rect.left; // x coordinate relative to the image
//     //     const y = e.clientY - rect.top; // y coordinate relative to the image

//     //     try {
//     //         // Update this URL to the correct endpoint
//     //         const url = 'http://localhost:8000/create/identify_hold/';
            
//     //         const response = await axios.post(url, { x, y });
            
//     //         if (response.data.success) {
//     //             setSelectedHolds([...selectedHolds, {
//     //                 id: response.data.holdId,
//     //                 x: response.data.x_coordinate,
//     //                 y: response.data.y_coordinate
//     //             }])
//     //             console.log('Hold identified:', response.data.holdId);
//     //         } else {
//     //             console.error('No hold identified:', response.data.message);
//     //         }
//     //     } catch (error) {
//     //         console.error('Error when identifying hold:', error);
//     //     }
//     // };

//     // Function to render circles on selected holds
//     const renderCircles = () => {
//         return selectedHolds.map(hold => (
//             <div 
//                 key={hold.id} 
//                 className="circle" 
//                 style={{ top: hold.y, left: hold.x }} 
//             />
//         ));
//     };

//     return (
//         <div className="kilterBoardContainer">
//             <img src={kilter_board} alt="Kilter Board" className="kilter-board" onClick={handleClick} />
//             {renderCircles()}
//         </div>
//     );
// }

// export default KilterBoard;



// // import './Create.css'; // Make sure the CSS file is named correctly and imported
// // import kilter_board from '../assets/kilter_board.png';
// // import React, { useState } from 'react';
// // import axios from 'axios';

// // function Create() {
// //     const [selectedHolds, setSelectedHolds] = useState([]);
// //     // ... previous code ...

// //     const renderCircles = () => {
// //         return selectedHolds.map(hold => (
// //         <div 
// //             key={hold.id} 
// //             className="circle" 
// //             style={{ top: hold.y, left: hold.x }} 
// //         />
// //         ));
// //     };

// //     const handleClick = async (e) => {
// //         const rect = e.target.getBoundingClientRect();
// //         const x = e.clientX - rect.left;
// //         const y = e.clientY - rect.top;
    
// //         const response = await axios.post('/api/identify-hold', { x, y });
// //         if (response.data.success) {
// //         setSelectedHolds([...selectedHolds, response.data.holdId]);
// //         }
// //     };
    
// //     // return (
// //     //     <img src={kilter_board} alt="kilter board" className="kilter-board" onClick={handleClick} />
// //     // );
      
// //     return (
// //     <div className="kilterBoardContainer">
// //         <img src={kilter_board} alt="kilter board" className="kilter-board" onClick={handleClick} />
// //         {renderCircles()}
// //     </div>
// //     );
// // }


// // export default Create;


// //   return (
// //     <main className="create-route">
// //       <h1>Climbology</h1>
// //       <div className="content-area">
// //           <img src={kilter_board} alt="kilter board" className="kilter-board" />
// //       </div>
// //     </main>
// //   );

        // const gridY = Math.floor(clickY / cellHeight) * GRID_Y_INCREMENT;
        // const y = (NUM_GRID_ROWS - 1 - Math.floor(clickY / cellHeight)) * GRID_Y_INCREMENT;
                // const rect = e.target.getBoundingClientRect();
        // const x = e.clientX - rect.left; // x coordinate relative to the image
        // const y = e.clientY - rect.top; // y coordinate relative to the image