// UrBudgetContexts.js
import React, { createContext, useContext, useState ,useEffect} from 'react';
import Axios from '../service';
import {  toast } from 'react-toastify';
const UrBudgetContexts = createContext();

export const useUrBudget = () => {
  return useContext(UrBudgetContexts);
};

export const BudgetProvider = ({ children }) => {
  const initialState = {
    id: '',
    name: '',
    amount: 0,
    categories: [],
    expenses: [],
    sortedExpenses: [],
  };
  const [budget, setBudget] = useState(initialState);
  const [allBudgets,setAllBudgets] =useState([]);
  const [Expenses,setExpenses] = useState([]);
  const [authStatus, setAuthStatus] = useState(JSON.parse(localStorage.getItem('loginStatus')));



  const addUrCategoryToBudget =async  (category) => {

    try{
        const result=await Axios.post('/budget/addCategoryToUserBudget',{
            budgetId:budget.id,
            name:category.name,
            allocatedAmount:category.amount
        });
       
        toast(result.data.message)
        fetchUrCuurentMonthBudget();
    }
    catch(err){
        console.log(err)
        toast('Cant make cate', err.message)
    }

    setBudget((prevBudget) => ({
      ...prevBudget,
      categories: [...prevBudget.categories, category],
    }));
  };

  const getRefreshToken = async () => {
    try {
      const response = await Axios.post("/auth/getRefreshToken", {
        refreshToken: localStorage.getItem("refreshToken"),
      });
      const { authToken, refreshToken } = response.data;
      Axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`; // for all requests
       localStorage.setItem('token',authToken);
       localStorage.setItem('refreshToken',refreshToken);
  
      toast.success("Refreshed token successFull");
    } catch (error) {
      toast.error(error.response.message.data)
    }
   
  };
  const addUrExpenses =async (expense) => {
    try{
        const result = await Axios.post('/budget/addUserExpense',{
            description:expense.description,
            amount:expense.amount,
            categoryId:expense.categoryId,
            date:expense.date
        });
        toast(result.data.message)
        fetchUrCuurentMonthBudget();
    }
    catch(err){
        console.log(err)
        toast('Cant add expense', err.message)
    }
    setBudget((prevBudget) => ({
      ...prevBudget,
      expenses: [...prevBudget.expenses, expense],
    }));
  };
  const removeUrCategoryFromBudget = async (id) => {

    try{
        const result = await Axios.post('/budget/deleteUserCategory',{
            categoryId:id,
        });
        toast(result.data.message)
        fetchUrCuurentMonthBudget();
    }
    catch(err){
        console.log(err)
        toast('Cant remove category', err.message)
    }
    const filteredCategories = budget.categories.filter((category)=>{
        return category._id !== id;
    })
    setBudget((prevBudget) => ({
      ...prevBudget,
      categories: filteredCategories,
    }));
  }
  const removeUrExpenses =async (id) => {
    try{
        const result = await Axios.post('/budget/deleteUserExpense',{
            expenseId:id,
        });
        toast(result.data.message)
        fetchUrCuurentMonthBudget();
    }
    catch(err){
        console.log(err)
        toast('Cant remove expense', err.message)
    }
    const filteredExpenses = budget.expenses.filter((expense)=>{
        return expense._id !== expense._id;
    })
    setBudget((prevBudget) => ({
      ...prevBudget,
      expenses: filteredExpenses,
    }));
  }
  const fetchUrCuurentMonthBudget = async () => {
    try {
      const response = await Axios.get('/budget/getUserBudgets');
      let userExpenses = await Axios.get('/budget/getUserExpense');
      let sortedExpenses = await Axios.get('/budget/getUserExpensesSortedByMonthlyDate');
      userExpenses = userExpenses.data;
      const data = response.data;
      setExpenses(userExpenses);
      setAllBudgets(data)
      sortedExpenses = sortedExpenses.data;
      if(data[0]){
          setBudget({
              id: data[0]._id,
              name: data[0].name,
              amount: data[0].totalAmount,
              categories: data[0].categories,
              expenses:userExpenses,
              sortedExpenses:sortedExpenses
          });
       //   toast(  `Budget ${data[0].name} init  `)
      }
      else{
          toast('Creating your first budget ... ');
          try{
            const todaydate = new Date();
            const startDate = todaydate;
            const endDate = new Date(todaydate);
            endDate.setDate(todaydate.getDate() + 30);
            const response = await Axios.post('/budget/addUserBudget',{
                name:'My Budget',
                totalAmount:25000,
                startDate:startDate,
                // enddate should be after 30 days
                endDate:endDate,
            });
            toast(response.data.message)
            fetchUrCuurentMonthBudget();}
            catch(err){
                console.log(err)
                toast('Cant create budget', err.message)
            }
      }
      //  setBudget(data); // Assuming the API returns the entire budget object
    } catch (error) {
      console.error('Error fetching initial budget:', error.message);
     // toast('Error fetching initial budget:', error.message)
    }
  };



  const handleLogout = () => {
    setBudget(initialState);
    setAllBudgets([]);
    setExpenses([]);
  };
  useEffect(() => {
    // Fetch initial budget data from API
   

    fetchUrCuurentMonthBudget();
  }, []); 
  return (

    <UrBudgetContexts.Provider value={{ budget,allBudgets,Expenses, addUrCategoryToBudget,getRefreshToken, addUrExpenses ,removeUrExpenses,removeUrCategoryFromBudget,fetchUrCuurentMonthBudget, handleLogout, setAuthStatus, authStatus}}>
      {children}
       
    </UrBudgetContexts.Provider>

  );
};
