import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Switch,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Snackbar,
  Box, // Import Box component for layout control
} from "@mui/material";
import { green, red } from "@mui/material/colors";
import "./App.css";

const endpoint = "https://sheetdb.io/api/v1/6f6bg2etln98s";

const App = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ ID: "", Avatar_Name: "", Performance_Score: "" });
  const [darkMode, setDarkMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    readGoogleSheet();
  }, []);

  const readGoogleSheet = () => {
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  };

  const updateGoogleSheet = (id) => {
    fetch(`${endpoint}/ID/${id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: formData }),
    })
      .then((response) => response.json())
      .then((data) => {
        readGoogleSheet();
        handleClose();
        setSnackbarOpen(true);
      });
  };

  const deleteGoogleSheet = (id) => {
    fetch(`${endpoint}/ID/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        readGoogleSheet();
        setSnackbarOpen(true);
      });
  };

  const createGoogleSheet = () => {
    // Check if all required fields are filled
    if (!formData.ID || !formData.Avatar_Name || !formData.Performance_Score) {
      alert("Please fill out all fields.");
      return;
    }
  
    fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: [formData] }),
    })
      .then((response) => response.json())
      .then((data) => {
        readGoogleSheet();
        handleClose();
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error("Error adding new entry:", error);
      });
  };
  
  const handleOpen = (row) => {
    setFormData(row);
    setOpen(true);
  };

  const handleClose = () => {
    setFormData({ ID: "", Avatar_Name: "", Performance_Score: "" });
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? green[500] : green[700],
      },
      secondary: {
        main: darkMode ? red[500] : red[700],
      },
    },
  });

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const syncData = () => {
    readGoogleSheet();
    setSnackbarOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Typography variant="h3" align="center" gutterBottom>
          Google Sheet Data
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
   
          <Button variant="outlined" onClick={syncData}>
            Sync Data
          </Button>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Mode
            </Typography>
            <Switch checked={darkMode} onChange={toggleTheme} color="primary" />
          </Box>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Avatar Name</TableCell>
                <TableCell>Performance Score</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.ID}>
                  <TableCell>{row.ID}</TableCell>
                  <TableCell>{row.Avatar_Name}</TableCell>
                  <TableCell>{row.Performance_Score}</TableCell>
                  <TableCell>
                    <Button color="primary" onClick={() => handleOpen(row)} variant="outlined" sx={{ mr: 1 }}>
                      Edit
                    </Button>
                    <Button color="secondary" onClick={() => deleteGoogleSheet(row.ID)} variant="outlined">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{formData.ID ? "Edit Entry" : "Add New Entry"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please fill out the form to {formData.ID ? "edit" : "add"} an entry.
            </DialogContentText>
            <TextField autoFocus margin="dense" name="ID" label="ID" type="text" fullWidth value={formData.ID} onChange={handleChange} />
            <TextField margin="dense" name="Avatar_Name" label="Avatar Name" type="text" fullWidth value={formData.Avatar_Name} onChange={handleChange} />
            <TextField
              margin="dense"
              name="Performance_Score"
              label="Performance Score"
              type="text"
              fullWidth
              value={formData.Performance_Score}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={() => (formData.ID ? updateGoogleSheet(formData.ID) : createGoogleSheet())} color="primary">
              {formData.ID ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} message="Operation Successful!" />
      </Container>
    </ThemeProvider>
  );
};

export default App;
