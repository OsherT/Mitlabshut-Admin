import * as React from 'react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
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
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';
import { TextField, Popover, MenuItem } from '@mui/material';
import { UserListToolbar } from '../sections/@dashboard/user';

import Iconify from './iconify';

export default function ProductsTable(props) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);

  // add new brand
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // search
  const [filterName, setFilterName] = useState('');

  //   edit modal
  const [open, setOpen] = useState(null);
  const [name, setName] = useState(null);

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
            setRows(data.map((item) => ({ name: item.item_type_name })));
          } else if (props.columnName === 'color') {
            setRows(data.map((item) => ({ name: item.color_name })));
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
          alert('הנתון התווסף בהצלחה');
        })
        .catch((err) => {
          console.log('err in handlePostClick', err);
        });
      setInputValue('');
      setIsAdding(false);
    }
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
    },
  ];

  function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell>

          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
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

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  function EnhancedTableToolbar() {
    // const { numSelected } = props;

    const handleInputChange = (event) => {
      setInputValue(event.target.value);
    };

    const handleAddClick = () => {
      setIsAdding(true);
    };

    const handleCancleClick = () => {
      setInputValue('');
      setIsAdding(false);
    };

    return (
      <Toolbar
      //     sx={{
      //       pl: { sm: 2 },
      //       pr: { xs: 1, sm: 1 },
      //       ...(numSelected > 0 && {
      //         bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
      //       }),
      //     }}
      >
        {
          <>
            {isAdding && (
              <TextField
                label="הקלידי..."
                dir="rtl"
                value={inputValue}
                onChange={handleInputChange}
                sx={{ flex: '1 1 100%', direction: 'rtl' }}
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
                  <IconButton onClick={handleCancleClick}>
                    <Iconify icon={'carbon:close'} sx={{ mr: 2 }} />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Tooltip title="הוספה">
                <IconButton onClick={handleAddClick}>
                  <Iconify icon={'gala:add'} sx={{ mr: 2 }} />
                </IconButton>
              </Tooltip>
            )}
          </>
        }
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
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

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

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const EditName = () => {
    console.log('EditName', name);
  };

  const DeleteName = () => {
    const confirmDelete = window.confirm(`האם את בטוחה? \nיתכן וימחקו פריטים לצמיתות`);

    if (confirmDelete) {
      axios
        .delete(props.deleteApi + name)
        .then((res) => {
          GetList();
          alert(`${name} was deleted successfully.`);
        })
        .catch((err) => {
          console.log('DeleteName error', err);
        });
    }
    setOpen(null);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
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

          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
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
                const isItemSelected = isSelected(row.name);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.name)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell align="right">
                      <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, row.name)}>
                        <Iconify icon={'eva:more-vertical-fill'} />
                      </IconButton>
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                      {row.name}
                    </TableCell>

                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
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
            onClick={() => EditName(name)}
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
      </Paper>
    </Box>
  );
}
