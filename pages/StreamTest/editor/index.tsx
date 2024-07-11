import {
  AppBar,
  Toolbar,
  Button,
  Modal,
  Box,
  TextField,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
} from "@mui/material";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";

interface JsonData {
  [key: string]: any;
}

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  borderRadius: "0",
  outline: "none",
};

const closeButtonStyle = {
  position: "absolute" as "absolute",
  top: 8,
  right: 8,
  color: "#000000",
};

const EditorPage: React.FC = () => {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [jsonData, setJsonData] = useState<JsonData>({});
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editValue, setEditValue] = useState<any>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/editor");
      const data = await response.json();
      setJsonData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await fetch("/api/editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      setKey("");
      setValue("");
      fetchData();
      setOpenAddModal(false);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      await fetch("/api/editor", {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ key, value: editValue }),
      });
      fetchData();
      setEditValue("");
      setKey("");
      setOpenEditModal(false);
    } catch (error) {
      console.error("Error editing item:", error);
    }
  };

  const editItem = async (key: string, value: any) => {
    setKey(key);
    setEditValue(value);
    setOpenEditModal(true);
  };

  const deleteItem = async (key: string) => {
    try {
      await fetch("/api/editor", {
        method: "DELETE",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ key }),
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleModalClose = () => {
    setEditValue("");
    setKey("");
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#EFF0F1",
        color: "#000000",
        fontFamily: "system-ui",
      }}
    >
      <AppBar
        style={{ backgroundColor: "#fff", borderBottom: "1px solid #F8F8FA" }}
        elevation={0}
        position="static"
      >
        <Toolbar
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/StreamTest"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textDecoration: "none",
              color: "#000000",
              fontWeight: "700",
              fontSize: "15px",
            }}
          >
            <ArrowBackIcon sx={{ mr: 1 }} />
            Back to StreamTest
          </Link>
          <Button
            style={{ gap: "5px", fontSize: "15px" }}
            onClick={() => setOpenAddModal(true)}
          >
            Add New
            <AddCircleIcon sx={{ marginTop: "1px" }} />
          </Button>
        </Toolbar>
      </AppBar>
      <Modal
        open={openAddModal}
        onClose={() => {
          setOpenAddModal(false);
          handleModalClose();
        }}
      >
        <Box sx={modalStyle}>
          <IconButton
            sx={closeButtonStyle}
            onClick={() => {
              setOpenAddModal(false);
              handleModalClose();
            }}
          >
            <CloseIcon />
          </IconButton>
          <TextField
            label="Key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
            fullWidth
            sx={{ marginTop: "30px" }}
          />
          <TextField
            label="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            fullWidth
            multiline
            minRows={3}
          />
          <Button
            variant="outlined"
            onClick={handleAddSubmit}
            style={{
              fontFamily: "system-ui",
              width: "100%",
              alignSelf: "center",
            }}
          >
            Submit
          </Button>
        </Box>
      </Modal>
      <Modal
        open={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
          handleModalClose();
        }}
      >
        <Box sx={modalStyle}>
          <IconButton
            sx={closeButtonStyle}
            onClick={() => {
              setOpenEditModal(false);
              handleModalClose();
            }}
          >
            <CloseIcon />
          </IconButton>
          <TextField
            label="Key"
            value={key}
            disabled
            fullWidth
            sx={{ marginTop: "30px" }}
          />
          <TextField
            label="Value"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            required
            fullWidth
            multiline
            minRows={3}
          />
          <Button
            variant="outlined"
            onClick={handleEditSubmit}
            style={{
              fontFamily: "system-ui",
              width: "100%",
              alignSelf: "center",
            }}
          >
            Update
          </Button>
        </Box>
      </Modal>
      <TableContainer
        component={Paper}
        style={{
          width: "100%",
          maxWidth: "1000px",
          margin: "20px 0",
          backgroundColor: "#ffffff",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "10px" }}></TableCell>
              <TableCell style={{ width: "150px" }}>Key</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(jsonData).map((key, index) => (
              <TableRow key={key}>
                <TableCell>{index + 1}</TableCell>
                <TableCell
                  style={{
                    width: "50px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {key}
                </TableCell>
                <TableCell
                  style={{
                    maxWidth: "150px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {jsonData[key]}
                </TableCell>
                <TableCell style={{ width: "50px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    <Button
                      variant="outlined"
                      style={{
                        borderColor: "gray",
                        color: "#000000",
                        backgroundColor: "transparent",
                        padding: "8px 10px",
                        fontSize: "14px",
                        fontFamily: "system-ui",
                        textAlign: "center",
                        borderRadius: "2px",
                        height: "40px",
                        width: "80px",
                        fontWeight: "500",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.borderColor = "gray")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.borderColor = "#000000")
                      }
                      onClick={() => editItem(key, jsonData[key])}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      style={{
                        borderColor: "gray",
                        color: "#000000",
                        backgroundColor: "transparent",
                        padding: "8px 10px",
                        fontSize: "14px",
                        fontFamily: "system-ui",
                        textAlign: "center",
                        borderRadius: "2px",
                        height: "40px",
                        width: "80px",
                        fontWeight: "500",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.borderColor = "gray")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.borderColor = "#000000")
                      }
                      onClick={() => deleteItem(key)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default EditorPage;
