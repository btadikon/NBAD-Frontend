import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import PersonIcon from '@mui/icons-material/Person';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import axios from 'axios';
import './signup.css';
import { baseURL } from '../../config';
import { toast } from 'react-toastify';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [animationText, setAnimationText] = useState('');
  const headingText = "Personal Budget";

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      if (index <= headingText.length) {
        setAnimationText(headingText.slice(0, index));
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, 150);
    return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
       await axios.post(`${baseURL}/user/signup`, {
        name: username,
        password: password,
        email: email
      });
        toast.success('User registered successfully.');
      

      setUsername('');
      setPassword('');
      setEmail('');

      setRegistrationSuccess(true);
    } catch (error) {
      toast.error(error.response.data.message)
      console.error('Error registering user:', error);
    }
  };

  if (registrationSuccess) {
    return <Navigate to="/login" />;
  }

  return (
    <Card sx={{ minWidth: 275 }} className='signupForm'>
      <CardContent>
        <div className="heading">
          <Typography variant="h5" component="div" gutterBottom>
            {animationText}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Make Ur Own Monthly Budget.
          </Typography>
        </div>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            id="username"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            id="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <MailOutlineIcon color="primary" />
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
                <FormControlLabel
                  control={<Checkbox checked={showPassword} onChange={() => setShowPassword(!showPassword)} color="primary" />}
                />
              ),
            }}
          />
          <Button type="submit" variant="contained" size="large" color="primary">
            Register
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
