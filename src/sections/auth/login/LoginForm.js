import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { adminContext } from '../../../adminContext';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const ApiUrl = `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api`;
  const { setLoggedAdmin } = useContext(adminContext);

  const [showPassword, setShowPassword] = useState(false);

  // User info//
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const [rememberMe, setRememberMe] = useState(false);

  const handleEmailChange = (event) => {
    setUserEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setUserPassword(event.target.value);
  };

  const handleClick = () => {
    navigate('/dashboard', { replace: true });
  };

  const logIn = async () => {
    console.log(userEmail);
    console.log(userPassword);

    if (userEmail === '' || userPassword === '') {
      alert('יש למלא את כל הפרטים');
    } else {
      setUserEmail(userEmail.replace('%40', '@'));
      try {
        const response = await fetch(`${ApiUrl}/User/GetUser/email/${userEmail}/password/${userPassword}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            Accept: 'application/json; charset=UTF-8',
          },
        });
        const user = await response.json();
        console.log(user);

        if (user.user_Status === 'non active') {
          alert('משתמש זה אינו פעיל במערכת');
          setUserEmail('');
          setUserPassword('');
        }
        if (user.is_admin === false) {
          alert('אינך מנהלת, היכנסי למתלבשות דרך האפליקציה');
          setUserEmail('');
          setUserPassword('');
        } else if (user.id > 0) {
          setLoggedAdmin(user);
          // navigate('MainLayout');
          navigate('/dashboard', { replace: true });
        } else {
          alert('הפרטים שמילאת אינם קיימים במערכת');
          setUserEmail('');
          setUserPassword('');
        }
      } catch (error) {
        console.log('ERR in logIn', error);
      }
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="דואר אלקטרוני"
          value={userEmail} // Set the value of the TextField to the userEmail state
          onChange={handleEmailChange} // Handle the change event and update the userEmail state
        />

        <TextField
          name="password"
          label="סיסמא"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="start">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          value={userPassword} // Set the value of the TextField to the userPassword state
          onChange={handlePasswordChange} // Handle the change event and update the userPassword state
        />
      </Stack>

      <Stack direction="row" alignItems="flex-start" justifyContent="flex-end" sx={{ my: 2 }}>
        <Typography variant="h4" gutterBottom>
          זכור אותי{' '}
        </Typography>
        {/* <Checkbox name="remember" label="Remember me" /> */}
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={logIn}>
        התחברי
      </LoadingButton>
    </>
  );
}
