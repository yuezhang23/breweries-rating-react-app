import React from 'react';
import './App.css';
import Project from './Project';
import {HashRouter} from "react-router-dom";
import {Routes, Route} from "react-router";

function App() {
   return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/*" element={<Project />} />
        </Routes>
      </div>
    </HashRouter>
);}
export default App;

/* function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App; */
