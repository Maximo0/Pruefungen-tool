"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useState } from "react";
import PocketBase from "pocketbase";
import Loading from "./loading";

export default function UploadHub() {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [inputFileType, setInputFileType] = useState("");
  const [selectFolder, setSelectFolder] = useState(null);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
    setTimeout(() => {
      if (files != null) setFiles(null);
      if (selectFolder != null) setSelectFolder(null);
    }, 100);
  };

  async function UploadToDB() {
    if(!files) return;
    const pb = new PocketBase("http://127.0.0.1:8090");
    setLoading(true)

    if (inputFileType == ".pdf") {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const upload = await pb.collection("pruefungen").create(formData);
        // console.log(upload.file);
      }
      console.log("Uploaded PDFs!");
    }
    else if (inputFileType == ".csv") {
      let semester = await pb.collection("semester").getFullList(200);
      semester = createDataReference(semester);
      console.log(semester);
  
      let bereich = await pb.collection("bereich").getFullList(200);
      bereich = createDataReference(bereich);
      console.log(bereich);
  
      await data.map(async (entry) => {
        // Filter schlechte einträge
        if (entry.length <= 2) return;
        if (entry[0] == null || entry[1] == null || entry[2] == null) return;
  
        // Sucht nach den richtigen eintrags IDs
        const semester_id = semester.find((o) => o.name == entry[1]).id;
        const bereich_id = bereich.find((o) => o.name == entry[2]).id;
  
        const record = {
          name: entry[0],
          bereich: bereich_id,
          semester: semester_id,
          kategorien: [],
        };
  
        // Trägt diese in der Datenbank ein
        const upload = await pb.collection("aufgaben").create(record, { $autoCancel: false });
      });
    }

    setLoading(false)
    handleDialogClose();
  }

  if (loading) return <Loading />

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ position: "absolute", top: "5vh", left: "5vw" }}>
        <Button size="large" startIcon={<ArrowBackIosNewIcon />} href="/">
          Go back
        </Button>
      </Box>
      <Paper
        color="secondary"
        elevation={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          position: "absolute",
          padding: "2rem",
        }}
      >
        <Typography variant="h4" align="center">
          Upload files
        </Typography>
        <Button
          variant="outlined"
          onClick={() => {
            handleDialogOpen();
            setInputFileType(".csv");
          }}
        >
          Upload .csv file
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            handleDialogOpen();
            setInputFileType(".pdf");
          }}
        >
          Upload .pdf file
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            handleDialogOpen();
            setSelectFolder(".pdf")
            setSelectFolder("");
          }}
        >
          Upload folder with files
        </Button>
      </Paper>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle sx={{ textAlign: "center" }}>
          {selectFolder == null ? "Select files" : "Select folder with files"}
        </DialogTitle>
        <DialogTitle>
          <input
            type="file"
            onChange={(e) => {
              const inputFiles = e.target.files;
              setFiles(inputFiles);
            }}
            accept={inputFileType}
            multiple
            webkitdirectory={selectFolder}
          />
        </DialogTitle>
        {files ? (
          <DialogContent dividers={true}>
            <List>
              {files
                ? Object.values(files).map((file) => {
                    return (
                      <ListItem key={file.name}>
                        <ListItemText primary={file.name} />
                      </ListItem>
                    );
                  })
                : null}
            </List>
          </DialogContent>
        ) : null}

        <DialogActions>
          <Button
            onClick={() => {
              handleDialogClose();
            }}
          >
            Cancel
          </Button>
          <Button onClick={UploadToDB}>Upload</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
