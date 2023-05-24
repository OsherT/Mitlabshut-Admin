// component
import SvgColor from '../../../components/svg-color';
import Iconify from '../../../components/iconify';


// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'בית',
    path: '/dashboard/app',
    icon: <Iconify icon="system-uicons:home-alt" />,
  },
  {
    title: 'ניהול משתמשות',
    path: '/dashboard/user',
    icon:  <Iconify icon="system-uicons:user" />,
  },
  {
    title: 'ניהול פרטי מוצרים',
    path: '/dashboard/products',
    icon: <Iconify icon="mdi:clothes-hanger" />,
  },
  {
    title: 'ניהול חנויות על המפה',
    path: '/dashboard/map',
    icon: <Iconify icon="system-uicons:location" />,
  },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
