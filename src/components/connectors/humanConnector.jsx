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
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const healthStatuses = [
  'ASYMPTOMATIC',
  'DEAD',
  'HEALTHY',
  'IMMUNE',
  'INFECTED',
  'QUARANTINED',
  'RECOVERED',
  'SYMPTOMATIC',
  'VACCINATED',
  'WALKING_DEAD',
];

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

const HumanConnector = () => {
  const [humans, setHumans] = useState([]);
  const [locations, setLocations] = useState([]);
  const [newHuman, setNewHuman] = useState({ name: '', healthStatus: '', locationId: '' });
  const [editHuman, setEditHuman] = useState({ id: '', name: '', healthStatus: '', locationId: '' });
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedHuman, setSelectedHuman] = useState(null);
  const [openVirusDialog, setOpenVirusDialog] = useState(false);

  useEffect(() => {
    fetchHumans();
    fetchLocations();
  }, []);

  const fetchHumans = async () => {
    try {
      const response = await axios.get('http://localhost:8080/humans');
      setHumans(response.data);
    } catch (error) {
      console.error('Error fetching humans', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:8080/locations');
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations', error);
    }
  };

  const openVirusDialogForHuman = (human) => {
    setSelectedHuman(human);
    setOpenVirusDialog(true);
  };

  const closeVirusDialog = () => {
    setSelectedHuman(null);
    setOpenVirusDialog(false);
  };

  const createHuman = async () => {
    const { name, healthStatus, locationId } = newHuman;
    const humanCreateDto = { name, healthStatus, locationId: parseInt(locationId) };

    try {
      const response = await axios.post('http://localhost:8080/humans', humanCreateDto);
      setHumans([...humans, response.data]);
      setNewHuman({ name: '', healthStatus: '', locationId: '' });
      setOpenCreateDialog(false);
    } catch (error) {
      console.error('Error creating human', error);
    }
  };

  const updateHuman = async () => {
    const { id, name, healthStatus, locationId } = editHuman;
    const humanUpdateDto = { id, name, healthStatus, locationId: parseInt(locationId) };

    try {
      const response = await axios.put('http://localhost:8080/humans', humanUpdateDto);
      setHumans(humans.map((hum) => (hum.id === id ? response.data : hum)));
      setEditHuman({ id: '', name: '', healthStatus: '', locationId: '' });
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Error updating human', error);
    }
  };

  const deleteHuman = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/humans/${id}`);
      setHumans(humans.filter((human) => human.id !== id));
    } catch (error) {
      console.error('Error deleting human', error);
    }
  };

  const handleEditClick = (human) => {
    setEditHuman({ id: human.id, name: '', healthStatus: '', locationId: '' });
    setOpenEditDialog(true);
  };

  return (
    <Container maxWidth="md">
      <Box mt={4} display="flex" justifyContent="flex-end" mb={2}>
        <ButtonStyled variant="contained" onClick={() => setOpenCreateDialog(true)}>
          ADD HUMAN
        </ButtonStyled>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCellHeader>Name</TableCellHeader>
              <TableCellHeader>Status</TableCellHeader>
              <TableCellHeader>Location</TableCellHeader>
              <TableCellHeader>Viruses</TableCellHeader>
              <TableCellHeader />
            </TableRow>
          </TableHead>
          <TableBody>
            {humans.map((hum) => (
              <TableRowStyled key={hum.id}>
                <TableCellStyled>{hum.name}</TableCellStyled>
                <TableCellStyled>{hum.healthStatus}</TableCellStyled>
                <TableCellStyled>{hum.location.name}</TableCellStyled>
                <TableCellStyled>
                  {hum.viruses.length > 0 && ( // Добавляем условие для отображения кнопки
                    <ButtonStyled onClick={() => openVirusDialogForHuman(hum)}>
                      View Viruses
                    </ButtonStyled>
                  )}
                </TableCellStyled>
                <TableCellStyled>
                  <IconContainer>
                    <IconButtonStyled onClick={() => handleEditClick(hum)}>
                      <EditIcon />
                    </IconButtonStyled>
                    <IconButtonStyled onClick={() => deleteHuman(hum.id)}>
                      <DeleteIcon />
                    </IconButtonStyled>
                  </IconContainer>
                </TableCellStyled>
              </TableRowStyled>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Всплывающее окно для просмотра вирусов */}
      <Dialog open={openVirusDialog} onClose={closeVirusDialog}>
        <DialogTitle>Virus List</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellHeader>Virus Name</TableCellHeader>
                  <TableCellHeader>Infectiousness Percentage</TableCellHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedHuman &&
                  selectedHuman.viruses.map((virus) => (
                    <TableRow key={virus.id}>
                      <TableCell>{virus.name}</TableCell>
                      <TableCell>{virus.infectiousnessPercentage}%</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <ButtonCancelStyled onClick={closeVirusDialog}>
            Close
          </ButtonCancelStyled>
        </DialogActions>
      </Dialog>

      {/* Создание человека диалог */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
        <DialogTitle>Add Human</DialogTitle>
        <DialogContent>
          <StyledTextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={newHuman.name}
            onChange={(e) => setNewHuman({ ...newHuman, name: e.target.value })}
          />
          <StyledTextField
            select
            label="Health Status"
            fullWidth
            value={newHuman.healthStatus}
            onChange={(e) => setNewHuman({ ...newHuman, healthStatus: e.target.value })}
            margin="dense"
            variant="outlined"
          >
            {healthStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </StyledTextField>
          <StyledTextField
            select
            label="Location"
            fullWidth
            value={newHuman.locationId}
            onChange={(e) => setNewHuman({ ...newHuman, locationId: e.target.value })}
            margin="dense"
            variant="outlined"
          >
            {locations.map((loc) => (
              <MenuItem key={loc.id} value={loc.id}>
                {loc.name}
              </MenuItem>
            ))}
          </StyledTextField>
        </DialogContent>
        <DialogActions>
          <ButtonCancelStyled onClick={() => setOpenCreateDialog(false)}>
            Cancel
          </ButtonCancelStyled>
          <ButtonStyled onClick={createHuman}>
            Save
          </ButtonStyled>
        </DialogActions>
      </Dialog>

      {/* Редактирование человека диалог */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Human</DialogTitle>
        <DialogContent>
          {editHuman && (
            <>
              <StyledTextField
                autoFocus
                margin="dense"
                label="New name"
                type="text"
                fullWidth
                value={editHuman.name}
                onChange={(e) => setEditHuman({ ...editHuman, name: e.target.value })}
              />
              <StyledTextField
                select
                label="New health status"
                fullWidth
                value={editHuman.healthStatus}
                onChange={(e) => setEditHuman({ ...editHuman, healthStatus: e.target.value })}
                margin="dense"
                variant="outlined"
              >
                {healthStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </StyledTextField>
              <StyledTextField
                select
                label="New location"
                fullWidth
                value={editHuman.locationId}
                onChange={(e) => setEditHuman({ ...editHuman, locationId: e.target.value })}
                margin="dense"
                variant="outlined"
              >
                {locations.map((loc) => (
                  <MenuItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </MenuItem>
                ))}
              </StyledTextField>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <ButtonCancelStyled onClick={() => setOpenEditDialog(false)}>
            Cancel
          </ButtonCancelStyled>
          <ButtonStyled onClick={updateHuman}>
            Save
          </ButtonStyled>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HumanConnector;

