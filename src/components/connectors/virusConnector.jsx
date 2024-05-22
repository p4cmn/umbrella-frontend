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
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

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

const StyledFormControl = styled(FormControl)({
  '& label.Mui-focused': {
    color: '#800000',
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

const Viruses = () => {
  const [viruses, setViruses] = useState([]);
  const [humans, setHumans] = useState([]);
  const [newVirus, setNewVirus] = useState({ name: '', infectiousnessPercentage: '' });
  const [editVirus, setEditVirus] = useState({ id: '', name: '', infectiousnessPercentage: '' });
  const [infectData, setInfectData] = useState({ virusId: '', humanId: '' });
  const [selectedVirus, setSelectedVirus] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openInfectDialog, setOpenInfectDialog] = useState(false);
  const [openViewHumansDialog, setOpenViewHumansDialog] = useState(false);

  useEffect(() => {
    fetchViruses();
    fetchHumans();
  }, []);

  const fetchViruses = async () => {
    try {
      const response = await axios.get('http://localhost:8080/viruses');
      setViruses(response.data);
    } catch (error) {
      console.error('Error fetching viruses', error);
    }
  };

  const fetchHumans = async () => {
    try {
      const response = await axios.get('http://localhost:8080/humans');
      setHumans(response.data);
    } catch (error) {
      console.error('Error fetching humans', error);
    }
  };

  const createVirus = async () => {
    const { name, infectiousnessPercentage } = newVirus;
    const virusCreateDto = { name, infectiousnessPercentage: parseInt(infectiousnessPercentage) };
    try {
      const response = await axios.post('http://localhost:8080/viruses', virusCreateDto);
      setViruses([...viruses, response.data]);
      setNewVirus({ name: '', infectiousnessPercentage: '' });
      setOpenCreateDialog(false);
    } catch (error) {
      console.error('Error creating virus', error);
    }
  };

  const updateVirus = async () => {
    const { id, name, infectiousnessPercentage } = editVirus;
    const virusUpdateDto = { id, name, infectiousnessPercentage: parseInt(infectiousnessPercentage) };

    try {
      const response = await axios.put('http://localhost:8080/viruses', virusUpdateDto);
      setViruses(viruses.map((virus) => (virus.id === id ? response.data : virus)));
      setEditVirus({ id: '', name: '', infectiousnessPercentage: '' });
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Error updating virus', error);
    }
  };

  const deleteVirus = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/viruses/${id}`);
      setViruses(viruses.filter((virus) => virus.id !== id));
    } catch (error) {
      console.error('Error deleting virus', error);
    }
  };

  const handleEditClick = (virus) => {
    setEditVirus({ id: virus.id, name: virus.name, infectiousnessPercentage: virus.infectiousnessPercentage });
    setOpenEditDialog(true);
  };

  const handleInfectClick = () => {
    setOpenInfectDialog(true);
  };

  const infectHuman = async () => {
    const virusInfectDto = { virusId: infectData.virusId, humanId: infectData.humanId };

    try {
      await axios.post('http://localhost:8080/viruses/infect', virusInfectDto);
      setOpenInfectDialog(false);
      setInfectData({ virusId: '', humanId: '' });
      fetchViruses(); // Обновляем список вирусов после инфицирования
    } catch (error) {
      console.error('Error infecting human', error);
    }
  };

  const handleViewHumansClick = (virus) => {
    setSelectedVirus(virus);
    setOpenViewHumansDialog(true);
  };

  return (
    <Container maxWidth="md">
      <Box mt={4} display="flex" justifyContent="flex-end" mb={2}>
        <ButtonStyled variant="contained" onClick={handleInfectClick}>
          INFECT
        </ButtonStyled>
        <ButtonStyled variant="contained" onClick={() => setOpenCreateDialog(true)} sx={{ ml: 2 }}>
          ADD VIRUS
        </ButtonStyled>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCellHeader>Name</TableCellHeader>
              <TableCellHeader>Infectiousness Percentage</TableCellHeader>
              <TableCellHeader>Humans</TableCellHeader>
              <TableCellHeader />
            </TableRow>
          </TableHead>
          <TableBody>
            {viruses.map((virus) => (
              <TableRowStyled key={virus.id}>
                <TableCellStyled>{virus.name}</TableCellStyled>
                <TableCellStyled>{virus.infectiousnessPercentage}%</TableCellStyled>
                <TableCellStyled>
                  {virus.humans.length > 0 && (
                    <ButtonStyled onClick={() => handleViewHumansClick(virus)}>
                      VIEW HUMANS
                    </ButtonStyled>
                  )}
                </TableCellStyled>
                <TableCellStyled>
                  <IconContainer>
                    <IconButtonStyled onClick={() => handleEditClick(virus)}>
                      <EditIcon />
                    </IconButtonStyled>
                    <IconButtonStyled onClick={() => deleteVirus(virus.id)}>
                      <DeleteIcon />
                    </IconButtonStyled>
                  </IconContainer>
                </TableCellStyled>
              </TableRowStyled>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Create Virus Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
        <DialogTitle>Add Virus</DialogTitle>
        <DialogContent>
          <StyledTextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={newVirus.name}
            onChange={(e) => setNewVirus({ ...newVirus, name: e.target.value })}
          />
          <StyledTextField
            margin="dense"
            label="Infectiousness Percentage"
            type="number"
            fullWidth
            value={newVirus.infectiousnessPercentage}
            onChange={(e) => setNewVirus({ ...newVirus, infectiousnessPercentage: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <ButtonCancelStyled onClick={() => setOpenCreateDialog(false)}>
            Cancel
          </ButtonCancelStyled>
          <ButtonStyled onClick={createVirus}>
            Save
          </ButtonStyled>
        </DialogActions>
      </Dialog>

      {/* Edit Virus Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Virus</DialogTitle>
        <DialogContent>
          {editVirus && (
            <>
              <StyledTextField
                autoFocus
                margin="dense"
                label="Name"
                type="text"
                fullWidth
                value={editVirus.name}
                onChange={(e) => setEditVirus({ ...editVirus, name: e.target.value })}
              />
              <StyledTextField
                margin="dense"
                label="Infectiousness Percentage"
                type="number"
                fullWidth
                value={editVirus.infectiousnessPercentage}
                onChange={(e) => setEditVirus({ ...editVirus, infectiousnessPercentage: e.target.value })}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <ButtonCancelStyled onClick={() => setOpenEditDialog(false)}>
            Cancel
          </ButtonCancelStyled>
          <ButtonStyled onClick={updateVirus}>
            Save
          </ButtonStyled>
        </DialogActions>
      </Dialog>

      {/* Infect Human Dialog */}
      <Dialog open={openInfectDialog} onClose={() => setOpenInfectDialog(false)}>
        <DialogTitle>Infect Human</DialogTitle>
        <DialogContent>
          <StyledFormControl fullWidth margin="dense">
            <InputLabel>Virus</InputLabel>
            <Select
              value={infectData.virusId}
              onChange={(e) => setInfectData({ ...infectData, virusId: e.target.value })}
              label="Virus"
            >
              {viruses.map((virus) => (
                <MenuItem key={virus.id} value={virus.id}>
                  {virus.name}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
          <StyledFormControl fullWidth margin="dense">
            <InputLabel>Human</InputLabel>
            <Select
              value={infectData.humanId}
              onChange={(e) => setInfectData({ ...infectData, humanId: e.target.value })}
              label="Human"
            >
              {humans.map((human) => (
                <MenuItem key={human.id} value={human.id}>
                  {human.name}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
        </DialogContent>
        <DialogActions>
          <ButtonCancelStyled onClick={() => setOpenInfectDialog(false)}>
            Cancel
          </ButtonCancelStyled>
          <ButtonStyled onClick={infectHuman}>
            Infect
          </ButtonStyled>
        </DialogActions>
      </Dialog>
      {/* View Humans Dialog */}
      <Dialog open={openViewHumansDialog} onClose={() => setOpenViewHumansDialog(false)}>
        <DialogTitle>Humans Infected by {selectedVirus?.name}</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellHeader>Human Name</TableCellHeader>
                  <TableCellHeader>Health Status</TableCellHeader>
                  <TableCellHeader>Location</TableCellHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedVirus &&
                  selectedVirus.humans.map((human) => (
                    <TableRowStyled key={human.id}>
                      <TableCellStyled>{human.name}</TableCellStyled>
                      <TableCellStyled>{human.healthStatus}</TableCellStyled>
                      <TableCellStyled>{human.location.name}</TableCellStyled>
                    </TableRowStyled>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <ButtonCancelStyled onClick={() => setOpenViewHumansDialog(false)}>
            Close
          </ButtonCancelStyled>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Viruses;