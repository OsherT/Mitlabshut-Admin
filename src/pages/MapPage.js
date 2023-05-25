import React, { useEffect, useState } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Grid, Button, Container, Stack, Typography, getTableSortLabelUtilityClass } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Icon } from '@iconify/react';

const MapPage = (props) => {
  const mapStyles = {
    width: 800,
    height: 400,
  };

  const [currentLocation, setCurrentLocation] = useState(null);
  const [stores, setstores] = useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedStore, setselectedStore] = useState('');
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
  const handleMarkerPress = (store) => {
    // Handle marker press event
    setOpenModal(true);
    setselectedStore(store);
    console.log(store);
  };
  function handleLinkIcon(link) {
    window.open(link, '_blank');
  }
  const openWaze = (address) => {
    const [latitude, longitude] = address.split(', ');
    const parsedLatitude = parseFloat(latitude);
    const parsedLongitude = parseFloat(longitude);
    const wazeURL = `https://waze.com/ul?ll=${parsedLatitude},${parsedLongitude}&navigate=yes`;
    window.open(wazeURL);
  };
  return (
    <>
      <Helmet>
        <title>מפה</title>
      </Helmet>
      <Container>
        <Stack direction="column" spacing={2}>
          {currentLocation && stores && (
            <Map language="he" google={props.google} zoom={15} style={mapStyles} initialCenter={currentLocation}>
              {currentLocation && (
                <Marker
                  position={currentLocation}
                  icon={{
                    url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                  }}
                  title="המיקום שלי"
                />
              )}
              {stores.map((store, index) => {
                const [latitude, longitude] = store.address_coordinates.split(', ');
                const parsedLatitude = parseFloat(latitude);
                const parsedLongitude = parseFloat(longitude);

                if (Number.isNaN(parsedLatitude) || Number.isNaN(parsedLongitude)) {
                  // Handle the case when the coordinates are invalid
                  console.log('Invalid coordinates for store:', store);
                  return null;
                }
                return (
                  <Marker
                    key={index}
                    position={{ lat: parsedLatitude, lng: parsedLongitude }}
                    onClick={() => handleMarkerPress(store)}
                  />
                );
              })}
            </Map>
          )}
        </Stack>
      </Container>
      <Dialog onClose={() => setOpenModal(false)} open={openModal}>
        <DialogTitle sx={{ textAlign: 'right' }} onClose={() => setOpenModal(false)}>
          {selectedStore.name}
        </DialogTitle>
        <DialogContent dividers sx={{ textAlign: 'right' }}>
          <Typography gutterBottom>
            <strong>כתובת:</strong> {selectedStore.address}
          </Typography>
          <Typography gutterBottom>
            <strong>מספר טלפון:</strong> {selectedStore.phone_number}
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <Typography gutterBottom>
                <button
                  onClick={() => openWaze(selectedStore.address_coordinates)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: 10 }}
                >
                  <Icon icon="simple-icons:waze"  width="40" height="40" />
                </button>
              </Typography>
            {selectedStore.facebook_link !== null ? (
              <Typography gutterBottom>
                <button
                  onClick={() => handleLinkIcon(selectedStore.facebook_link)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: 10 }}
                >
                  <Icon icon="logos:facebook" width="40" height="40" />
                </button>
              </Typography>
            ) : null}
            {selectedStore.instegram_link !== null ? (
              <Typography gutterBottom>
                <button
                  onClick={() => handleLinkIcon(selectedStore.instegram_link)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: 10 }}
                >
                  <Icon icon="skill-icons:instagram" width="40" height="40" />
                </button>
              </Typography>
            ) : null}
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setOpenModal(false)}>
            יציאה
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCST31DzWK-ecFZQmqeZ7NsSMNWM_CggKQ', // Replace with your actual API key
})(MapPage);
