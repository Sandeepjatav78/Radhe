import React, { useState, useRef, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Fix Leaflet Default Icon
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

// Map Controller to Fly to Location
const MapController = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.flyTo(coords, 16);
        }
    }, [coords, map]);
    return null;
};

const LocationPicker = ({ setLocation, onAddressSelect }) => {
    // Load saved location from localStorage or use default
    const [position, setPosition] = useState(() => {
        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation) {
            try {
                const coords = JSON.parse(savedLocation);
                return { lat: coords.lat, lng: coords.lng };
            } catch (e) {
                console.error("Error parsing saved location:", e);
            }
        }
        return { lat: 29.410327, lng: 76.9870635 }; // Default: Radhe Pharmacy
    });
    const [isLocating, setIsLocating] = useState(false);
    const [searchText, setSearchText] = useState("");
    const markerRef = useRef(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load saved location on mount
    useEffect(() => {
        if (isInitialized) return; // Prevent re-running
        
        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation) {
            try {
                const coords = JSON.parse(savedLocation);
                const newPos = { lat: coords.lat, lng: coords.lng };
                setPosition(newPos);
                setLocation(newPos);
                console.log('✅ Saved location loaded:', newPos);
                
                // Fetch address for saved location
                const savedAddress = localStorage.getItem('userAddress');
                if (savedAddress && onAddressSelect) {
                    const addr = JSON.parse(savedAddress);
                    onAddressSelect(addr, false); // Don't show toast on initial load
                    console.log('✅ Saved address loaded:', addr);
                } else {
                    getAddressFromCoords(coords.lat, coords.lng);
                }
            } catch (e) {
                console.error("❌ Error loading saved location:", e);
                localStorage.removeItem('userLocation');
                localStorage.removeItem('userAddress');
            }
        } else {
            console.log('ℹ️ No saved location found, using default pharmacy location');
        }
        setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on mount

    // --- REVERSE GEOCODING (Coords -> Address) ---
    const getAddressFromCoords = async (lat, lng) => {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
            const response = await axios.get(url);
            
            if (response.data) {
                const addr = response.data.address;
                const structuredAddress = {
                    street: addr.road || addr.suburb || addr.neighbourhood || "",
                    city: addr.city || addr.town || addr.village || "",
                    state: addr.state || "",
                    zipcode: addr.postcode || "",
                    country: addr.country || "India"
                };

                // Parent ko data bhejo
                if(onAddressSelect) {
                    onAddressSelect(structuredAddress);
                }
            }
        } catch (error) {
            console.error("Address fetch failed", error);
        }
    };

    // --- 1. Detect GPS Location ---
    const handleGetLocation = () => {
        setIsLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    const newPos = { lat: latitude, lng: longitude };
                    setPosition(newPos);
                    setLocation(newPos);
                    getAddressFromCoords(latitude, longitude);
                    setIsLocating(false);
                },
                (err) => {
                    alert("Location access denied or unavailable.");
                    setIsLocating(false);
                },
                { enableHighAccuracy: true }
            );
        } else {
            alert("Geolocation not supported");
            setIsLocating(false);
        }
    };

    // --- 2. Search Logic ---
    const handleSearch = async () => {
        if (!searchText) return;
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchText}`);
            if (response.data && response.data.length > 0) {
                const { lat, lon } = response.data[0];
                const newPos = { lat: parseFloat(lat), lng: parseFloat(lon) };
                
                setPosition(newPos);
                setLocation(newPos);
                getAddressFromCoords(newPos.lat, newPos.lng);
            } else {
                alert("Location not found.");
            }
        } catch (error) {
            alert("Error searching location.");
        }
    };

    // --- 3. Drag Logic ---
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const newPos = marker.getLatLng();
                    setPosition(newPos);
                    setLocation({ lat: newPos.lat, lng: newPos.lng });
                    getAddressFromCoords(newPos.lat, newPos.lng);
                }
            },
        }),
        [setLocation]
    );

    return (
        <div className='flex flex-col gap-4 w-full'>
            
            {/* Saved Location Indicator */}
            {localStorage.getItem('userLocation') && (
                <div className='bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg flex items-center justify-between text-xs'>
                    <div className='flex items-center gap-2'>
                        <span>💾</span>
                        <span className='text-blue-700 font-medium'>Saved location loaded</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            localStorage.removeItem('userLocation');
                            localStorage.removeItem('userAddress');
                            window.location.reload();
                        }}
                        className='text-blue-600 hover:text-blue-800 underline text-xs'
                    >
                        Clear
                    </button>
                </div>
            )}
            
            {/* Header & Detect Button (Mobile Responsive) */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
                <p className='font-semibold text-gray-700 text-sm'>
                    Pin Delivery Location <span className='text-red-500'>*</span>
                </p>
                <button 
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    className='text-xs bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-sm active:scale-95 disabled:opacity-70 w-full sm:w-auto'
                >
                    {isLocating ? (
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                        <span>📍 Detect Current Location</span>
                    )}
                </button>
            </div>

            {/* Search Bar */}
            <div className='flex gap-2 w-full'>
                <input 
                    type="text" 
                    placeholder="Search (e.g. Model Town, Panipat)" 
                    className='flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all'
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button 
                    type="button" 
                    onClick={handleSearch} 
                    className='bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors'
                >
                    Search
                </button>
            </div>

            {/* Map Container */}
            <div className='h-[250px] sm:h-[300px] w-full border-2 border-gray-100 rounded-xl overflow-hidden relative z-0 shadow-md'>
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
                        <Popup>Deliver Here</Popup>
                    </Marker>
                </MapContainer>
            </div>
            
            <p className='text-[10px] text-gray-500 italic text-center'>
                * Drag marker or use search to pinpoint exact location.
            </p>
        </div>
    );
};

export default LocationPicker;