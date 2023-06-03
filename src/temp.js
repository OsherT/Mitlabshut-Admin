import * as React from 'react';
import { useEffect, useState } from 'react';
import { ChromePicker } from 'react-color';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';
import swal from 'sweetalert';
import { TextField, Popover, MenuItem, Modal, Button } from '@mui/material';
import { UserListToolbar } from '../sections/@dashboard/user';
import firebase, { storage } from '../firebaseConfig';

import Iconify from './iconify';

export default function ProductsTable(props) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);

  // add new input
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // search
  const [filterName, setFilterName] = useState('');

  //  input modal
  const [open, setOpen] = useState(null);
  const [name, setName] = useState(null);
  const [sentenceID, setSentenceID] = useState(null);

  // edit modal
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');

  // type modal
  const [isEditingType, setIsEditingType] = useState(false);
  const [openTypeModal, setOpenTypeModal] = useState(null);
  const [isAddingType, setIsAddingType] = useState(false);
  const [typeImage, setTypeImage] = useState('');
  // const [newTypeImage, setNewTypeImage] = useState(false);

  // color modal
  const [isEditingColor, setIsEditingColor] = useState(false);
  const [colorName, setColorName] = useState('');
  const [openColorModal, setOpenColorModal] = useState(null);
  const [isAddingColor, setIsAddingColor] = useState(false);

  // fireBase
  const difPic =
    'https://images.squarespace-cdn.com/content/v1/5beb55599d5abb5a47cc4907/1610465905997-2G8SGHXIYCGTF9BQB0OD/female+girl+woman+icon.jpg?format=500w';

  const [selectedFile, setSelectedFile] = useState(null);
  const [imageLink, setImageLink] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [typeImageModal, settypeImageModal] = useState(false);
  const [chosenPhoto, setchosenPhoto] = useState('');
  const [chosenPhotoName, setchosenPhotoName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ffffff');

  useEffect(() => {
    GetList();
  }, []);

  const GetList = () => {
    fetch(props.getApi, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        Accept: 'application/json; charset=UTF-8',
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then(
        (data) => {
          if (props.columnName === 'brand') {
            setRows(data.map((item) => ({ name: item.brand_name })));
          } else if (props.columnName === 'category') {
            setRows(data.map((item) => ({ name: item.category_name })));
          } else if (props.columnName === 'size') {
            setRows(data.map((item) => ({ name: item.size_name })));
          } else if (props.columnName === 'type') {
            setRows(data.map((item) => ({ name: item.item_type_name, image: item.item_type_image })));
          } else if (props.columnName === 'color') {
            setRows(data.map((item) => ({ name: item.color_name, color: item.color })));
          } else if (props.columnName === 'content') {
            setRows(data.map((item) => ({ id: item.id, name: item.content })));
          }
        },
        (error) => {
          console.log('GetList error', error);
        }
      );
  };

  const handlePostClick = () => {
    if (inputValue === '') {
      alert('אנא מלאי את השדות הנדרשים');
    } else {
      axios
        .post(props.postApi + inputValue)
        .then((res) => {
          GetList();
          alert(`${inputValue} נוסף בהצלחה`);
        })
        .catch((err) => {
          console.log('err in handlePostClick', err);
        });
      setInputValue('');
      setIsAdding(false);
    }
  };

  // fireBase
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const fileUrl = URL.createObjectURL(file);
    setSelectedFile(fileUrl);
  };

  const handleUploadImage = () => {
    if (selectedFile) {
      setUploading(true);
      const storageRef = storage.ref();
      const imagesRef = storageRef.child('AppImages');
      const imageRef = imagesRef.child(selectedFile.name);

      imageRef
        .put(selectedFile)
        .then(() => {
          alert('Image uploaded successfully: yay!');
          return imageRef.getDownloadURL();
        })
        .then((downloadURL) => {
          setImageLink(downloadURL);
          // Use DefImage variable as needed
          postImgDatebase();
          setUploading(false);
        })
        .catch((error) => {
          alert('Error uploading image:', error);
          setUploading(false);
        });
    } else {
      console.error('No file selected.');
    }
  };

  const postImgDatebase = () => {
    setUploading(true);
    axios
      .post(
        `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/PostItem_type?Item_type_name=${inputValue}&Item_type_image=${difPic}`
      )
      .then((res) => {
        GetList();
        alert(`${inputValue} נוסף בהצלחה`);
        setOpenTypeModal(null);
        setUploading(false);
      })

      .catch((err) => {
        alert('err in postImgDatebase', err);
      });
    setInputValue('');
    setImageLink('');
    handleCancelClick();
  };

  const handleOpenMenuType = (event, name, image) => {
    setOpen(event.currentTarget);
    setName(name);
    setSelectedFile(image);
  };

  const handleEditType = () => {
    //  need first to upload to FB and after to DB

    axios
      .put(
        `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/updateItemType?OldTypeName=${name}&NewTypeName=${editedName}&TypePic=${selectedFile}`
      )
      .then((res) => {
        console.log('res', res);
        alert(`${name} התעדכן בהצלחה`);
        GetList();
      })
      .catch((err) => {
        alert('err in handleEditType', err);
      });
    setEditedName('');
    setIsAdding(false);
  };


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

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const headCells = [
    {
      id: 'name',
      numeric: false,
      disablePadding: true,
      label: 'שם',
      alignLeft: true,
    },
  ];
  if (props.columnName === 'color') {
    headCells.push({
      id: 'color',
      numeric: false,
      disablePadding: true,
      label: 'צבע',
    });
  }
  if (props.columnName === 'type') {
    headCells.push({
      id: 'type',
      numeric: false,
      disablePadding: true,
      label: 'תמונה',
    });
  }
  function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <text>{}</text>
          </TableCell>

          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={'left'}
              padding={'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  const handleAddClick = (name) => {
    if (name === 'type') {
      setIsAddingType(true);
    } else if (name === 'color') {
      alert(name);
    } else {
      setIsAdding(true);
    }
  };

  const handleCancelClick = () => {
    setInputValue('');
    setIsAdding(false);

    setIsAddingType(false);
    setOpenTypeModal(false);
    setOpenColorModal(false);

    setIsEditing(false);
    setOpen(null);
    setEditedName('');

    setSelectedFile(null);
  };

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  function EnhancedTableToolbar() {
    const handleInputChange = (event) => {
      setInputValue(event.target.value);
    };

    return (
      <Toolbar>
        {isAdding && (
          <TextField
            label="הקלידי..."
            dir="rtl"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            sx={{ flex: '1 1 100%', direction: 'rtl' }}
            autoFocus // Add this line to auto-focus the input field
          />
        )}

        {isAdding ? (
          <>
            <Tooltip title="הוסיפי">
              <IconButton onClick={handlePostClick}>
                <Iconify icon={'eva:checkmark-outline'} sx={{ mr: 2 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="ביטול">
              <IconButton onClick={handleCancelClick}>
                <Iconify icon={'carbon:close'} sx={{ mr: 2 }} />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <Tooltip title="הוספה">
            <IconButton onClick={() => handleAddClick(props.columnName)}>
              <Iconify icon={'gala:add'} sx={{ mr: 2 }} />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    );
  }

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const filteredRows = React.useMemo(() => {
    return rows.filter((row) => row.name.includes(filterName));
  }, [rows, filterName]);

  const sortedRows = React.useMemo(() => {
    return stableSort(filteredRows, getComparator(order, orderBy));
  }, [filteredRows, order, orderBy]);

  const visibleRows = React.useMemo(() => {
    return sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedRows, page, rowsPerPage]);

  const handleOpenMenu = (event, name) => {
    setOpen(event.currentTarget);
    setName(name);
  };

  const handleOpenMenuSentens = (event, name, id) => {
    setOpen(event.currentTarget);
    setName(name);
    setSentenceID(id);
  };
  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleEdit = () => {
    setOpen(null);
    EditName();
  };

  const EditName = () => {
    // const confirmUpdate = window.confirm(`האם את בטוחה? \nיתכן וישתנו פריטים לצמיתות`);

    // if (confirmUpdate) {
    if (editedName !== '') {
      axios
        .put(`${props.updateApi}${name}&New${props.columnName}Name=${editedName}`)
        .then((res) => {
          setIsEditing(false);
          GetList();
          alert(`${name} הנתון התעדכן בהצלחה ${editedName}.`);
          setEditedName('');
        })
        .catch((err) => {
          console.log('EditName error', err);
        });
      // }
    } else {
      alert('אנא ודאי שמילאת פרטים עדכניים');
    }
  };

  const DeleteName = () => {
    const confirmDelete = window.confirm(`האם את בטוחה? \nיתכן וימחקו פריטים לצמיתות`);

    if (confirmDelete) {
      axios
        .delete(props.columnName === 'content' ? props.deleteApi + sentenceID : props.deleteApi + name)
        .then((res) => {
          GetList();
          alert(`${name} נמחק בהצלחה`);
        })
        .catch((err) => {
          console.log('DeleteName error', err);
        });
    }
    setOpen(null);
  };

  return (
    <Card>
      <Box sx={{ width: 'auto' }}>
        <Paper>
          <TableContainer component={Paper}>
            {/* search bar + add icon */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {!isAdding && (
                <UserListToolbar
                  numSelected={selected.length}
                  filterName={filterName}
                  onFilterName={handleFilterByName}
                />
              )}
              <EnhancedTableToolbar />
            </Box>

            <Table>
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  return (
                    <TableRow hover key={row.name} sx={{ cursor: 'pointer' }}>
                      <TableCell align="left">
                        {props.columnName !== 'content' && props.columnName !== 'type' && (
                          <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, row.name)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        )}
                        {props.columnName === 'content' && (
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={(event) => handleOpenMenuSentens(event, row.name, row.id)}
                          >
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        )}
                        {props.columnName === 'type' && (
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={(event) => handleOpenMenuType(event, row.name, row.image)}
                          >
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        )}
                      </TableCell>
                      <TableCell padding="none">{row.name}</TableCell>
                      {props.columnName === 'color' && (
                        <TableCell padding="none">
                          <Box
                            sx={{
                              width: '60px',
                              height: '60px',
                              backgroundColor: row.color,
                              display: 'inline-block',
                              verticalAlign: 'middle',
                              borderRadius: '30%',
                              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.3)',
                            }}
                          />
                        </TableCell>
                      )}
                      {props.columnName === 'type' && (
                        <TableCell padding="none">
                          <img
                            src={row.image}
                            alt={row.name}
                            style={{
                              width: '77px',
                              height: '77px',
                              transition: 'transform 0.3s',
                            }}
                            onMouseOver={(e) => {
                              e.target.style.transform = 'scale(1.7)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = 'scale(1)';
                            }}
                            onFocus={(e) => {
                              e.target.style.transform = 'scale(1.7)';
                            }}
                            onBlur={(e) => {
                              e.target.style.transform = 'scale(1)';
                            }}
                          />
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={1} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="שורות לעמוד"
          />
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
            <MenuItem
              sx={{
                color: 'success.main',
              }}
              onClick={() => {
                if (props.columnName === 'type') {
                  setIsEditingType(true);
                } else {
                  setIsEditing(true);
                }
              }}
            >
              <Iconify icon={'carbon:edit'} sx={{ mr: 2 }} color={'success.main'} />
              {'עריכה '}
            </MenuItem>

            <MenuItem
              sx={{
                color: 'error.main',
              }}
              onClick={DeleteName}
            >
              <Iconify icon={'mdi-light:delete'} sx={{ mr: 2 }} color={'error.main'} />
              {'מחיקה '}
            </MenuItem>
          </Popover>
          <Modal
            open={isEditing}
            onClose={() => setIsEditing(false)}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
                width: '300px',
                textAlign: 'center',
              }}
            >
              <h2 id="modal-title">עריכה</h2>
              <TextField
                label="שם"
                defaultValue={name}
                onChange={(event) => setEditedName(event.target.value)}
                fullWidth
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 2,
                }}
              >
                <Button variant="contained" sx={{ bgcolor: 'red' }} onClick={handleCancelClick}>
                  ביטול
                </Button>
                <Button variant="contained" sx={{ bgcolor: 'green' }} onClick={handleEdit}>
                  שמירה
                </Button>
              </Box>
            </Box>
          </Modal>

          {/* מודל הוספת סוג פריט */}
          <Modal
            open={isAddingType}
            onClose={() => setIsAddingType(false)}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
                width: '400px',
                textAlign: 'center',
              }}
            >
              <h2 id="modal-title">הוספת סוג פריט</h2>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <TextField
                  label="שם"
                  onChange={(event) => setInputValue(event.target.value)}
                  style={{ width: '200px' }}
                />
                <Button
                  component="label"
                  htmlFor="file-upload"
                  className="custom-file-upload"
                  style={{ backgroundColor: 'gray', color: 'white', marginTop: 30 }}
                >
                  {selectedFile ? 'החליפי תמונה' : ' בחרי תמונה'}
                  <input id="file-upload" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                </Button>
              </div>

              {selectedFile && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '200px',
                    marginTop: '20px',
                  }}
                >
                  <img
                    src={selectedFile}
                    alt="התמונה שנבחרה"
                    style={{
                      width: '200px',
                      height: '200px',
                      display: 'block',
                    }}
                  />
                </div>
              )}

              {/* {uploading ? (
                <div
                  style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 10,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      border: '4px solid #f3f3f3',
                      borderTop: '4px solid #3498db',
                      borderRadius: '50%',
                      width: 30,
                      height: 30,
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                  <span
                    style={{
                      marginLeft: 10,
                      color: 'black',
                      fontSize: 16,
                    }}
                  >
                    העלאת לוקחת זמן
                  </span>
                </div>
              ) : null} */}

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 5,
                }}
              >
                <Button variant="contained" sx={{ bgcolor: 'red' }} onClick={handleCancelClick}>
                  ביטול
                </Button>

                <Button
                  variant="contained"
                  sx={{ bgcolor: 'green' }}
                  onClick={() => {
                    if (inputValue === '' || selectedFile === null) {
                      alert('אנא מלאי את השדות הנדרשים');
                    } else {
                      // handleUploadImage();
                      postImgDatebase();
                    }
                  }}
                >
                  העלי
                </Button>
              </Box>
            </Box>
          </Modal>
        </Paper>
      </Box>
    </Card>
  );
}
