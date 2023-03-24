"use client";
import MultiSelectField from "@/components/MultiSelectField";
import SelectField from "@/components/SelectField";
import { useTheme, alpha } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Button,
  Chip,
  InputBase,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import DBTable from "../components/DBTable";
import Loading from "./loading";
import useSWR from "swr";

function getCategoryParams(params) {
  if (params.length <= 0) return "";
  const query = params.map((param) => `kategorien.name?='${param}'`).join("||");
  return `&&(${query})`;
}

function getSemesterParams(params) {
  if (params.length <= 0) return "";
  const query = params
    .map((param) => {
      param = param.split(" ");
      return `(semester.semester='${param[0]}'&&semester.jahr=${param[1]})`;
    })
    .join("||");
  return `&&(${query})`;
}

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function TaskList() {
  const tableData = useSWR("/api/categories", fetcher);

  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBereich, setSelectedBereich] = useState("");
  const [selectedSemester, setSelectedSemester] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskAmount, setTaskAmount] = useState(30);
  const [maxTasks, setMaxTasks] = useState(-1);
  const [isLoading, setLoading] = useState(true);
  const theme = useTheme();

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

  // Handles everything with the search query
  useEffect(() => {
    // Timer to stop repeated api calls on key press
    const timer = setTimeout(() => {
      const params = new URLSearchParams({
        page: 1,
        perPage: taskAmount,
        expand: "semester,bereich,kategorien,pruefung",
        filter: `name~'${query}'&&bereich.name~'${selectedBereich}'${getSemesterParams(
          selectedSemester
        )}${getCategoryParams(selectedCategories)}`,
      });
      fetch(
        `${process.env.PocketbaseIP}/api/collections/aufgaben/records?${params}`
      )
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          setTasks(data?.items);
          setMaxTasks(data.totalItems);
          if (data?.items.length < 30) setTaskAmount(30);
          setLoading(false);
          // console.log(data.items);
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

  function clearFilters() {
    setSelectedCategories([]);
    setSelectedBereich("");
    setSelectedSemester([]);
  }

  if (isLoading && tableData.isLoading) return <Loading />;

  return (
    <Box>
      <AppBar position="sticky">
        <Toolbar sx={{gap: "1rem"}}>
          <Box sx={{ flexGrow: 1 }}>
            <Button href="/upload" color="secondary">
              Upload
            </Button>
          </Box>
          <Paper sx={{ flexGrow: 2 }}>
            <InputBase
              placeholder="Aufgaben suchen"
              sx={{
                padding: "0.3rem",
                width: "100%",
                backgroundColor: alpha(theme.palette.primary.main, 0.25),
              }}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
          </Paper>
          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "row-reverse" }}>
            <Button href="#" color="secondary">
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <Typography variant="h4" component="h1" sx={{ textAlign: "center", marginTop: "1rem"}}>
          Prüfungen
        </Typography>
        {tableData.data != undefined ? (
          <Box sx={{ display: "flex", gap: "1rem", width: 800 }}>
            <MultiSelectField
              item={selectedCategories}
              list={tableData.data.categories}
              label="Kategorien"
              onChange={(event) => {
                const {
                  target: { value },
                } = event;
                setSelectedCategories(
                  typeof value === "string" ? value.split(",") : value
                );
              }}
            />
            <SelectField
              item={selectedBereich}
              list={tableData.data.bereich}
              label="Bereich"
              onChange={(e) => {
                setSelectedBereich(e.target.value);
              }}
              nullOption={true}
            />
            <MultiSelectField
              item={selectedSemester}
              list={tableData.data.semester}
              label="Semester"
              onChange={(event) => {
                const {
                  target: { value },
                } = event;
                setSelectedSemester(
                  typeof value === "string" ? value.split(",") : value
                );
              }}
            />
          </Box>
        ) : null}
        <FilterList
          list={{ selectedCategories, selectedSemester }}
          clearFilters={clearFilters}
        />
      </Box>
      <Container className="tableContent">
        <DBTable data={tasks} existingFields={tableData.data} />
        {tasks.length < maxTasks ? showMoreButtonComponent() : null}
      </Container>
    </Box>
  );
}

function FilterList({ button = true, list, clearFilters }) {
  if (list.selectedCategories.length + list.selectedSemester.length <= 0)
    return;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6">Selected Filters</Typography>
        {button ? <Button onClick={clearFilters}>Clear Filters</Button> : null}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", m: 1 }}>
        {list.selectedCategories.map((item) => {
          return <Chip key={item} label={item} />;
        })}
        {list.selectedSemester.map((item) => {
          return <Chip key={item} label={item} />;
        })}
      </Box>
    </Box>
  );
}