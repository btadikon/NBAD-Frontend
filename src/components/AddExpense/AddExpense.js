import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import CustomizedTables from "../Table/Table";
import { useUrBudget } from "../../contexts/budget"; // Import your BudgetContext
import MenuItem from "@mui/material/MenuItem"; // Add this import
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddExpense = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isPlus, setIsPlus] = useState(true);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const type = "expense"; // Define the type of data (expense)

  const { budget, addUrExpenses, removeUrExpenses, fetchUrCuurentMonthBudget, authStatus } = useUrBudget();
  useEffect(() => {
    if(authStatus) {
      const fetchData = async () => {
        try {
          await fetchUrCuurentMonthBudget();
        } catch (err) {
          alert("Something went wrong!!!");
        }
      };
      fetchData();
    }
    else {
      toast.error("Please login fisrt!!")
      navigate('/login')
    }
  }, []);
  const handleToggleDialog = () => {
    setOpenDialog(!openDialog);
    setIsPlus(true);
  };

  const handleAddExpense = () => {
    if (!selectedCategory) {
      alert("Please select a category for the expense.");
      return;
    }

    const formattedDate = new Date(expenseDate).toISOString();

    addUrExpenses({
      description: expenseName,
      amount: expenseAmount,
      categoryId: selectedCategory,
      date: formattedDate,
    });

    setExpenseName("");
    setExpenseAmount("");
    setExpenseDate(new Date().toISOString().split("T")[0]);
    setSelectedCategory(budget.categories[0]?._id || "");
    setOpenDialog(false);
    setIsPlus(true);
  };

  return (
    <Box position="relative" width="100%">
      <Tooltip title="Add Expense">
        <IconButton
          style={{
            backgroundColor: "#707070",
            color: "white",
            position: "absolute",
            top: 0,
            right: "130px",
            width: "40px",
            height: "40px",
          }}
          onClick={() => {
            setOpenDialog(true);
            setIsPlus(false);
          }}
        >
          {isPlus ? (
            <AddIcon style={{ fontSize: "40px" }} />
          ) : (
            <CloseIcon style={{ fontSize: "40px" }} />
          )}
        </IconButton>
      </Tooltip>

      <Box marginTop="100px">
        <CustomizedTables
          columns={["Description", "Amount", "Date", "Category Name"]}
          data={budget}
          removeUrCategoryFromBudget={removeUrExpenses}
          type={type}
          style={{ width: "70%", float: "left" }}
        />
      </Box>

      <Dialog open={openDialog} onClose={handleToggleDialog}>
        <DialogTitle>Add Expense</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Expense Name"
            variant="outlined"
            fullWidth
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Expense Amount"
            variant="outlined"
            type="number"
            fullWidth
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Expense Date"
            variant="outlined"
            type="date"
            fullWidth
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
          />
          <TextField
            margin="dense"
            select
            label="Select Category"
            variant="outlined"
            fullWidth
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {budget.categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleToggleDialog}
            variant="outlined"
            sx={{ color: "red", borderColor: "red", marginRight: "10px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddExpense}
            variant="contained"
            sx={{ backgroundColor: "blue", color: "white" }}
          >
            Add Expense
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddExpense;
