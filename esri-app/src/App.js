import React from 'react';
import Map from './components/MapView';
import Search from './components/MapComponent'
import './App.css'
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>DDEO School Locator</h1>
      </header>
    <Map/>
      {/* <Search/> */}
    </div>
  );
}

export default App;
