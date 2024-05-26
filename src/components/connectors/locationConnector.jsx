import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  Select,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BACKEND_URL from "../../config.js";

const TableCellHeader = styled(TableCell)({
  backgroundColor: '#800000',
  color: 'white',
  fontWeight: 'bold',
  textTransform: 'uppercase',
});

const IconButtonStyled = styled(IconButton)({
  color: 'black',
});

const ButtonStyled = styled(Button)({
  backgroundColor: '#800000',
  color: 'white',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  '&:hover': {
    backgroundColor: '#800000',
  },
});

const ButtonCancelStyled = styled(Button)({
  color: '#800000',
  fontWeight: 'bold',
  textTransform: 'uppercase',
});

const TableRowStyled = styled(TableRow)({
  position: 'relative',
  boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
  margin: '10px 0',
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: '#f0dada',
    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)',
  },
});

const TableCellStyled = styled(TableCell)({
  position: 'relative',
  '&:last-child': {
    paddingRight: '40px',
  },
});

const IconContainer = styled('div')({
  position: 'absolute',
  right: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  gap: '5px',
});

const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#800000',
  },
  '& .MuiInput-underline:before': {
    borderBottomColor: '#800000',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#800000',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#800000',
    },
    '&:hover fieldset': {
      borderColor: '#800000',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#800000',
    },
  },
  '& .MuiSelect-icon': {
    color: '#800000',
  },
});

const LocationConnector = () => {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({ name: '' });
  const [editLocation, setEditLocation] = useState({ id: '', name: '' });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedView, setSelectedView] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/locations`);
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations', error);
    }
  };

  const createLocation = async () => {
    const locationCreateDto = { name: newLocation.name };

    try {
      const response = await axios.post(`${BACKEND_URL}/locations`, locationCreateDto);
      setLocations([...locations, response.data]);
      setNewLocation({ name: '' });
      setOpenCreateDialog(false);
    } catch (error) {
      console.error('Error creating location', error);
    }
  };

  const updateLocation = async () => {
    const locationUpdateDto = { id: editLocation.id, name: editLocation.name };

    try {
      const response = await axios.put(`${BACKEND_URL}/locations`, locationUpdateDto);
      setLocations(locations.map((loc) => (loc.id === editLocation.id ? response.data : loc)));
      setEditLocation({ id: '', name: '' });
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Error updating location', error);
    }
  };

  const deleteLocation = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/locations/${id}`);
      setLocations(locations.filter((loc) => loc.id !== id));
    } catch (error) {
      console.error('Error deleting location', error);
    }
  };

  const handleEditClick = (location) => {
    setEditLocation({ id: location.id, name: location.name });
    setOpenEditDialog(true);
  };

  const handleViewHumansClick = (location) => {
    setSelectedLocation(location);
    setSelectedView('humans');
    setOpenViewDialog(true);
  };

  const handleViewVirusesClick = (location) => {
    setSelectedLocation(location);
    setSelectedView('viruses');
    setOpenViewDialog(true);
  };

  return (
    <Container maxWidth="md">
      <Box mt={4} display="flex" justifyContent="flex-end" mb={2}>
        <ButtonStyled variant="contained" onClick={() => setOpenCreateDialog(true)}>
          ADD LOCATION
        </ButtonStyled>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCellHeader>Name</TableCellHeader>
              <TableCellHeader>Humans</TableCellHeader>
              <TableCellHeader>Viruses</TableCellHeader>
              <TableCellHeader />
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.map((location) => (
              <TableRowStyled key={location.id}>
                <TableCellStyled>{location.name}</TableCellStyled>
                <TableCellStyled>
                  {location.humans.length > 0 && (
                    <ButtonStyled onClick={() => handleViewHumansClick(location)}>
                      VIEW HUMANS
                    </ButtonStyled>
                  )}
                </TableCellStyled>
                <TableCellStyled>
                  {location.humans.some(human => human.viruses.length > 0) && (
                    <ButtonStyled onClick={() => handleViewVirusesClick(location)}>
                      VIEW VIRUSES
                    </ButtonStyled>
                  )}
                </TableCellStyled>
                <TableCellStyled>
                  <IconContainer>
                    <IconButtonStyled onClick={() => handleEditClick(location)}>
                      <EditIcon />
                    </IconButtonStyled>
                    <IconButtonStyled onClick={() => deleteLocation(location.id)}>
                      <DeleteIcon />
                    </IconButtonStyled>
                  </IconContainer>
                </TableCellStyled>
              </TableRowStyled>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Location Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
        <DialogTitle>Add Location</DialogTitle>
        <DialogContent>
          <StyledTextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={newLocation.name}
            onChange={(e) => setNewLocation({ name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <ButtonCancelStyled onClick={() => setOpenCreateDialog(false)}>
            Cancel
          </ButtonCancelStyled>
          <ButtonStyled onClick={createLocation}>
            Save
          </ButtonStyled>
        </DialogActions>
      </Dialog>

      {/* Edit Location Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Location</DialogTitle>
        <DialogContent>
          <StyledTextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={editLocation.name}
            onChange={(e) => setEditLocation({ ...editLocation, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <ButtonCancelStyled onClick={() => setOpenEditDialog(false)}>
            Cancel
          </ButtonCancelStyled>
          <ButtonStyled onClick={updateLocation}>
            Save
          </ButtonStyled>
        </DialogActions>
      </Dialog>

      {/* View Humans/Viruses Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)}>
        <DialogTitle>{selectedView === 'humans' ? 'Humans' : 'Viruses'} in {selectedLocation?.name}</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {selectedView === 'humans' ? (
                    <>
                      <TableCellHeader>Human Name</TableCellHeader>
                      <TableCellHeader>Health Status</TableCellHeader>
                    </>
                  ) : (
                    <>
                      <TableCellHeader>Virus Name</TableCellHeader>
                      <TableCellHeader>Infectiousness Percentage</TableCellHeader>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedView === 'humans'
                  ? selectedLocation?.humans.map((human) => (
                      <TableRowStyled key={human.id}>
                        <TableCellStyled>{human.name}</TableCellStyled>
                        <TableCellStyled>{human.healthStatus}</TableCellStyled>
                      </TableRowStyled>
                    ))
                  : selectedLocation?.humans
                      .flatMap(human => human.viruses)
                      .map((virus) => (
                        <TableRowStyled key={virus.id}>
                          <TableCellStyled>{virus.name}</TableCellStyled>
                          <TableCellStyled>{virus.infectiousnessPercentage}%</TableCellStyled>
                        </TableRowStyled>
                      ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <ButtonCancelStyled onClick={() => setOpenViewDialog(false)}>
            Close
          </ButtonCancelStyled>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LocationConnector;