"use client";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  InputBase,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import DBTable from "../components/DBTable";
import Loading from "./loading";

function getCategoryParams(params) {
  if (params.length <= 0) return "";
  const query = params.map((param) => `kategorien.name?='${param}'`).join("||");
  return `&&(${query})`;
}

function getSemesterParams(params) {
  console.log(params);
  if (params.length <= 0) return "";
  const query = params.map((param) => {
    console.log(param);
    param = param.split(" ");
    return `(semester.semester='${param[0]}'&&semester.jahr=${param[1]})`
  }).join("||")
  console.log(`&&(${query})`);
  return `&&(${query})`;
}

export default function taskList() {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [bereiche, setBereiche] = useState([]);
  const [selectedBereich, setSelectedBereich] = useState("");
  const [semester, setSemester] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskAmount, setTaskAmount] = useState(30);
  const [maxTasks, setMaxTasks] = useState(-1);
  const [isLoading, setLoading] = useState(true);

  const showMoreButtonComponent = () => {
    return (
      <Box textAlign="center">
        <Button
          sx={{ width: "20rem", padding: ".75rem" }}
          onClick={() => {
            setTaskAmount(taskAmount + 30);
          }}
        >
          Mehr laden
        </Button>
      </Box>
    );
  };

  useEffect(() => {
    fetch(`http://127.0.0.1:8090/api/collections/kategorie/records`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data?.items);
      });
  }, []);

  useEffect(() => {
    fetch(`http://127.0.0.1:8090/api/collections/bereich/records`)
      .then((res) => res.json())
      .then((data) => {
        setBereiche(data?.items);
      });
  }, []);

  useEffect(() => {
    fetch(`http://127.0.0.1:8090/api/collections/semester/records`)
      .then((res) => res.json())
      .then((data) => {
        setSemester(data?.items);
      });
  }, []);

  // Handles everything with the search query
  useEffect(() => {
    // Timer to stop repeated api calls on key press
    const timer = setTimeout(() => {
      fetch(
        "http://127.0.0.1:8090/api/collections/aufgaben/records?" +
          new URLSearchParams({
            page: 1,
            perPage: taskAmount,
            expand: "semester,bereich,kategorien",
            filter: `name~'${query}'&&bereich.name~'${selectedBereich}'${getSemesterParams(selectedSemester)}${getCategoryParams(selectedCategories)}`,
          })
      )
        .then((res) => res.json())
        .then((data) => {
          setTasks(data?.items);
          setMaxTasks(data.totalItems);
          if (data?.items.length < 30) setTaskAmount(30);
          setLoading(false);
        });
    }, 250);

    return () => clearTimeout(timer);
  }, [
    query,
    taskAmount,
    selectedCategories,
    selectedBereich,
    selectedSemester,
  ]);

  useEffect(() => {
    getSemesterParams(selectedSemester);
  }, [selectedSemester]);

  if (isLoading) return <Loading />;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <Typography variant="h4" component="h1" sx={{ textAlign: "center" }}>
          Aufgaben Liste
        </Typography>
        <Paper
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 600,
          }}
        >
          <InputBase
            placeholder="Aufgaben suchen"
            sx={{ flex: 1 }}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
        </Paper>
        <Box sx={{ display: "flex", gap: "1rem" }}>
          <SelectFilter
            multiSelect={true}
            onChange={(event) => {
              const {
                target: { value },
              } = event;
              setSelectedCategories(
                typeof value === "string" ? value.split(",") : value
              );
            }}
            label="Kategorie"
            list={categories}
            selectedList={selectedCategories}
          />

          <SelectFilter
            onChange={(e) => {
              setSelectedBereich(e.target.value);
            }}
            label="Bereich"
            list={bereiche}
            selectedItem={selectedBereich}
          />

          <SelectFilter
            multiSelect={true}
            // onChange={(e) => {
            //   setSelectedSemester(e.target.value);
            // }}
            onChange={(event) => {
              const {
                target: { value },
              } = event;
              setSelectedSemester(
                typeof value === "string" ? value.split(",") : value
              );
            }}
            label="Semester"
            list={semester}
            selectedList={selectedSemester}
          />
        </Box>
        <Box>
          <Typography variant="h6">Selected Filters</Typography>
          {/* TODO: Add pills for selected filters for easy removal */}
          {selectedCategories.map((item) => {
            return <Chip key={item} label={item}/>
          })}
          {selectedSemester.map((item) => {
            return <Chip key={item} label={item}/>
          })}
        </Box>
      </Box>
      <Container className="tableContent">
        <DBTable data={tasks} />
        {tasks.length < maxTasks ? showMoreButtonComponent() : null}
      </Container>
    </Box>
  );
}

// Menu Props for the Select
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

// Select Filter component
function SelectFilter({
  multiSelect = false,
  onChange,
  label = "Select",
  list = [],
  selectedList = [],
  selectedItem = "",
}) {
  if (multiSelect)
    return (
      <FormControl sx={{ m: 1, width: 250 }}>
        <InputLabel id={`${label}-Label`}>{label}</InputLabel>
        <Select
          labelId={`${label}-Label`}
          label={label}
          multiple
          value={selectedList}
          onChange={onChange}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {list.map((item) => {
            if (!item.name) item.name = `${item.semester} ${item.jahr}`;
            return (
              <MenuItem key={item.id} value={item.name}>
                <Checkbox checked={selectedList.indexOf(item.name) > -1} />
                <ListItemText primary={item.name} />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );

  return (
    <FormControl sx={{ m: 1, width: 250 }}>
      <InputLabel id={`${label}-Label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-Label`}
        label={label}
        value={selectedItem}
        onChange={onChange}
        MenuProps={MenuProps}
      >
        {list.map((item) => {
          if (!item.name) item.name = `${item.semester} ${item.jahr}`;
          return (
            <MenuItem key={item.id} value={item.name}>
              {item.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
