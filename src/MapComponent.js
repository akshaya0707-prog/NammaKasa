import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

// Sample looping route in Bangalore
const route = [
  { lat: 12.9716, lng: 77.5946 }, // MG Road
  { lat: 12.9750, lng: 77.6050 }, // Ulsoor
  { lat: 12.9800, lng: 77.6100 }, // Indiranagar
  { lat: 12.9850, lng: 77.6200 }, // Near Domlur
  { lat: 12.9900, lng: 77.6300 }, // HAL area
];

function MapComponent() {
  const [truckPosition, setTruckPosition] = useState(route[0]);
  const setIndex = useState(0)[1];


  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % route.length; // Loop back to start
        setTruckPosition(route[nextIndex]);
        return nextIndex;
      });
    }, 2000); // moves every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={truckPosition} // Center follows truck
        zoom={14}
      >
        {/* Moving Truck Marker */}
        <Marker
          position={truckPosition}
          icon={{
            url: '/truck.png.png', 
            scaledSize: { width: 50, height: 50 },
          }}
        />
      </GoogleMap>
    </LoadScript>
  );
}

export default MapComponent;



