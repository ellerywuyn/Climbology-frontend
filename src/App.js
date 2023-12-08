import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Create from './components/Create';
import RouteOps from './components/RouteOps';
// import CreateFriend from './components/CreateFriend'; // Ensure this path is correct
// import Chatbot from './chatbot_components/Chatbot'; // Assuming Chatbot.jsx is the component

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        {/* The Routes component wraps all Route components */}
        <Routes>
          {/* Each Route defines a path and the component to render */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/create/:username" element={<Create />} />
          <Route path="/routeops" element={<RouteOps />} />
          {/* <Route path="/create-friend" element={<CreateFriend />} /> */}
          {/* <Route path="/chatbot" element={<Chatbot />} /> */}
          {/* You can add more routes here as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
