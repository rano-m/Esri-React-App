// import logo from './logo.svg';
// import './App.css';
// import { MapView } from './components/MapView';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <MapView></MapView>
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import Map from './components/MapView';
import './App.css'
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My Esri Map App</h1>
      </header>
      <Map />
    </div>
  );
}

export default App;
