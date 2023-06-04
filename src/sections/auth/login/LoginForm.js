import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, IconButton, InputAdornment, TextField } from '@mui/material';

import { LoadingButton } from '@mui/lab';
import swal from 'sweetalert';

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

  const handleEmailChange = (event) => {
    setUserEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setUserPassword(event.target.value);
  };

  const logIn = async () => {
    console.log(userEmail);
    console.log(userPassword);

    if (userEmail === '' || userPassword === '') {
      swal('!שגיאה', 'נא למלא את כל הפרטים הנדרשים', 'error');
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

        if (user.user_Status === 'non active') {
          swal('!שגיאה', 'משתמש זה לא פעיל במערכת', 'error');

          setUserEmail('');
          setUserPassword('');
        }
        if (user.is_admin === false) {
          swal('!אינך מנהלת', 'אנא התחברי דרך אפליקציית מתלבשות', 'error');

          setUserEmail('');
          setUserPassword('');
        } else if (user.id > 0) {
          setLoggedAdmin(user);
          localStorage.setItem('loggedAdmin', JSON.stringify(user));
          navigate('/dashboard/app', { replace: true });
        } else {
          swal('!שגיאה', 'משתמש זה לא קיים במערכת', 'error');
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
          value={userEmail}
          onChange={handleEmailChange}
          // InputProps={{
          //   style: { backgroundColor: '#ede6d7' },
          // }}
          InputProps={{
            style: { backgroundColor: 'rgb(232, 240, 254)' },
          }}
          sx={{ direction: 'rtl' }}
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
            style: { backgroundColor: 'rgb(232, 240, 254)' },
          }}
          value={userPassword}
          onChange={handlePasswordChange}
          sx={{ direction: 'rtl' }}
        />
      </Stack>

      <Stack direction="row" alignItems="flex-start" justifyContent="flex-end" sx={{ my: 2 }}>
        {/* <Typography variant="h4" gutterBottom>
          זכור אותי{' '}
        </Typography>
        <Checkbox name="remember" label="Remember me" /> */}
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={logIn}
        sx={{
          backgroundColor: '#d7ba7b',
          '&:hover': {
            backgroundColor: '#d7ba7b',
          },
          boxShadow: '0px 3px 5px #d7ba7b',
        }}
      >
        התחברי
      </LoadingButton>
    </>
  );
}
