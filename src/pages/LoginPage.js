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
        {/* <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        /> */}

        {mdUp && (
          <StyledSection>
            {/* <img src="/assets/illustrations/illustration_login.png" alt="login" /> */}
            <img
              src="https://scontent.ftlv18-1.fna.fbcdn.net/v/t39.30808-6/342332616_194122353478858_1532361975173765960_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=8631f5&_nc_ohc=olB_iD4carwAX_uD83_&_nc_ht=scontent.ftlv18-1.fna&oh=00_AfBU2QWQL13PIJvWpsZcBupICiO67dAJAExIVlm_pdxw_A&oe=6472AAF1"
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
