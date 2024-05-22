
import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  styled,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const AppBarStyled = styled(AppBar)({
  backgroundColor: '#800000',
  zIndex: (theme) => theme.zIndex.drawer + 1,
});

const IconButtonStyled = styled(IconButton)({
  color: 'white',
});

const DrawerStyled = styled(Drawer)({
  '& .MuiDrawer-paper': {
    width: 240,
    boxSizing: 'border-box',
    top: 48, // Adjust this value to match the height of the AppBar
    paddingTop: 0, // Ensure there's no padding inside the drawer
  },
});

const ListItemButtonStyled = styled(ListItemButton)({
  width: '100%', // Make ListItemButton occupy the entire area of the menuItem
  '&:hover': {
    backgroundColor: '#f0dada',
  },
});

const TypographyStyled = styled(Typography)({
  color: 'white',
  fontWeight: 'bold',
  textTransform: 'uppercase',
});

const ListItemTextStyled = styled(ListItemText)({
  '& .MuiTypography-root': {
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});

const Appbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuItemClick = (path) => {
    navigate(path); // Navigate to the specified path
    setDrawerOpen(false); // Close the drawer
  };

  const menuItems = [
    { text: 'Humans', path: '/human' },
    { text: 'Viruses', path: '/viruses' },
    { text: 'Locations', path: '/locations' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBarStyled position="fixed">
        <Toolbar variant="dense">
          <IconButtonStyled
            edge="start"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButtonStyled>
          <TypographyStyled variant="h6" component="div">
            Umbrella
          </TypographyStyled>
        </Toolbar>
      </AppBarStyled>
      <DrawerStyled
        variant="temporary"
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
          BackdropProps: {
            style: {
              backgroundColor: 'transparent',
            },
          },
        }}
      >
        <Box
          role="presentation"
          onClick={handleDrawerToggle}
          onKeyDown={handleDrawerToggle}
        >
          <List sx={{ paddingTop: 0 }}>
            {menuItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButtonStyled onClick={() => handleMenuItemClick(item.path)}>
                  <ListItemTextStyled primary={item.text} />
                </ListItemButtonStyled>
              </ListItem>
            ))}
          </List>
        </Box>
      </DrawerStyled>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {/* Your main content can go here */}
      </Box>
    </Box>
  );
};

export default Appbar;