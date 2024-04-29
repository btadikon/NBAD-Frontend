import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import CustomizedTables from '../Table/Table';
import { useUrBudget } from '../../contexts/budget'; // Import your BudgetContext
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddBudget = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isPlus, setIsPlus] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const [allocatedAmount, setAllocatedAmount] = useState('');
  const [loading, setLoading] = useState(true); // Set initial loading state to true
  const type = 'budget'
  const { budget, addUrCategoryToBudget, removeUrCategoryFromBudget, fetchUrCuurentMonthBudget, authStatus } = useUrBudget();
const navigate = useNavigate();
  const handleToggleDialog = () => {
    setOpenDialog(!openDialog);
    setIsPlus(true); // Reset the button icon to plus when closing the dialog
  };

  const handleAddCategory = () => {
    addUrCategoryToBudget({ name: categoryName, amount: allocatedAmount });
    setCategoryName('');
    setAllocatedAmount('');
    setOpenDialog(false);
    setIsPlus(true);
  };

  useEffect(() => {
    if(authStatus) {
      const fetchData = async () => {
        try {
          await fetchUrCuurentMonthBudget();
        } catch (error) {
          console.error('Error fetching budget:', error);
        } finally {
          // After fetching is complete (successful or failed), set loading to false
          setLoading(false);
        }
      };
  
      fetchData();
    }
    else {
      toast.error("Please login fisrt!!")
      navigate('/login');
    }
  }, []); // Empty dependency array to run the effect only once on component mount

  return (
    <Box position="relative" width="100%">
      <div>
      <Tooltip title="Add Budget">
  <IconButton
    style={{
      backgroundColor: '#707070',
      color: 'white',
      position: 'absolute',
      top: 0,
      right: '130px',
      width: '40px', // Adjust the width to make it bigger
      height: '40px', // Adjust the height to make it bigger
    }}
    onClick={() => {
      setOpenDialog(true);
      setIsPlus(false); // Change the button icon to close when opening the dialog
    }}
  >
    {isPlus ? <AddIcon style={{ fontSize: '40px' }} /> : <CloseIcon style={{ fontSize: '40px' }} />}
  </IconButton>
</Tooltip>

      <Box marginTop="100px"> {/* Add margin between table and navbar */}
        <CustomizedTables
          columns={['Category Name', 'Allocated Amount']}
          data={budget}
          removeUrCategoryFromBudget={removeUrCategoryFromBudget}
          type = {type} // Pass removeUrCategoryFromBudget function to handle category removal
          style={{ width: '70%', float: 'left' }}
        />
      </Box>
      </div>
      
      <Dialog open={openDialog} onClose={handleToggleDialog}>
        <DialogTitle>Add Budget</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            variant="outlined"
            fullWidth
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Allocated Amount"
            variant="outlined"
            type="number"
            fullWidth
            value={allocatedAmount}
            onChange={(e) => setAllocatedAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
  <Button
    onClick={handleToggleDialog}
    variant="outlined"
    sx={{ color: 'red', borderColor: 'red', marginRight: '10px' }}
  >
    Cancel
  </Button>
  <Button
    onClick={handleAddCategory}
    variant="contained"
    sx={{ backgroundColor: 'blue', color: 'white' }}
  >
    Add Budget
  </Button>
</DialogActions>

      </Dialog>
    </Box>
  );
};

export default AddBudget;
