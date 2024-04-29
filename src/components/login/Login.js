import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox'; // Import Checkbox component
import './Login.css';
import axios from 'axios';
import { baseURL } from '../../config';
import { useNavigate  } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import { toast } from 'react-toastify';
import { useUrBudget } from '../../contexts/budget'

export default function LoginForm({handleLogin}) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');


  const { authStatus, setAuthStatus } = useUrBudget();

  useEffect(() => {
    if(authStatus) {
      navigate('/dashboard')
    }
    else {
      setAuthStatus(false);
      navigate('/login')
    }
  }, [authStatus])

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send login request to backend
      const response = await axios.post(`${baseURL}/user/signin`, {
        email: email,
        password: password
      });

      // Extract token and refresh token from response
      const { user,token, refreshToken } = response.data;

      // Store token and refresh token in local storage
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      // Store username in local storage (optional)
      let userData = JSON.stringify(user)
      localStorage.setItem('user', userData);
      localStorage.setItem('loginStatus',response.status === 200 ? 'true' : 'false')
      handleLogin();
      // Clear form fields
      setEmail('');
      setPassword('');
      setError('');
      setAuthStatus(true);
      if(response.status === 200){
        navigate('/dashboard');
      }
    } catch (error) {
      console.log(authStatus)
      setAuthStatus(false);
       toast.error(error.response.data.message)
    }
  };

  return (
    <Card sx={{ minWidth: 275 }} className='loginForm'>
    <CardContent>
      <Typography variant="h5" component="div" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          id="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <PersonIcon color="primary" />
            ),
          }}
        />
        <TextField
          fullWidth
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <Checkbox
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                color="primary"
                inputProps={{ 'aria-label': 'toggle password visibility' }}
              />
            ),
          }}
        />
        {error && <Typography variant="body1" gutterBottom color="error">{error}</Typography>}
        <Button type="submit" variant="contained" size="large" color="primary">
          Login
        </Button>
      </form>
      <Typography variant="body1" gutterBottom>
        Don't have an account? <Link to="/signup">Register here</Link>.
      </Typography>
    </CardContent>
  </Card>
  );
}
