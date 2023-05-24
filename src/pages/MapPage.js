import React, { useEffect, useState } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import { Helmet } from 'react-helmet-async';
import { Grid, Button, Container, Stack, Typography } from '@mui/material';
import Iconify from '../components/iconify';

const MapPage = (props) => {
  const mapStyles = {
    width: 800,
    height: 400,
  };

  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    // Get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>מפה</title>
      </Helmet>
      <Container>
        <Stack direction="column" spacing={2}>
          {currentLocation && (
            <Map
              google={props.google}
              zoom={12}
              style={mapStyles}
              initialCenter={currentLocation}
              language="he"

            />
          )}
        </Stack>
      </Container>
    </>
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCoTMkSU4546Qd8K7z9GRE2SQXs_62MF0I', // Replace with your actual API key
})(MapPage);
