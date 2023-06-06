import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import { useEffect, useState } from 'react';
import axios from 'axios';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Divider } from '@mui/material';
import 'hover.css/css/hover-min.css';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ProductsTable from '../components/ProductsTable';

// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

// components
import Iconify from '../components/iconify';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const [ActiveUsersNum, setActiveUsersNum] = useState(0);
  const [StoresNum, setStoresNum] = useState(0);
  const [ActiveItems, setActiveItems] = useState(0);
  const [SoldItems, setSoldItems] = useState(0);

  // sentences
  const sentencesPostApi = `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/User/PostSentence?content=`;
  const sentencesGetApi = `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/User/GetSentences`;
  const sentencesDeleteApi = `https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/User/DeleteSentence/`;
  const sentencesUpdateApi = ``;
  const sentencesColumnName = 'content';

  useEffect(() => {
    GetActiveUsersCount();
    GetStoresCount();
    GetActiveItemCount();
    GetSoldItemCount();
  }, []);

  function GetActiveUsersCount() {
    axios
      .get(`https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/User/GetActiveUsersCount`)
      .then((res) => {
        setActiveUsersNum(res.data);
      })
      .catch((err) => {
        console.log('err in GetActiveUsersCount', err);
      });
  }

  function GetStoresCount() {
    axios
      .get(`https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Stores/GetStoresCount`)
      .then((res) => {
        setStoresNum(res.data);
      })
      .catch((err) => {
        console.log('err in GetStoresCount', err);
      });
  }

  function GetActiveItemCount() {
    axios
      .get(`https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/GetActiveItemCount`)
      .then((res) => {
        setActiveItems(res.data);
      })
      .catch((err) => {
        console.log('err in GetActiveItemCount', err);
      });
  }

  function GetSoldItemCount() {
    axios
      .get(`https://proj.ruppin.ac.il/cgroup31/test2/tar2/api/Item/GetSoldItemCount`)
      .then((res) => {
        if (res.data === 0) {
          setSoldItems('0');
        } else {
          setSoldItems(res.data);
        }
      })
      .catch((err) => {
        console.log('err in GetSoldItemCount', err);
      });
  }
  return (
    <>
      <Helmet>
        <title> דף מנהלת אפליקציית מתלבשות </title>
      </Helmet>

      <Container maxWidth="xl">
        {/* <Typography variant="h4" sx={{ mb: 5 }}>
          ברוכה הבאה{' '}
        </Typography> */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              className="hvr-grow-shadow"
              style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)', width: '100%' }}
              title="חנויות על המפה"
              total={StoresNum}
              icon={'system-uicons:location'}
              color="dash1"

              />
          </Grid>

          <Grid item xs={12} sm={6} md={3} className="hvr-grow-shadow">
            <AppWidgetSummary
              className="hvr-grow-shadow"
              style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)', width: '100%'  }}
              title="משתמשות פעילות"
              total={ActiveUsersNum}
              icon={'system-uicons:user'}
              color="dash2"

            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} className="hvr-grow-shadow">
            <AppWidgetSummary
              title="פריטים זמינים באפליקציה"
              total={ActiveItems}
              icon={'mdi:clothes-hanger'}
              className="hvr-grow-shadow"
              style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)', width: '100%' }}
              color="dash3"

            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} className="hvr-grow-shadow">
            <AppWidgetSummary
              className="hvr-grow-shadow"
              style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)', width: '100%' }}
              title="פריטים שנמכרו"
              total={SoldItems}
              icon={'system-uicons:tags'}
              color="dash4"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 5, border: 1, borderBlockColor: 'lightgray' }}>
          {/* 
               
            */}
        </Divider>
        <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Accordion 2</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <ProductsTable
          getApi={sentencesGetApi}
          postApi={sentencesPostApi}
          deleteApi={sentencesDeleteApi}
          updateApi={sentencesUpdateApi}
          columnName={sentencesColumnName}
        />
        </AccordionDetails>
      </Accordion>
        
      </Container>
    </>
  );
}
