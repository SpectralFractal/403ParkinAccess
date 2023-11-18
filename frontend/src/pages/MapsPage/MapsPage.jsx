import React, { useEffect, useState } from "react";
import style from "./MapsPage.module.css";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Navbar from "../../Components/Navbar/Navbar.jsx";
function MapsPage(props) {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [selectedParkingSpot, setSelectedParkingSpot] = useState();

  useEffect(() => {
    if (selectedParkingSpot) {
      console.log(selectedParkingSpot);
    }
  }, [selectedParkingSpot]);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        setError("Unable to retrieve your location");
      },
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const containerStyle = {
    width: "90vw",
    height: "60vh",
    borderRadius: "10px",
    border: "2px solid #4c259a",
  };

  const center = {
    lat: location.latitude,
    lng: location.longitude,
  };

  const [customIcon, setCustomIcon] = useState(null);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setCustomIcon({
        url: "public/parking.png",
        scaledSize: new window.google.maps.Size(50, 50),
      });
    }
  }, []);

  const parkingSpots = [
    {
      markerPosition: {
        lat: 45.78683277642652,
        lng: 24.141338272887467,
      },
      name: "Parcare Camin 2",
    },
    {
      markerPosition: {
        lat: 45.790008588121744,
        lng: 24.146733951768724,
      },
      name: "Parcare Inginerie ",
    },
  ];

  console.log(parkingSpots);

  // function sleep(ms) {
  //     return new Promise(resolve => setTimeout(resolve, ms));
  // }
  // async function run() {
  //     console.log('Sleeping for 2 seconds...');
  //     await sleep(2000);  // Sleep for 2000 milliseconds (2 seconds)
  //     console.log('Woke up!');
  // }
  //
  // run();

  return (
      <div className={style.wrapper}>
        <LoadScript
          googleMapsApiKey={"AIzaSyD7gA9N5aUDcKPmPeNoFwVZOT5HTMAR8Co"}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
          >
            {parkingSpots.map((spot, index) => {
              return (
                <div
                  key={index}
                  onClick={() => setSelectedParkingSpot(spot[index].name)}
                >
                  <Marker
                    position={spot.markerPosition}
                    icon={customIcon}
                    title={"Parcare C2"}
                  />
                </div>
              );
            })}
          </GoogleMap>
        </LoadScript>
        <div className={style.section}>
          {selectedParkingSpot ? (
            { selectedParkingSpot }
          ) : (
            <p>Selecteaza un loc de parcare</p>
          )}
        </div>
      </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default MapsPage;
