import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import kilter_board from '../assets/kilter_board.png'; // Ensure the path is correct
import './RouteOps.css'; // Make sure the CSS file is named correctly and imported
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const RouteOps = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { holds, response } = location.state || {};
    // console.log(holds);
    // console.log("response", response);
    // console.log("response.result", response.result);

    // State variables
    const [selectedHoldId, setSelectedHoldId] = useState('');
    const [selectedHoldProperty, setSelectedHoldProperty] = useState('');
    const [holdValue, setHoldValue] = useState('');
    const [selectedMoveType, setSelectedMoveType] = useState('');
    const [selectedMoveProperty, setSelectedMoveProperty] = useState('');
    const [moveValue, setMoveValue] = useState('');
    const [outputFindHoldsByProperty, setOutputFindHoldsByProperty] = useState('');
    // ... similar state variables for other inputs

    const handleHoldIdChange = (event) => {
        setSelectedHoldId(event.target.value);
    };

    // Function to handle the change in hold property dropdown
    const handleHoldPropertyChange = (event) => {
        setSelectedHoldProperty(event.target.value);
    };

    // Function to handle the change in hold value input
    const handleHoldValueChange = (event) => {
        setHoldValue(event.target.value);
    };

    // Function to handle the change in move type dropdown
    const handleMoveTypeChange = (event) => {
        setSelectedMoveType(event.target.value);
    };

    // Function to handle the change in move property dropdown
    const handleMovePropertyChange = (event) => {
        setSelectedMoveProperty(event.target.value);
    };

    // Function to handle the change in move value input
    const handleMoveValueChange = (event) => {
        setMoveValue(event.target.value);
    };


    // Event handler for updating holds
    const handleUpdateHold = async () => {
        try {
            const res = await axios.post('http://localhost:8000/routeops/update_hold/', { 
                holdId: selectedHoldId, 
                property: selectedHoldProperty, 
                value: holdValue 
            });
            console.log(res.data); // handle the response
        } catch (error) {
            console.error(error); // handle the error
        }
    };

    // Event handler for deleting holds
    const handleDeleteHold = async () => {
        try {
            const res = await axios.post('http://localhost:8000/routeops/delete_hold/', {
                holdId: selectedHoldId
            });
            console.log(res.data); // handle the response
        } catch (error) {
            console.error(error); // handle the error
        }
    };

    // Event handler for deleting moves
    const handleDeleteMove = async () => {
        try {
            const res = await axios.post('http://localhost:8000/routeops/delete_move/', {
                moveType: selectedMoveType
            });
            console.log(res.data); // handle the response
        } catch (error) {
            console.error(error); // handle the error
        }
    };

    // Event handler for finding nodes by property
    const handleFindHoldsByProperty = async () => {
        try {
            const res = await axios.post('http://localhost:8000/routeops/find_holds_by_property/', {
                property: selectedHoldProperty,
                value: holdValue
            });
            const data = await response.json(); // handle the response
            setOutputFindHoldsByProperty(data);
            console.log(res.data);
        } catch (error) {
            console.error(error); // handle the error
        }
    };






    
    // Event handler for finding moves by property
    const handleFindMovesByProperty = async () => {
        try {
            const res = await axios.post('http://localhost:8000/routeops/find_moves_by_property/', {
                property: selectedMoveProperty,
                value: moveValue
            });
            console.log(res.data); // handle the response
        } catch (error) {
            console.error(error); // handle the error
        }
    };


    // Function to get unique keys from the holds objects
    const getHoldKeys = () => {
        if (holds && holds.length > 0) {
            return Object.keys(holds[0]);
        }
        return [];
    };

    const holdKeys = getHoldKeys();

    return (
        <>
        <div>
            <h1>Update Holds</h1>
            <select name="hold_id" className="hold_id" onChange={handleHoldIdChange}>
                {holds && holds.map(hold => (
                    <option key={hold.id} value={hold.id}>
                        {`Hold ID: ${hold.id}`}
                    </option>
                ))}
            </select>
            <select name="hold_property" className="hold_property" onChange={handleHoldPropertyChange}>
                {holdKeys.map((key, index) => (
                    <option key={index} value={key}>
                        {key}
                    </option>
                ))}
            </select>
            <input type="text" name="hold_value" className="hold_value" onChange={handleHoldValueChange}/>
            <button type="submit" className="submit" onClick={handleUpdateHold}>Confirm</button>
        </div>

        <div>
            <h1>Delete Holds</h1>
            <select name="hold_id" className="hold_id" onChange = {handleHoldIdChange}>
                {holds && holds.map(hold => (
                    <option key={hold.id} value={hold.id}>
                        {`Hold ID: ${hold.id}`}
                    </option>
                ))}
            </select>
            <button type="submit" className="submit" onClick={handleDeleteHold}>Confirm</button>
        </div>
        <div>
            <h1>Delete Moves</h1>
            <select name="move_type" className="move_type" onChange = {handleMoveTypeChange}>
                {response && response.result && response.result.beta && response.result.beta.map((move, index) => (
                    <option key={index} value={move.move_type}>
                        {`Move Type: ${move.move_type}`}
                    </option>
                ))}
            </select>
            <button type="submit" className="submit" onClick={handleDeleteMove}>Confirm</button>
        </div>

        <div>
            <h1>Find Holds by Property</h1>
            <select name="hold_property" className="hold_property" onChange = {handleHoldPropertyChange}>
                {holdKeys.map((key, index) => (
                    <option key={index} value={key}>
                        {key}
                    </option>
                ))}
            </select>
            <input type="text" name="hold_value" className="hold_value" onChange = {handleHoldValueChange}/>
            <button type="submit" className="submit" onClick={handleFindHoldsByProperty}>Confirm</button>
            <p>{outputFindHoldsByProperty}</p>
        </div>

        <div>
            <h1>Find Moves by Property</h1>
            <select name="move_type" className="move_type" onChange = {handleMovePropertyChange}>
                {response && response.result && response.result.beta && response.result.beta.map((move, index) => (
                    <option key={index} value={move.move_type}>
                        {`Move Type: ${move.move_type}`}
                    </option>
                ))}
            </select>
            <input type="text" name="move_value" className="move_value" onChange = {handleMoveValueChange}/>
            <button type="submit" className="submit" onClick={handleFindMovesByProperty}>Confirm</button>
        </div>
        </>
    );
}

export default RouteOps;
