"use client";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { use, useEffect, useState } from "react";
import Loading from "./loading";
import useSWR from "swr";
import Link from "next/link";
import { redirect } from "next/navigation";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const fetchedData = fetch("http://localhost:3000/api/categories").then((res) =>
  res.json()
);

export default function TaskPage({ params, props }) {
  const { data, error, isLoading } = useSWR(
    `http://127.0.0.1:8090/api/collections/aufgaben/records/${params.id}?expand=semester,bereich`,
    fetcher
  );
  // Data Fields
  const [taskName, setTaskName] = useState("");
  const [bereich, setBereich] = useState("");
  const [categories, setCategories] = useState([]);
  const [semester, setSemester] = useState("");
  const [updatedData, setUpdate] = useState(false);

  const tableData = use(fetchedData);

  useEffect(() => {
    if (!data) return;

    setTaskName(data.name);
    setBereich(data.expand.bereich.name);
    setSemester(
      `${data.expand.semester.semester} ${data.expand.semester.jahr}`
    );
    if (data.kategorien.length != 0) {
      setCategories(
        data.kategorien.map((entry) => {
          return tableData.categories.find((category) => category.id === entry)
            .name;
        })
      );
    }
  }, [data]);

  useEffect(() => {
    if (updatedData) redirect("/");
  }, [updatedData]);

  // Load page if data is still being fetched
  if (isLoading) return <Loading />;

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={3}>
        <Card sx={{ marginTop: "2rem", width: "40rem" }}>
          <CardHeader
            avatar={
              <IconButton component={Link} href="#">
                <ArrowBackIosNewIcon />
              </IconButton>
            }
            title="Aufgabe"
            subheader={"ID: " + data.id}
          />

          <CardContent
            sx={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <FormControl sx={{ width: "100%" }}>
              <TextField label="Aufgaben name" defaultValue={data.name} />
            </FormControl>
            <SelectField
              item={bereich}
              list={tableData.bereich}
              label="Bereich"
              onChange={(e) => setBereich(e.target.value)}
            />
            <SelectField
              item={semester}
              list={tableData.semester}
              label="Semester"
              onChange={(e) => setSemester(e.target.value)}
            />
            <MultiSelectField
              item={categories}
              list={tableData.categories}
              label="Kategorien"
              onChange={(event) => {
                const {
                  target: { value },
                } = event;
                setCategories(
                  typeof value === "string" ? value.split(",") : value
                );
              }}
            />
          </CardContent>
          <CardActions>
            <FormControl>
              <Button
                onClick={() => {
                  updateEntry(
                    tableData,
                    params.id,
                    taskName,
                    bereich,
                    semester,
                    categories,
                    setUpdate
                  );
                }}
              >
                Update
              </Button>
            </FormControl>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function SelectField({ item, list, label = "Select", onChange }) {
  return (
    <FormControl sx={{ flex: 1 }}>
      <InputLabel id={`${label}-Label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-Label`}
        label={label}
        onChange={onChange}
        value={item}
        MenuProps={MenuProps}
      >
        {list.map((entry) => {
          if (list[0].collectionName == "semester") {
            entry.name = `${entry.semester} ${entry.jahr}`;
          }
          return (
            <MenuItem key={entry.id} value={entry.name}>
              {entry.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

function MultiSelectField({ item, list, label = "Select", onChange }) {
  return (
    <FormControl sx={{ flex: 1 }}>
      <InputLabel id={`${label}-Label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-Label`}
        label={label}
        multiple
        value={item}
        onChange={onChange}
        renderValue={(selected) => selected.join(", ")}
        MenuProps={MenuProps}
      >
        {list.map((entry) => {
          if (!entry.name) entry.name = `${entry.semester} ${entry.jahr}`;
          return (
            <MenuItem key={entry.id} value={entry.name}>
              <Checkbox checked={item.indexOf(entry.name) > -1} />
              <ListItemText primary={entry.name} />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

function updateEntry(reference, id, name, bereich, semester, kategorien, setUpdate) {
  // Bereich ID finden
  bereich = reference.bereich.find((entry) => {
    if (entry.name == bereich) return entry;
  }).id;

  // Semester ID finden
  let split = semester.split(" ");
  semester = reference.semester.find((entry) => {
    if (entry.semester == split[0] && entry.jahr == split[1]) return entry;
  }).id;

  // Kategorien IDs finden
  kategorien = kategorien.map((kategorie) => {
    return reference.categories.find((entry) => {
      if (entry.name == kategorie) return entry;
    }).id;
  });

  fetch(`http://127.0.0.1:8090/api/collections/aufgaben/records/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      name: name,
      bereich: bereich,
      semester: semester,
      kategorien: kategorien,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  return setUpdate(true)
}
