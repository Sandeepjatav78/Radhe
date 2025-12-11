import React, { useState, useRef, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Fix default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper to fly to location
const MapController = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.flyTo(coords, 16);
        }
    }, [coords, map]);
    return null;
};

const LocationPicker = ({ setLocation }) => {
    const [position, setPosition] = useState({ lat: 20.5937, lng: 78.9629 });
    const [addressText, setAddressText] = useState("India"); // Address dikhane ke liye
    const [searchText, setSearchText] = useState("");
    const markerRef = useRef(null);

    // --- Function: Coordinates se Address nikalo (Reverse Geocoding) ---
    const getAddressFromCoords = async (lat, lng) => {
        try {
            setAddressText("Fetching address...");
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
            const response = await axios.get(url);
            if (response.data && response.data.display_name) {
                setAddressText(response.data.display_name); // Set Text
            }
        } catch (error) {
            setAddressText("Address not found");
        }
    };

    // --- 1. Get GPS Location ---
    const handleGetLocation = () => {
        if (navigator.geolocation) {
            setAddressText("Locating you...");
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    const newPos = { lat: latitude, lng: longitude };
                    setPosition(newPos);
                    setLocation(newPos);
                    getAddressFromCoords(latitude, longitude); // Address bhi fetch karo
                },
                (err) => {
                    alert("Could not detect location. Please use search.");
                },
                { enableHighAccuracy: true }
            );
        }
    };

    // --- 2. Search Logic ---
    const handleSearch = async () => {
        if (!searchText) return;
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchText}`);
            if (response.data && response.data.length > 0) {
                const { lat, lon, display_name } = response.data[0];
                const newPos = { lat: parseFloat(lat), lng: parseFloat(lon) };
                
                setPosition(newPos);
                setLocation(newPos);
                setAddressText(display_name); // Set searched address
            } else {
                alert("Location not found.");
            }
        } catch (error) {
            alert("Error searching location.");
        }
    };

    // --- 3. Drag Logic (Sabse Important) ---
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const newPos = marker.getLatLng();
                    setPosition(newPos);
                    setLocation({ lat: newPos.lat, lng: newPos.lng });
                    // Jaise hi drag khatam ho, naya address pata karo
                    getAddressFromCoords(newPos.lat, newPos.lng);
                }
            },
        }),
        [setLocation]
    );

    return (
        <div className='flex flex-col gap-3 mb-6'>
            <div className='flex justify-between items-end'>
                <p className='font-semibold text-gray-700'>
                    Delivery Location <span className='text-red-500'>*</span>
                </p>
                <button 
                    type="button"
                    onClick={handleGetLocation}
                    className='text-xs bg-emerald-700 text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-emerald-800'
                >
                    📍 Detect My Location
                </button>
            </div>

            {/* Search Bar */}
            <div className='flex gap-2'>
                <input 
                    type="text" 
                    placeholder="Type area (e.g. Model Town, Panipat)" 
                    className='border border-gray-300 rounded px-2 py-1.5 w-full text-sm outline-emerald-500'
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button type="button" onClick={handleSearch} className='bg-gray-800 text-white px-3 py-1.5 rounded text-sm'>
                    Search
                </button>
            </div>

            {/* Map Area */}
            <div className='h-[350px] w-full border-2 border-emerald-100 rounded-lg overflow-hidden relative z-0'>
                <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapController coords={position} />
                    <Marker 
                        position={position} 
                        draggable={true} 
                        eventHandlers={eventHandlers}
                        ref={markerRef}
                    >
                        <Popup>Drag me to adjust!</Popup>
                    </Marker>
                </MapContainer>
            </div>
            
            {/* --- LIVE ADDRESS FEEDBACK (Blinkit Style) --- */}
            <div className='bg-emerald-50 p-3 rounded border border-emerald-100'>
                <p className='text-xs text-gray-500 font-bold uppercase'>Selected Location:</p>
                <p className='text-sm text-gray-800 mt-1 font-medium leading-snug'>
                    {addressText}
                </p>
            </div>
        </div>
    );
};

export default LocationPicker;