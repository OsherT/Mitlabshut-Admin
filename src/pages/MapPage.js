import React, { useEffect, useState } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import {
  Grid,
  Button,
  Container,
  Stack,
  Typography,
  getTableSortLabelUtilityClass,
  TextField,
  DialogContentText,
  Box,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Icon } from '@iconify/react';
import swal from 'sweetalert';
// import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

const MapPage = (props) => {
  const mapStyles = {
    width: 800,
    height: 300,
  };

  const [currentLocation, setCurrentLocation] = useState(null);
  const [stores, setstores] = useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedStore, setselectedStore] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [formError, setFormError] = useState('');

  const [name, setname] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');
  const [description, setdescription] = useState('');
  const [IGLink, setIGLink] = useState('');
  const [FBLink, setFBLink] = useState('');

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
  const handleClickOpenForm = () => {

    setOpenForm(true);
  };
  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleAdd = () => {
    if (!address || !name || !phoneNumber || !description) {
      setFormError('אופס... נראה ששכחת למלא כמה שדות');
      return;
    }
    axios
      .get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address,
          key: 'AIzaSyBjqIEpWLM9SXgDWMBohWB6eI4v5oKfDpw',
        },
      })
      .then((response) => {
        const result = response.data.results[0];
        const { lat, lng } = result.geometry.location;
        console.log('Latitude:', lat);
        console.log('Longitude:', lng);
        const coordinates = `${lat}, ${lng}`; // Use template literal for string concatenation
        const newStore = {
          store_ID: 0,
          name, // Use property shorthand
          address_coordinates: coordinates,
          phone_number: phoneNumber, // Use property shorthand
          description, // Use property shorthand
          instegram_link: IGLink, // Use property shorthand
          facebook_link: FBLink, // Use property shorthand
          opening_hours: 'null',
          address, // Use property shorthand
        };
        axios
          .post('https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Stores/PostStore', newStore)
          .then((response) => {
            swal("החנות נוספה!", "החנות נוספה בהצלחה וכעת מופיעה ל המפה", "success")
            handleCloseForm();
            GetStores();
          })
          .catch((error) => {
            // Handle the error
            console.error('Error in post NewStore', error);
          });
      })
      .catch((error) => {
        console.error('Error in handleAdd:', error);
      });
  };

  return (
    <>
      <Helmet>
        <title>מפה</title>
      </Helmet>
      <Container>
        <>
          <div style={{ textAlign: 'left', margin: '10px', marginBottom: '20px' }}>
            <Button variant="outlined" onClick={handleClickOpenForm}>
              <Icon icon="system-uicons:plus" width="20" height="20" />
              הוסיפי חנות חדשה
            </Button>
          </div>
        </>
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

      {/* storeModal */}
      <Dialog onClose={() => setOpenModal(false)} open={openModal}>
        <DialogTitle sx={{ textAlign: 'right' }} onClose={() => setOpenModal(false)}>
          {selectedStore.name}
          {console.log(selectedStore)}
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
                <Icon icon="simple-icons:waze" width="40" height="40" />
              </button>
            </Typography>
            {selectedStore.facebook_link !== '' ? (
              <Typography gutterBottom>
                <button
                  onClick={() => handleLinkIcon(selectedStore.facebook_link)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: 10 }}
                >
                  <Icon icon="logos:facebook" width="40" height="40" />
                </button>
              </Typography>
            ) : null}
            {selectedStore.instegram_link !== '' ? (
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

      {/* formModal */}
      <div>
        <Dialog open={openForm} onClose={handleCloseForm}>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
              '& .Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: 'red' },
            }}
            autoComplete="on"
          >
            <DialogTitle style={{ direction: 'rtl' }}>הוספת חנות חדשה למפה</DialogTitle>
            <DialogContent>
              <DialogContentText style={{ direction: 'rtl', marginBottom: '20px' }}>
                אנא מלאי את כל השדות הנדרשים
              </DialogContentText>
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                  <TextField
                    required
                    id="outlined-basic"
                    label=" רחוב, מספר, עיר"
                    variant="outlined"
                    style={{ direction: 'rtl', marginBottom: '10px' }}
                    InputLabelProps={{ style: { textAlign: 'right' } }}
                    onChange={(event) => setAddress(event.target.value)}
                    error={!address && formError}
                  />
                  <TextField
                    required
                    id="outlined-basic"
                    label="שם החנות"
                    variant="outlined"
                    style={{ direction: 'rtl', marginBottom: '10px' }}
                    InputLabelProps={{ style: { textAlign: 'right' } }}
                    onChange={(event) => setname(event.target.value)}
                    error={!name && formError}
                  />

                  {/* <GooglePlacesAutocomplete
                  apiKey="AIzaSyCC_m2Abha709pWgqBMxqBiQuCb2P2qnyw"
                  language="he"
                  country="il"
                  coordinates="true" // Remove the value from the coordinates prop
                  placeholder="חיפוש מיקום..."
                  // onSelect={handlePlaceSelected}
                /> */}
                  <TextField
                    required
                    id="outlined-basic"
                    label="מספר טלפון"
                    variant="outlined"
                    style={{ direction: 'rtl', marginBottom: '10px' }}
                    InputLabelProps={{ style: { textAlign: 'right' } }}
                    onChange={(event) => setphoneNumber(event.target.value)}
                    error={!phoneNumber && formError}
                  />
                  <TextField
                    required
                    id="outlined-basic"
                    label="תיאור החנות"
                    variant="outlined"
                    style={{ direction: 'rtl', marginBottom: '10px' }}
                    InputLabelProps={{ style: { textAlign: 'right' } }}
                    onChange={(event) => setdescription(event.target.value)}
                    error={!description && formError}
                  />
                  <TextField
                    id="outlined-basic"
                    label=" קישור לאינסטגרם"
                    variant="outlined"
                    style={{ direction: 'rtl', marginBottom: '10px' }}
                    InputLabelProps={{ style: { textAlign: 'right' } }}
                    onChange={(event) => setIGLink(event.target.value)}
                  />
                  <TextField
                    id="outlined-basic"
                    label=" קישור לפייסבוק"
                    variant="outlined"
                    style={{ direction: 'rtl', marginBottom: '10px' }}
                    InputLabelProps={{ style: { textAlign: 'right' } }}
                    onChange={(event) => setFBLink(event.target.value)}
                  />
                  {/* Add more TextField components for other inputs */}
                </div>
                {formError && <Box sx={{ color: 'red', margin: '10px', textAlign: 'right' }}>{formError}</Box>}
              </>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseForm}>ביטול</Button>
              <Button onClick={handleAdd}>הוסיפי</Button>
            </DialogActions>
          </Box>
        </Dialog>
      </div>
    </>
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCST31DzWK-ecFZQmqeZ7NsSMNWM_CggKQ', // Replace with your actual API key
})(MapPage);
