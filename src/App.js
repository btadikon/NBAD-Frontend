import './App.css';
import {useEffect} from 'react';
import LoginForm from './components/login/Login';
import Navbar from './components/navbar/Navbar';
import { Routes, Route,Navigate } from 'react-router-dom';
import SignUpForm from './components/signup/signup';
import { useState } from 'react';
import AddBudget from './components/AddBudget/AddBudget';
import AddExpense from './components/AddExpense/AddExpense';
import DashBoard from './components/DashBoard/DashBoard1';
import { toast ,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUrBudget } from './contexts/budget';
import { Dialog,DialogTitle,DialogActions,Button } from '@mui/material';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { handleLogout, setAuthStatus } = useUrBudget();
  const [openDialog,setOpenDialog] = useState(false);
  const {getRefreshToken,authStatus} = useUrBudget();

 
  useEffect(() => {
    const tokenInterval = setInterval(() => {
      if (authStatus && localStorage.getItem("token")) setOpenDialog(true);
    }, 90000);
    return () => clearInterval(tokenInterval);
  }, [authStatus]);

  const handleCloseDialog = async () => {
    try {
      await getRefreshToken();
      setOpenDialog(false);
    }
    catch (error) {

      alert('Something went wrong!!');
      handleout();
      Navigate('/login')
    }
};




  const handleLogin = () => {
    let status = JSON.parse(localStorage.getItem('loginStatus'))
    setIsLoggedIn(status);
    toast.success('Login SuccessFully.');
  };
  const handleout = () =>{
    // localStorage.setItem('loginStatus', 'false');
    localStorage.clear()
    setAuthStatus(false);
    // Update isLoggedIn state
    setIsLoggedIn(false);
    handleLogout();
    toast.success('Logout SuccessFully.');
  }
  return (
    <div className="App">
      <Navbar isLoggedIn={isLoggedIn} handleout={handleout}/>
      <Routes>
        <Route path='/' element={<LoginForm handleLogin={handleLogin} />} />
        <Route path='/login' element={<LoginForm handleLogin={handleLogin}/>} />
        <Route path='/signup' element={<SignUpForm />} />
        <Route path='/DashBoard' element={<DashBoard/>} />
        <Route path='/AddBudget' element = {<AddBudget/>}/>
        <Route path='/AddExpense' element = {<AddExpense/>}/>
      </Routes>
      <Dialog open={openDialog}>
          <DialogTitle>Click on Ok to get refresh token</DialogTitle>
          <DialogActions>
            <Button onClick={() => handleCloseDialog()}>
              OK
            </Button>
          </DialogActions>
        </Dialog>

      <ToastContainer/>
    </div>
  );
}

export default App;
