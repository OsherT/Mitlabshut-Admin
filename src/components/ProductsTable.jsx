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
import Swal from 'sweetalert2';

import { TextField, Popover, MenuItem, Modal, Button, Container } from '@mui/material';
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
  const [newTypeIMG, setNewTypeIMG] = useState(false);

  // color modal

  const [openColorModal, setOpenColorModal] = useState(null);

  // fireBase
  const difPic =
    'https://images.squarespace-cdn.com/content/v1/5beb55599d5abb5a47cc4907/1610465905997-2G8SGHXIYCGTF9BQB0OD/female+girl+woman+icon.jpg?format=500w';

  const [selectedFile, setSelectedFile] = useState(null);
  const [imageLink, setImageLink] = useState(null);

  const [typeImageModal, settypeImageModal] = useState(false);
  const [chosenPhoto, setchosenPhoto] = useState('');
  const [chosenPhotoName, setchosenPhotoName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ffffff');

  useEffect(() => {
    GetList();
    handleCancelClick();
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
      handleCancelClick();
      Swal.fire({
        title: 'אנא מלאי את השדות הנדרשים',
        icon: 'error',
        confirmButtonText: 'אוקיי',
      });
    } else {
      axios
        .post(props.postApi + inputValue)
        .then((res) => {
          GetList();
          Swal.fire({
            title: `${inputValue} נוסף בהצלחה`,
            icon: 'success',
            confirmButtonText: 'אוקיי', // Change the button text to 'אוקיי'
          });
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
    setNewTypeIMG(true);

    const file = event.target.files[0];
    const fileUrl = URL.createObjectURL(file);
    setSelectedFile({
      file,
      url: fileUrl,
    });
  };

  const handleUploadImage = () => {
    if (selectedFile && selectedFile.file) {
      const storageRef = storage.ref();
      const imagesRef = storageRef.child('AppImages');
      const fileName = encodeURIComponent(selectedFile.file.name);
      const imageRef = imagesRef.child(fileName);

      imageRef
        .put(selectedFile.file)
        .then(() => {
          console.log('Image uploaded successfully to FB!');
          return imageRef.getDownloadURL();
        })
        .then((downloadURL) => {
          if (isEditingType) {
            handleEditType(downloadURL);
          } else {
            postTypeDatabase(downloadURL);
          }
        })
        .catch((error) => {
          console.log('Error uploading image:', error);
        });
    } else {
      console.error('No file selected.');
    }
  };

  const postTypeDatabase = (link) => {
    const typeOBJ = {
      item_type_image: link,
      item_type_name: inputValue,
    };

    axios
      .post(`https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/PostItem_type`, typeOBJ)
      .then((res) => {
        GetList();
        Swal.fire({
          title: `${inputValue} נוסף בהצלחה`,
          icon: 'success',
          confirmButtonText: 'אוקיי', // Change the button text to 'אוקיי'
        });
        setOpenTypeModal(null);
      })

      .catch((err) => {
        console.log('err in postTypeDatabase', err);
        Swal.fire({
          title: 'נתון זה כבר קיים במערכת',
          icon: 'error',
          confirmButtonText: 'אוקיי', // Change the button text to 'אוקיי'
        });
      });

    handleCancelClick();
    setInputValue('');
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
          <TableCell padding="checkbox" sx={{ backgroundColor: '#FFF4E4' }}>
            <text>{}</text>
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              padding={'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
              align={props.columnName === 'content' ? 'right' : 'left'}
              sx={{ backgroundColor: '#FFF4E4' }}
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
      setOpenColorModal(true);
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
    setIsEditingType(false);
    setImageLink(null);
    setNewTypeIMG(false);
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
    setEditedName(name);
  };

  const handleOpenMenuSentens = (event, name, id) => {
    setOpen(event.currentTarget);
    setName(name);
    setEditedName(name);
    setSentenceID(id);
  };

  const handleOpenMenuType = (event, name, image) => {
    setOpen(event.currentTarget);
    setName(name);
    setEditedName(name);
    setSelectedFile(image);
  };

  const handleOpenMenuColor = (event, name, color) => {
    setOpen(event.currentTarget);
    setName(name);
    setSelectedColor(color);
    setEditedName(name);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleEdit = () => {
    setOpen(null);
    EditName();
    setEditedName(name);
  };

  const handleEditType = (link) => {
    const typeObjNew = {
      item_type_image: link,
      item_type_name: name,
    };

    axios
      .put(`https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/updateItemType?NewName=${editedName}`, typeObjNew)
      .then((res) => {
        Swal.fire({
          title: 'המידע התעדכן בהצלחה',
          icon: 'success',
          confirmButtonText: 'אוקיי',
        });
        GetList();
      })
      .catch((err) => {
        Swal.fire({
          title: 'קיימת בעיה בשרת, אנא נסי שוב מאוחר יותר',
          icon: 'error',
          confirmButtonText: 'אוקיי', // Change the button text to 'אוקיי'
        });
      });
    handleCancelClick();
  };

  const handleImageClicked = (url, name) => {
    settypeImageModal(true);
    setchosenPhoto(url);
    setchosenPhotoName(name);
  };

  const EditName = () => {
    if (props.columnName !== 'color' && props.columnName !== 'content') {
      axios
        .put(`${props.updateApi}${name}&New${props.columnName}Name=${editedName}`)
        .then((res) => {
          setIsEditing(false);
          GetList();
          Swal.fire({
            title: 'עודכן בהצלחה',
            icon: 'success',
            confirmButtonText: 'אוקיי',
          });
          setEditedName('');
        })
        .catch((err) => {
          setOpen(false);
          Swal.fire({
            title: 'קיימת בעיה בשרת, אנא נסי שוב מאוחר יותר',
            icon: 'error',
            confirmButtonText: 'אוקיי', // Change the button text to 'אוקיי'
          });
          console.log('EditName error', err);
        });
      // }
    } else if (props.columnName === 'content') {
      axios
        .put(`${props.updateApi}${sentenceID}&content=${editedName}`)
        .then((res) => {
          setIsEditing(false);
          GetList();
          Swal.fire({
            title: 'עודכן בהצלחה',
            icon: 'success',
            confirmButtonText: 'אוקיי',
          });
          setEditedName('');
        })
        .catch((err) => {
          Swal.fire({
            title: 'קיימת בעיה בשרת, אנא נסי שוב מאוחר יותר',
            icon: 'error',
            confirmButtonText: 'אוקיי', // Change the button text to 'אוקיי'
          });
          console.log('EditName error', err);
        });
    } else {
      console.log(
        `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/updateItemColor?OldColorName=${name}&NewColorName=${editedName}&ColorCode=${encodeURIComponent(
          selectedColor
        )}`
      );
      axios
        .put(
          `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/updateItemColor?OldColorName=${name}&NewColorName=${editedName}&ColorCode=${encodeURIComponent(
            selectedColor
          )}`
        )
        .then((res) => {
          setIsEditing(false);
          GetList();
          Swal.fire({
            title: 'עודכן בהצלחה',
            icon: 'success',
            confirmButtonText: 'אוקיי',
          });
          setEditedName('');
        })
        .catch((err) => {
          Swal.fire({
            title: 'קיימת בעיה בשרת, אנא נסי שוב מאוחר יותר',
            icon: 'error',
            confirmButtonText: 'אוקיי', // Change the button text to 'אוקיי'
          });
          console.log('EditName error', err);
        });
    }
  };

  const DeleteName = () => {
    Swal.fire({
      title: 'האם את בטוחה?',
      text: 'לא תוכלי לשחזר את המידע שנמחק!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'כן',
      cancelButtonText: 'ביטול',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(props.columnName === 'content' ? props.deleteApi + sentenceID : props.deleteApi + name)
          .then((res) => {
            GetList();
            Swal.fire({
              title: `${name} נמחק בהצלחה`,
              icon: 'success',
              confirmButtonText: 'אוקיי', // Change the button text to 'אוקיי'
            });
          })
          .catch((err) => {
            Swal.fire({
              title: 'קיימת בעיה בשרת, אנא נסי שוב מאוחר יותר',
              icon: 'error',
              confirmButtonText: 'אוקיי', // Change the button text to 'אוקיי'
            });
            console.log('DeleteName error', err);
          });
      }
      handleCancelClick();
    });

    // if (confirmDelete) {
    //   axios
    //     .delete(props.columnName === 'content' ? props.deleteApi + sentenceID : props.deleteApi + name)
    //     .then((res) => {
    //       GetList();
    //       swal(`${name} נמחק בהצלחה`, '', 'success');
    //     })
    //     .catch((err) => {
    //       console.log('DeleteName error', err);
    //     });
    // }
    setOpen(null);
  };

  const AddColor = () => {
    const encodedColorCode = encodeURIComponent(selectedColor);

    axios
      .post(
        `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/PostColor?item_color=${inputValue}&color=${encodedColorCode}`
      )
      .then((res) => {
        GetList();
        Swal.fire({
          title: '!הצבע נוסף',
          text: `הצבע ${inputValue} נוסף בהצלחה`,
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'אוקיי', // Change the button text to 'אוקיי'
        });
        handleCancelClick();
      })
      .catch((err) => {
        Swal.fire({
          title: 'קיימת בעיה בשרת, אנא נסי שוב מאוחר יותר',
          icon: 'error',
          confirmButtonText: 'אוקיי', // Change the button text to 'אוקיי'
        });
      });
  };
  return (
    <>
      <Card>
        <Box sx={{ width: 'auto' }}>
          <Paper>
            <TableContainer component={Paper}>
              {/* search bar + add icon */}
              <Box
                sx={{ display: 'flex', alignItems: 'right', justifyContent: 'flex-end', backgroundColor: '#FFEAD8' }}
              >
                {!isAdding && (
                  <UserListToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                    sx={{ color: 'white' }}
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
                  columnName={props.columnName}
                />
                <TableBody>
                  {visibleRows.map((row, index) => {
                    return (
                      <TableRow hover key={row.name} sx={{ cursor: 'pointer', backgroundColor: 'white' }}>
                        <TableCell>
                          {props.columnName !== 'content' &&
                            props.columnName !== 'type' &&
                            props.columnName !== 'color' && (
                              <IconButton
                                size="large"
                                color="inherit"
                                onClick={(event) => handleOpenMenu(event, row.name)}
                              >
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
                          {props.columnName === 'color' && (
                            <IconButton
                              size="large"
                              color="inherit"
                              onClick={(event) => handleOpenMenuColor(event, row.name, row.color)}
                            >
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          )}
                        </TableCell>

                        <TableCell
                          align={props.columnName === 'content' ? 'right' : 'left'}
                          padding={props.columnName === 'content' ? '5px' : 'none'}
                        >
                          {row.name}
                        </TableCell>

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
                            <Button
                              className="hvr-grow"
                              style={{
                                border: 'none',
                                padding: 0,
                                background: 'none',
                                cursor: 'pointer',
                              }}
                              onClick={() => handleImageClicked(row.image, row.name)}
                            >
                              <img
                                src={row.image}
                                alt={row.name}
                                style={{
                                  width: '77px',
                                  height: '77px',
                                  borderRadius: '10%',
                                }}
                              />
                            </Button>
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
              sx={{ backgroundColor: '#FFEAD8' }}
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

            {/* מודל עריכת פרטים */}
            <Modal
              open={isEditing}
              onClose={() => {
                setIsEditing(false);
              }}
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
              BackdropProps={{ onClick: null }} // Disable closing the modal when clicking outside
              disableEscapeKeyDown // Disable closing the modal when pressing Escape key
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
                  width: props.columnName === 'content' ? '600px' : '300px',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column ',
                  gap: 1,
                }}
              >
                <h2 id="modal-title">עריכת פרטים</h2>
                <TextField
                  label="שם"
                  defaultValue={name}
                  onChange={(event) => setEditedName(event.target.value)}
                  fullWidth
                  inputProps={{ dir: 'rtl' }}
                />
                {props.columnName === 'color' && (
                  <>
                    <ChromePicker
                      disableAlpha
                      color={selectedColor}
                      onChange={(color) => setSelectedColor(color.hex)}
                    />
                    <div
                      style={{
                        width: '75px',
                        height: '75px',
                        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.3)',
                        borderRadius: '10%',
                        background: selectedColor,
                      }}
                    />
                  </>
                )}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 2,
                    gap: 1,
                  }}
                >
                  <Button
                    variant="contained"
                    className="hvr-bob"
                    sx={{
                      bgcolor: 'red',
                      '&:hover': {
                        bgcolor: 'red', // Keep the same color on hover
                      },
                    }}
                    onClick={handleCancelClick}
                  >
                    ביטול
                  </Button>
                  <Button
                    variant="contained"
                    className="hvr-bob"
                    sx={{
                      bgcolor: 'green',
                      '&:hover': {
                        bgcolor: 'green', // Keep the same color on hover
                      },
                    }}
                    onClick={handleEdit}
                  >
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
              BackdropProps={{ onClick: null }} // Disable closing the modal when clicking outside
              disableEscapeKeyDown // Disable closing the modal when pressing Escape key
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
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column ',
                  gap: 1,
                }}
              >
                <h2 id="modal-title">הוספת סוג פריט</h2>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <TextField
                    label="שם"
                    onChange={(event) => setInputValue(event.target.value)}
                    style={{ width: '200px' }}
                    InputLabelProps={{
                      shrink: true,
                      position: 'end',
                    }}
                    inputProps={{ dir: 'rtl' }} // Set the input direction to RTL
                  />

                  <Button
                    className="hvr-bob"
                    variant="contained"
                    sx={{
                      bgcolor: 'gray',
                      '&:hover': {
                        bgcolor: 'gray', // Keep the same color on hover
                      },
                    }}
                    component="label"
                    htmlFor="file-upload"
                    style={{ marginTop: 30 }}
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
                      src={selectedFile.url}
                      alt="התמונה שנבחרה"
                      style={{
                        width: '200px',
                        height: '200px',
                        display: 'block',
                      }}
                    />
                  </div>
                )}

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 5,
                    gap: 1,
                  }}
                >
                  <Button
                    className="hvr-bob"
                    variant="contained"
                    sx={{
                      bgcolor: 'red',
                      '&:hover': {
                        bgcolor: 'red', // Keep the same color on hover
                      },
                    }}
                    onClick={handleCancelClick}
                  >
                    ביטול
                  </Button>

                  <Button
                    className="hvr-bob"
                    variant="contained"
                    sx={{
                      bgcolor: 'green',
                      '&:hover': {
                        bgcolor: 'green', // Keep the same color on hover
                      },
                    }}
                    onClick={() => {
                      if (inputValue === '' || selectedFile === null) {
                        handleCancelClick();
                        Swal.fire({
                          title: 'אנא מלאי את השדות הנדרשים',
                          icon: 'warning',
                          confirmButtonColor: '#3085d6',
                          confirmButtonText: 'אוקיי', // Change the button text to 'אוקיי'
                        });
                      } else {
                        handleUploadImage();
                      }
                    }}
                  >
                    שמרי
                  </Button>
                </Box>
              </Box>
            </Modal>

            {/* מודל עדכון סוג פריט */}
            <Modal
              open={isEditingType}
              onClose={() => setIsEditingType(false)}
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
              BackdropProps={{ onClick: null }} // Disable closing the modal when clicking outside
              disableEscapeKeyDown // Disable closing the modal when pressing Escape key
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
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column ',
                  gap: 1,
                }}
              >
                <h2 id="modal-title">עדכון סוג פריט</h2>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <TextField
                    label="שם"
                    defaultValue={name}
                    onChange={(event) => setEditedName(event.target.value)}
                    style={{ width: '200px' }}
                    inputProps={{ dir: 'rtl' }} // Set the input direction to RTL
                    InputLabelProps={{
                      shrink: true,
                      position: 'end',
                    }}
                  />
                  <Button
                    component="label"
                    htmlFor="file-upload"
                    className="custom-file-upload"
                    style={{ backgroundColor: 'gray', color: 'white', marginTop: 30 }}
                  >
                    החליפי תמונה
                    <input id="file-upload" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                  </Button>
                </div>

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
                    // src={selectedFile}
                    src={newTypeIMG ? selectedFile.url : selectedFile}
                    alt="התמונה שנבחרה"
                    style={{
                      width: '200px',
                      height: '200px',
                      display: 'block',
                    }}
                  />
                </div>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 5,
                    gap: 1,
                  }}
                >
                  <Button variant="contained" sx={{ bgcolor: 'red' }} onClick={handleCancelClick}>
                    ביטול
                  </Button>

                  <Button
                    variant="contained"
                    sx={{ bgcolor: 'green' }}
                    onClick={() => {
                      if (newTypeIMG) {
                        handleUploadImage();
                      } else {
                        handleEditType(selectedFile);
                      }
                    }}
                  >
                    שמרי
                  </Button>
                </Box>
              </Box>
            </Modal>

            {/* מודל הוספת צבע */}
            <Modal
              open={openColorModal}
              onClose={() => setOpenColorModal(false)}
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
              BackdropProps={{ onClick: null }} // Disable closing the modal when clicking outside
              disableEscapeKeyDown // Disable closing the modal when pressing Escape key
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
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column ',
                  gap: 1,
                }}
              >
                <h2 id="modal-title">הוספת צבע</h2>
                <TextField
                  label="שם"
                  inputProps={{ dir: 'rtl' }}
                  onChange={(event) => setInputValue(event.target.value)}
                  InputLabelProps={{
                    shrink: true,
                    position: 'end',
                  }}
                />
                <ChromePicker disableAlpha color={selectedColor} onChange={(color) => setSelectedColor(color.hex)} />
                <div
                  style={{
                    width: '75px',
                    height: '75px',
                    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.3)',
                    borderRadius: '10%',
                    background: selectedColor,
                  }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 1,
                  }}
                >
                  <Button
                    className="hvr-bob"
                    variant="contained"
                    sx={{
                      bgcolor: 'red',
                      '&:hover': {
                        bgcolor: 'red', // Keep the same color on hover
                      },
                    }}
                    onClick={handleCancelClick}
                  >
                    ביטול
                  </Button>
                  <Button
                    className="hvr-bob"
                    variant="contained"
                    sx={{
                      bgcolor: 'green',
                      '&:hover': {
                        bgcolor: 'green',

                        // Keep the same color on hover
                      },
                    }}
                    onClick={() => {
                      if (inputValue === '' || selectedColor === '#ffffff') {
                        handleCancelClick();
                        Swal.fire({
                          title: 'אנא מלאי את השדות הנדרשים',
                          icon: 'warning',
                          confirmButtonColor: '#3085d6',
                          confirmButtonText: 'אוקיי',
                        });
                      } else {
                        AddColor();
                      }
                    }}
                  >
                    שמרי
                  </Button>
                </Box>
              </Box>
            </Modal>

            {/* מודל הצגת תמונת סוג פריט */}
            <Modal
              open={typeImageModal}
              onClose={() => settypeImageModal(false)}
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
            >
              <Box
                sx={{
                  position: 'absolute',
                  display: 'flex',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  bgcolor: 'background.paper',
                  border: '2px solid #000',
                  boxShadow: 24,
                  p: 4,
                  width: '300px',
                  textAlign: 'center',
                  alignItems: 'center',
                  flexDirection: 'column ',
                }}
              >
                <h2 id="modal-title">{chosenPhotoName}</h2>
                <img
                  src={chosenPhoto}
                  alt={chosenPhotoName}
                  style={{
                    maxWidth: '80%',
                    maxHeight: '80%',
                    borderRadius: '10%',
                  }}
                />
                <Button style={{ marginTop: 40 }} onClick={() => settypeImageModal(false)}>
                  <Iconify icon={'ph:x-thin'} />
                </Button>
              </Box>
            </Modal>
          </Paper>
        </Box>
      </Card>
    </>
  );
}
