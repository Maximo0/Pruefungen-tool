"use client";
import {
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Box } from "@mui/system";
import { useState } from "react";

export default function DBTable(props) {
  const [open, setOpen] = useState(false);
  const [linkParams, setLinkParams] = useState(["",""])
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  function taskItem(task) {
    let categoryField;
    if (!task.expand.kategorien) {
      categoryField = <TableCell>None</TableCell>;
    } else {
      const kategorien = task.expand.kategorien.map((kategorie) => {
        return kategorie.name;
      });
      categoryField = <TableCell>{kategorien.join(", ")}</TableCell>;
    }

    const styles = {
      cursor: "pointer",
      transition: "250ms",
      "&:hover": {
        background: "#f6f6f6",
      },
    };

    return (
      <TableRow key={task.id}>
        <TableCell
          sx={styles}
          onClick={() => {
            console.log(task.expand.pruefung);
            setLinkParams([task.expand.pruefung.id, task.expand.pruefung.file])
            handleOpen();
          }}
        >
          {task.name}
        </TableCell>
        {categoryField}
        <TableCell>{task.expand.bereich.name}</TableCell>
        <TableCell>{`${task.expand.semester.semester} ${task.expand.semester.jahr}`}</TableCell>
        <TableCell>
          <IconButton href={`/edit/${task.id}`}>
            <EditIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Box>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60vw",
            height: "90vh",
          }}
        >
          <iframe
            height="100%"
            width="100%"
            src={`http://217.160.69.95:8090/api/files/x8v82l4vw28fda0/${linkParams[0]}/${linkParams[1]}#view=fit`}
            frameborder="0"
            style={{ userSelect: "none" }}
          ></iframe>
        </Box>
      </Modal>
      <TableContainer components={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Aufgabe</TableCell>
              <TableCell>Kategorie</TableCell>
              <TableCell>Bereich</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.map((task) => {
              return taskItem(task);
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
