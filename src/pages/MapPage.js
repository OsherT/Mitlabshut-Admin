import React, { useEffect, useState } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

import {
  Card,
  Paper,
  Grid,
  Button,
  Container,
  Stack,
  getTableSortLabelUtilityClass,
  TextField,
  DialogContentText,
  Box,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Popover,
} from '@mui/material';

import swal from 'sweetalert';
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import Iconify from '../components/iconify';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import Scrollbar from '../components/scrollbar';

// import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
const TABLE_HEAD = [
  { id: 'name', lable: 'שם ', alignRight: true },
  { id: 'address', label: 'כתובת', alignRight: true },
  { id: 'phoneNumber', label: 'מספר טלפון', alignRight: true },
  { id: 'description', label: 'תיאור', alignRight: true },
  { id: 'IGLink', label: ' אינסטגרם', alignRight: true },
  { id: 'FBLink', label: ' פייסבוק', alignRight: true },
  { id: 'id', label: ' ', alignRight: true },
];
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (store) => store.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

const MapPage = (props) => {
  const mapStyles = {
    width: "100%",
    height: 300,
  };

  const [currentLocation, setCurrentLocation] = useState(null);
  const [stores, setstores] = useState([]);
  const [storesTBL, setStoresTBL] = useState([]);

  const [openModal, setOpenModal] = React.useState(false);
  const [selectedStore, setselectedStore] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [editFlag, seteditFlag] = useState(false);

  const [name, setname] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');
  const [description, setdescription] = useState('');
  const [IGLink, setIGLink] = useState('');
  const [FBLink, setFBLink] = useState('');

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [StoreID, setStoreID] = useState('');

  const handleOpenMenu = (event, id) => {
    setOpen(event.currentTarget);
    setStoreID(id);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = storesTBL.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - storesTBL.length) : 0;

  const filteredUsers = applySortFilter(storesTBL, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

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
        const transformedData = res.data.map((store) => {
          return {
            name: store.name,
            address: store.address,
            phoneNumber: store.phone_number,
            description: store.description,
            id: store.store_ID,
            IGLink: store.instegram_link,
            FBLink: store.facebook_link,
          };
        });
        setStoresTBL(transformedData);
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
        const updateStore = {
          store_ID: StoreID,
          name, // Use property shorthand
          address_coordinates: coordinates,
          phone_number: phoneNumber, // Use property shorthand
          description, // Use property shorthand
          instegram_link: IGLink, // Use property shorthand
          facebook_link: FBLink, // Use property shorthand
          opening_hours: 'null',
          address, // Use property shorthand
        };
        if (editFlag === false) {
          axios
            .post('https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Stores/PostStore', newStore)
            .then((response) => {
              swal('!החנות נוספה', 'החנות נוספה בהצלחה וכעת מופיעה על המפה', 'success');
              handleCloseForm();
              GetStores();
            })
            .catch((error) => {
              // Handle the error
              console.error('Error in post NewStore', error);
            });
        } else {
          seteditFlag(false);
          console.log();
          axios
            .put('https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Stores/PutStore', updateStore)
            .then((response) => {
              swal('!החנות עודכנה', 'החנות עודכנה בהצלחה', 'success');
              handleCloseForm();
              GetStores();
              setname("");
              setAddress("");
              setphoneNumber("");
              setdescription("");
              setIGLink("");
              setFBLink("");
            })
            .catch((error) => {
              // Handle the error
              console.error('Error in put NewStore', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error in handleAdd:', error);
      });
  };

  const deleteStore = () => {
    setOpen(null);
    swal({
      title: '?האם את בטוחה',
      text: 'החנות תמחק מהמפה',
      icon: 'warning',
      buttons: ['ביטול', 'כן, למחוק'],
      dangerMode: true,
      content: {
        element: 'div',
        attributes: {
          style: {
            display: 'flex',
            justifyContent: 'center',
          },
        },
      },
    }).then((confirmed) => {
      if (confirmed) {
        axios
          .delete(`https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Stores/DeleteStore/${StoreID}`)
          .then((res) => {
            setOpen(null);
            swal('!נמחק', 'החנות נמחקה בהצלחה', 'success');
            GetStores();
          })
          .catch((err) => {
            console.log('err in deleteStore', err);
          });
      }
    });
  };

  const editStore = () => {
    setOpen(null);
    seteditFlag(true);
    const editstore = stores.find((store) => store.store_ID === StoreID);

    if (editstore) {
      setname(editstore.name);
      setAddress(editstore.address);
      setphoneNumber(editstore.phone_number);
      setdescription(editstore.description);
      setIGLink(editstore.instegram_link);
      setFBLink(editstore.facebook_link);
    }
    handleClickOpenForm();
  };
  return (
    <>
      <Helmet>
        <title>ניהול חנוית על המפה</title>
      </Helmet>
      <div style={{ position: 'relative', height: '400px' }}>
        <div style={{ textAlign: 'left', margin: '10px', marginBottom: '20px' }}>
          <Button className="hvr-glow" variant="outlined" onClick={handleClickOpenForm}>
            <Icon icon="system-uicons:plus" width="20" height="20" />
            הוסיפי חנות חדשה
          </Button>
        </div>
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

        <div
          style={{ position: 'absolute', bottom: '0', left: '0', right: '0', top: '100%', zIndex: '1', margin: '10px' }}
        >
          <Card>
            <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={storesTBL.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />

                  <TableBody>
                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, name, address, phoneNumber, description, IGLink, FBLink } = row;
                      const selectedUser = selected.indexOf(name) !== -1;
                      return (
                        <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                          <TableCell align="right">{name}</TableCell>
                          <TableCell align="right">{address}</TableCell>
                          <TableCell align="right">{phoneNumber}</TableCell>
                          <TableCell align="right">{description}</TableCell>
                          <TableCell align="center">
                            {IGLink !== '' ? (
                              <Typography gutterBottom>
                                <button
                                  onClick={() => handleLinkIcon(IGLink)}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: 10 }}
                                >
                                  <Icon icon="skill-icons:instagram" width="20" height="20" />
                                </button>
                              </Typography>
                            ) : (
                              <TableCell align="center">{''}</TableCell>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {FBLink !== '' ? (
                              <Typography gutterBottom>
                                <button
                                  onClick={() => handleLinkIcon(FBLink)}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: 10 }}
                                >
                                  <Icon icon="logos:facebook" width="20" height="20" />
                                </button>
                              </Typography>
                            ) : (
                              <TableCell align="center">{''}</TableCell>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, row.id)}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>

                  {isNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <Paper
                            sx={{
                              textAlign: 'center',
                            }}
                          >
                            <Typography variant="h6" paragraph>
                              לא נמצא
                            </Typography>

                            <Typography variant="body2">
                              לא נמצאה חנות בשם&nbsp;
                              <strong>{filterName}</strong>
                            </Typography>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={storesTBL.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="שורות לעמוד"
            />
          </Card>
          <Popover
            open={Boolean(open)}
            anchorEl={open}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                p: 1,
                width: 150,
                '& .MuiMenuItem-root': {
                  px: 1,
                  typography: 'body2',
                  borderRadius: 0.75,
                },
              },
            }}
          >
            <MenuItem onClick={editStore}>
              <Iconify icon={'system-uicons:pen'} sx={{ mr: 2 }} />
              {' עריכה '}
            </MenuItem>
            <MenuItem sx={{ color: (theme) => theme.palette.error.main }} onClick={deleteStore}>
              <Iconify icon={'system-uicons:trash'} sx={{ mr: 2 }} />
              {' מחיקת חנות '}
            </MenuItem>
          </Popover>
        </div>
      </div>
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
      <Dialog open={openForm} onClose={handleCloseForm}>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
            '& .Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: 'red' },
          }}
          autoComplete="on"
        >
          <DialogTitle style={{ direction: 'rtl' }}>
            {' '}
            {editFlag === true ? 'עדכני את החנות' : 'הוסיפי חנות חדשה'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText style={{ direction: 'rtl', marginBottom: '20px' }}>
              אנא מלאי את כל השדות הנדרשים
            </DialogContentText>
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                <TextField
                  required
                  value={address}
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
                  value={name}
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
                  value={phoneNumber}
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
                  value={description}
                  id="outlined-basic"
                  label="תיאור החנות"
                  variant="outlined"
                  style={{ direction: 'rtl', marginBottom: '10px' }}
                  InputLabelProps={{ style: { textAlign: 'right' } }}
                  onChange={(event) => setdescription(event.target.value)}
                  error={!description && formError}
                />
                <TextField
                  value={IGLink}
                  id="outlined-basic"
                  label=" קישור לאינסטגרם"
                  variant="outlined"
                  style={{ direction: 'rtl', marginBottom: '10px' }}
                  InputLabelProps={{ style: { textAlign: 'right' } }}
                  onChange={(event) => setIGLink(event.target.value)}
                />
                <TextField
                  value={FBLink}
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
            <Button variant="outlined" className="hvr-bob"onClick={handleCloseForm}>ביטול</Button>
            <Button variant="contained" className="hvr-bob"onClick={handleAdd}>{editFlag === true ? 'עדכון' : 'הוספה '}</Button>
          </DialogActions>
        </Box>
      </Dialog>{' '}
    </>
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCST31DzWK-ecFZQmqeZ7NsSMNWM_CggKQ', // Replace with your actual API key
})(MapPage);
