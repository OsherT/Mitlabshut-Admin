import React, { useEffect, useState } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import axios from 'axios';

import { Helmet } from 'react-helmet-async';
import { Grid, Button, Container, Stack, Typography, getTableSortLabelUtilityClass } from '@mui/material';
import Iconify from '../components/iconify';

const MapPage = (props) => {
  const mapStyles = {
    width: 800,
    height: 400,
  };

  const [currentLocation, setCurrentLocation] = useState(null);
  const [stores, setstores] = useState([]);
  useEffect(() => {
    // Get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
      });
    }
    GetStores();
  }, []);
  function GetStores() {
    axios
      .get(`https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Stores/Get`)
      .then((res) => {
        console.log(res.data);
        setstores(res.data);
      })
      .catch((err) => {
        console.log('err in GetStores', err);
      });
  }

  return (
    <>
      <Helmet>
        <title>מפה</title>
      </Helmet>
      <Container>
        <Stack direction="column" spacing={2}>
          {currentLocation &&stores&& (
            <Map language="hebrew" google={props.google} zoom={15} style={mapStyles} initialCenter={currentLocation}>
              {currentLocation && (
                <Marker
                  position={currentLocation}
                  icon={{
                    url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                  }}
                  title="המיקום שלי"
                />
              )}
              {/* {stores.map((store, index) => {
                const [latitude, longitude] = store.address_coordinates.split(', ');
                const parsedLatitude = parseFloat(latitude);
                const parsedLongitude = parseFloat(longitude);

                if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
                  // Handle the case when the coordinates are invalid
                  console.log('Invalid coordinates for store:', store);
                } else {
                  return (
                    <Marker
                      key={index}
                      position={{ lat: parsedLatitude, lng: parsedLongitude }}
                      onClick={() => handleMarkerPress(store)}
                    />
                  );
                }
              })} */}
            </Map>
          )}
        </Stack>
      </Container>
    </>
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCoTMkSU4546Qd8K7z9GRE2SQXs_62MF0I', // Replace with your actual API key
})(MapPage);
