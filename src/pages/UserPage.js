import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import axios from 'axios';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Box,
} from '@mui/material';
// components
import { Icon } from '@iconify/react';
import Tooltip from '@mui/material/Tooltip';

import Label from '../components/label';

import Iconify from '../components/iconify';

import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'userImage', lable: '', alignRight: true },
  { id: 'fullName', label: 'שם מלא', alignRight: true },
  { id: 'email', label: 'מייל', alignRight: true },
  { id: 'age', label: 'גיל', alignRight: true },
  { id: 'phoneNumber', label: 'מספר טלפון', alignRight: true },
  { id: 'userStatus', label: 'סטטוס', alignRight: true },
  { id: 'isAdmin', label: 'מנהלת', alignRight: true },
  { id: '' },
  
];
// ----------------------------------------------------------------------

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
    return filter(array, (_user) => _user.fullName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  useEffect(() => {
    getUserList();
  }, []);
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [userList, setuserList] = useState([]);

  const [status, setstatus] = useState('');

  const [userID, setuserID] = useState('');

  const [isAdmin, setisAdmin] = useState('');

  const handleOpenMenu = (event, status, id, isAdmin) => {
    setOpen(event.currentTarget);
    setstatus(status);
    setuserID(id);
    console.log(isAdmin);
    setisAdmin(isAdmin);
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
      const newSelecteds = userList.map((n) => n.fullName);
      const selectedIds = userList.map((n) => n.id);
      console.log(selectedIds);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  function getUserList() {
    axios
      .get(`https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/User/GetUser`)
      .then((res) => {
        const transformedData = res.data.map((user) => {
          return {
            fullName: user.full_name,
            email: user.email,
            age: user.age,
            phoneNumber: user.phone_number,
            status: user.user_Status,
            id: user.id,
            userImage: user.user_image,
            isAdmin: user.is_admin,
          };
        });
        setuserList(transformedData);
      })
      .catch((err) => {
        console.log('err in getUserList', err);
      });
  }
  const BlockOrActiveUser = () => {
    axios
      .put(`https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/User/PutUserStatus?UserID=${userID}`)
      .then((res) => {
        setOpen(null);
        getUserList();
      })
      .catch((err) => {
        console.log('err in BlockOrActiveUser', err);
      });
  };

  const ChangeIsAdmin = () => {
    axios
      .put(`https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/User/PutUserAdminFiled?UserID=${userID}`)
      .then((res) => {
        setOpen(null);
        getUserList();
      })
      .catch((err) => {
        console.log('err in ChangeIsAdmin', err);
      });
  };
  return (
    <>
      <Helmet>
        <title> ניהול משתמשות </title>
      </Helmet>

      <Container >
        <Card sx={{ backgroundColor: '#ede6d7'  }}>
          <Box sx={{ display: 'flex', alignItems: 'right', justifyContent: 'flex-end' }}>
            <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
          </Box>

          <Scrollbar>
            <TableContainer sx={{  minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={userList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, fullName, email, status, phoneNumber, userImage, age, isAdmin } = row;
                    const selectedUser = selected.indexOf(fullName) !== -1;
                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell align="right">
                          <Avatar alt={fullName} src={userImage} sx={{ margin: '10px' }} />
                        </TableCell>
                        <TableCell align="right">{fullName}</TableCell>
                        <TableCell align="right">{email}</TableCell>
                        <TableCell align="right">{age}</TableCell>
                        <TableCell align="right">{phoneNumber}</TableCell>

                        <TableCell align="right">
                          <Label color={status === 'non active' ? 'error' : 'success'}>
                            {status === 'non active' ? 'החשבון אינו פעיל' : 'החשבון פעיל'}
                          </Label>
                        </TableCell>
                        <TableCell align="right">
                          {isAdmin && (
                            <Tooltip>
                              <IconButton size="large" color="inherit" disabled>
                                <Icon icon="material-symbols:admin-panel-settings-outline" color="#d7ba7b" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={(event) => handleOpenMenu(event, row.status, row.id, row.isAdmin)}
                          >
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
                            לא נמצאה משתמשת העונה לשם&nbsp;
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
            count={userList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="שורות לעמוד"
          />
        </Card>
      </Container>

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
            color: status === 'non active' ? 'success.main' : 'error.main',
          }}
          onClick={BlockOrActiveUser}
        >
          <Iconify
            icon={status === 'non active' ? 'system-uicons:user-add' : 'system-uicons:no-sign'}
            sx={{ mr: 2 }}
            color={status === 'non active' ? 'success.main' : 'error.main'}
          />
          {status === 'non active' ? 'החזירי לפעילות ' : 'חסמי חשבון'}
        </MenuItem>
        <MenuItem
          sx={{
            color: isAdmin === false ? 'success.main' : 'error.main',
          }}
          onClick={ChangeIsAdmin}
        >
          <Iconify
            icon={isAdmin === false ? 'subway:admin-1' : 'subway:admin-2'}
            sx={{ mr: 2 }}
            color={isAdmin === false ? 'success.main' : 'error.main'}
          />
          {isAdmin === false ? ' הוסיפי כמנהלת' : 'הסירי כמנהלת '}
        </MenuItem>
      </Popover>
    </>
  );
}
