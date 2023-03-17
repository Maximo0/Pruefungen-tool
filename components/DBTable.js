"use client";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";

export default function DBTable(props) {
  return (
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
  );
}

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

  return (
    <TableRow key={task.id}>
      <TableCell>{task.name}</TableCell>
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
