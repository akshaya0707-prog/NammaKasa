import React from 'react';
import TopBar from './TopBar';
import MapComponent from './MapComponent'; // ✅ Make sure this is correct

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      

      {/* ✅ Top Bar */}
      <TopBar />

      {/* ✅ Main Content */}
      <main className="flex-grow bg-gray-100 p-6">
        {/* ✅ Actual Map Component */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-2">Live Map</h2>
          <MapComponent />
        </div>

        {/* ✅ Route & Schedule */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-2">Route & Schedule Panel</h2>
          <p>This is where your routes and schedules will go.</p>
        </div>
      </main>
    </div>
  );
}

export default App;
