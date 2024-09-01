import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

function AnchorTemporaryDrawer() {
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ 
        width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250,
        paddingTop: '10px'  // Add padding from the top
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Logs', 'History', 'Processes', 'Documentation'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['Links', 'History', 'Exit'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      {['Button'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button
            style={{
              height: "430px", 
              backgroundColor: "gray", 
              color: "white", 
              width: "10px",
              marginLeft: "10px"
            }} 
            onClick={toggleDrawer(anchor, true)}
          >
            {anchor}
          </Button>
          <Drawer
            anchor="right"
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            sx={{
              '& .MuiDrawer-paper': {
                backgroundColor: '#fff',
                color: 'rgba(0, 0, 0, 0.87)',
                transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                boxShadow: '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                height: '500px',
                flex: '1 0 auto',
                zIndex: 1200,
                WebkitOverflowScrolling: 'touch',
                position: 'fixed',
                top: 0,
                outline: 0,
                right: 0,
                marginTop: '100px',
              }
            }}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}

export default AnchorTemporaryDrawer;
