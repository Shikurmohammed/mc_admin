import { drawerWidth, collapsedWidth } from '../../utils/constants';
  const { open } = useSidebar();

  // This ensures the margin is always exactly the size of the sidebar
  const currentWidth = open ? drawerWidth : collapsedWidth;
const MainContent = ({ children }) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        transition: (theme) =>
          theme.transitions.create('margin', {
            duration: theme.transitions.duration.standard,
          }),
      }}
    >
      <Toolbar />
      {children || <Outlet />}
    </Box>
  );
};


export default MainContent;