import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
// sections
import { LoginForm } from '../sections/auth/login';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 600,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
  textAlign: 'right',
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');

  return (
    <>
      <Helmet>
        <title> התחברות </title>
      </Helmet>

      <StyledRoot>
    
        {mdUp && (
          <StyledSection>
            {/* <img src="/assets/illustrations/illustration_login.png" alt="login" /> */}
            <img
              src="https://firebasestorage.googleapis.com/v0/b/mitlabshut-final.appspot.com/o/AppImages%2FLogo.png?alt=media&token=02a0f3dc-c4a2-4d67-9562-18d1404d382c&_gl=1*w8ofd1*_ga*MTQ2NzE1NzI3Ni4xNjc4NTMxMDg3*_ga_CW55HF8NVT*MTY4NjUwMDkxNy4xOS4xLjE2ODY1MDA5NzcuMC4wLjA."
              alt="login"
            />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom textAlign={'center'} color={'#ddb96c'}>
              ברוכה הבאה לאתר המנהלות של מתלבשות{' '}
            </Typography>

            <Typography variant="body2" sx={{ mb: 5 }} textAlign={'center'}>
              ❤ אין לך חשבון? שכחת סיסמא? היכנסי לאפליקציה שלנו
            </Typography>

            <Divider sx={{ my: 3 }}>
              {/* 
               
            */}
            </Divider>

            <LoginForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
