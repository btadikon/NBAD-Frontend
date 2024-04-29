import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableRow, TableHead } from '@mui/material';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';



const StyledTableCell = ({ children }) => (
  <TableCell style={{ color: 'black', fontSize: 14, fontFamily: 'Arial, sans-serif' }}>{children}</TableCell>
);
const StyledTableCellForHeader = ({ children }) => (
  <TableCell style={{ color: 'white', fontSize: 14, fontFamily: 'Arial, sans-serif' }}>{children}</TableCell>
);

const StyledTableRow = ({ children }) => (
  <TableRow style={{ backgroundColor: 'white', color: 'black' }}>{children}</TableRow>
);

const PaginationButton = ({ active, onClick, children }) => (
  <span
    style={{
      cursor: 'pointer',
      padding: '8px',
      margin: '0 4px',
      border: '1px solid',
      borderRadius: '4px',
      backgroundColor: active ? 'blue' : 'transparent',
      color: active ? 'white' : 'black',
    }}
    onClick={onClick}
  >
    {children}
  </span>
);

const CustomizedTables = ({ columns, data, removeUrCategoryFromBudget, type }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleDelete = (id) => {
    removeUrCategoryFromBudget(id);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = type === 'budget' ? data.categories.slice(indexOfFirstItem, indexOfLastItem) : data.expenses.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil((type === 'budget' ? data.categories.length : data.expenses.length) / itemsPerPage);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Paper style={{ width: '70%' }}  elevation={3} >
        <Table aria-label="customized table">
          <TableHead style={{ backgroundColor: 'black', color: 'white' }}>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCellForHeader key={column}>{column}</StyledTableCellForHeader>
              ))}
              <StyledTableCellForHeader align="right">Action</StyledTableCellForHeader>
            </TableRow>
          </TableHead>
          <TableBody>
          {currentItems.map((item) => (
  <StyledTableRow key={item._id}>
    <StyledTableCell>{type === 'budget' ? item.name : item.description}</StyledTableCell>
    <StyledTableCell> ${type === 'budget' ? item.allocatedAmount : item.amount}</StyledTableCell>
    {type !== 'budget' && (
      <>
        <StyledTableCell>{new Date(item.date).toLocaleDateString()}</StyledTableCell>
        <StyledTableCell>{item.categoryName}</StyledTableCell>
      </>
    )}
    <StyledTableCell align="right">
      <IconButton aria-label="delete">
        <DeleteIcon onClick={() => handleDelete(item._id)} />
      </IconButton>
    </StyledTableCell>
  </StyledTableRow>
))}

          </TableBody>
        </Table>
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationButton
                key={index + 1}
                active={currentPage === index + 1}
                onClick={() => handlePageClick(index + 1)}
              >
                {index + 1}
              </PaginationButton>
            ))}
          </div>
        )}
      </Paper>
    </div>
  );
};

export default CustomizedTables;
