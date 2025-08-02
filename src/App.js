import React from 'react';
import TopBar from './TopBar';
import MapComponent from './MapComponent'; // ✅ Make sure this is correct
import ChatBot from './chatBot';
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

      {/* ✅ Chatbot Integration */}
      {/* This div positions the chatbot. Adjust 'bottom-0', 'right-0', 'w-full', 'md:w-1/3', 'h-1/2', 'md:h-full'
          to fit how you want the chatbot to appear on your screen. */}
      <div className="fixed bottom-0 right-0 w-full md:w-1/3 h-1/2 md:h-full bg-white shadow-lg z-50 flex flex-col rounded-tl-lg">
        <ChatBot /> {/* ✅ Render the ChatBot component */}
      </div>
    </div>
  );
}
export default App;
