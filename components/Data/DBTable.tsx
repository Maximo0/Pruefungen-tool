// Mui Components
import {
  Box,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
// Next Components
import { useState } from "react";
import { GetServerSidePropsContext } from "next";
import initPocketbase from "@/helpers/initPocketbase";
import { authData } from "@/types/user";

export default function DBTable({
  data,
  authData,
}: {
  data: any;
  authData: authData;
}) {
  const [open, setOpen] = useState(false);
  const [linkParams, setLinkParams] = useState(["", ""]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  function taskItem(task: any) {
    let categoryField;
    if (!task.expand.kategorien) {
      categoryField = <TableCell>None</TableCell>;
    } else {
      const kategorien = task.expand.kategorien.map((kategorie: any) => {
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
            setLinkParams([task.expand.pruefung.id, task.expand.pruefung.file]);
            handleOpen();
          }}
        >
          {task.name}
        </TableCell>
        {categoryField}
        <TableCell>{task.expand.bereich.name}</TableCell>
        <TableCell>{`${task.expand.semester.semester} ${task.expand.semester.jahr}`}</TableCell>
        {authData.role != "gast" && (
          <TableCell>
            <IconButton href={`/edit/${task.id}`}>
              <EditIcon />
            </IconButton>
          </TableCell>
        )}
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
          <embed
            height="100%"
            width="100%"
            src={`${process.env.PocketbaseIP}/api/files/x8v82l4vw28fda0/${linkParams[0]}/${linkParams[1]}#view=fit`}
            style={{ userSelect: "none" }}
          />
        </Box>
      </Modal>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Aufgabe</TableCell>
              <TableCell>Kategorie</TableCell>
              <TableCell>Bereich</TableCell>
              <TableCell>Semester</TableCell>
              {authData.role != "gast" && <TableCell></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((task: object) => {
              return taskItem(task);
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
