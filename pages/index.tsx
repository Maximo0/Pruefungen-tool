import DBTable from "@/components/Data/DBTable";
import MultiSelectField from "@/components/Form/MultiSelectField";
import SelectField from "@/components/Form/SelectField";
import Loading from "@/components/Loading/Loading";
import initPocketbase from "@/helpers/initPocketbase";
import { authData } from "@/types/user";
import {
  Avatar,
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  InputBase,
  Paper,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { Logout, Upload, Password } from "@mui/icons-material";
import { useTheme, alpha } from "@mui/material/styles";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";

function getCategoryParams(params: any[]) {
  if (params.length <= 0) return "";
  const query = params
    .map((param: any) => `kategorien.name?='${param}'`)
    .join("||");
  return `&&(${query})`;
}

function getSemesterParams(params: any[]) {
  if (params.length <= 0) return "";
  const query = params
    .map((param: string) => {
      let paramArray = param.split(" ");
      return `(semester.semester='${paramArray[0]}'&&semester.jahr=${paramArray[1]})`;
    })
    .join("||");
  return `&&(${query})`;
}

// Fetcher for useSWR
const fetcher = (...args: [RequestInfo, RequestInit?]): Promise<any> => {
  return fetch(...args).then((res: Response) => res.json());
};

export default function Home({
  isLoggedIn,
  authData,
}: {
  isLoggedIn: boolean;
  authData: authData;
}) {
  // Fetch data from api route to build the task table
  const tableData = useSWR("/api/categories", fetcher);
  const theme = useTheme();

  // Searchbar param
  const [query, setQuery] = useState("");
  // Task table params
  const [tasks, setTasks] = useState([]);
  const [taskAmount, setTaskAmount] = useState(30);
  const [maxTasks, setMaxTasks] = useState(-1);
  // Filter params
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBereich, setSelectedBereich] = useState("");
  const [selectedSemester, setSelectedSemester] = useState([]);
  // Loading state
  const [isLoading, setLoading] = useState(true);

  // Profile Icon functions
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Show more Button component
  const ShowMoreButton = () => {
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

  // Search for tasks using the query param
  useEffect(() => {
    const timer = setTimeout(() => {
      // Build the URLSearchParams object
      const params = new URLSearchParams({
        page: "1",
        perPage: taskAmount.toString(),
        expand: "semester,bereich,kategorien,pruefung",
        filter: `name~'${query}'&&bereich.name~'${selectedBereich}'${getSemesterParams(
          selectedSemester
        )}${getCategoryParams(selectedCategories)}`,
      });

      // Fetch the data
      fetch(
        `${process.env.PocketbaseIP}/api/collections/aufgaben/records?${params}`
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          // Set the data
          setTasks(data?.items);
          setMaxTasks(data?.totalItems);
          if (data?.items.length < 30) setTaskAmount(30);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 400);

    return () => clearTimeout(timer);
  }, [
    query,
    taskAmount,
    selectedCategories,
    selectedBereich,
    selectedSemester,
  ]);

  // Change semester params when semester is selected
  useEffect(() => {
    getSemesterParams(selectedSemester);
  }, [selectedSemester]);

  // Clear all filters
  function clearFilters() {
    setSelectedCategories([]);
    setSelectedBereich("");
    setSelectedSemester([]);
  }

  return (
    <>
      <Head>
        <title>Prüfungen</title>
      </Head>
      <Box>
        <AppBar position="sticky">
          <Toolbar sx={{ gap: "1rem" }}>
            <Box sx={{ flexGrow: 1 }} />
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
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "row-reverse",
              }}
            >
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar sx={{ width: 32, height: 32 }}></Avatar>
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          // onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem>
            <Avatar /> {authData.username}
          </MenuItem>
          <Divider />
          <MenuItem
            component={Link}
            href="/upload"
            disabled={authData.role == "gast" || true}
          >
            <ListItemIcon>
              <Upload fontSize="small" />
            </ListItemIcon>
            Upload (WIP)
          </MenuItem>
          <MenuItem
            component={Link}
            href="/change-password"
            disabled={authData.id == "e1mpp76y4mloqp0"}
          >
            <ListItemIcon>
              <Password fontSize="small" />
            </ListItemIcon>
            Passwort ändern
          </MenuItem>
          <MenuItem component={Link} href="/logout">
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ textAlign: "center", marginTop: "1rem" }}
          >
            Prüfungen
          </Typography>
          {tableData.data != undefined ? (
            <Box sx={{ display: "flex", gap: "1rem", width: 800 }}>
              <MultiSelectField
                item={selectedCategories}
                list={tableData.data.categories}
                label="Kategorien"
                onChange={(event: any) => {
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
                onChange={(event: any) => {
                  setSelectedBereich(event.target.value);
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

        {isLoading || tableData.isLoading ? (
          <Loading />
        ) : (
          <Container className="tableContent">
            <DBTable data={tasks} authData={authData} />
            {tasks.length < maxTasks && ShowMoreButton()}
          </Container>
        )}
      </Box>
    </>
  );
}

function FilterList({
  button = true,
  list,
  clearFilters,
}: {
  button?: boolean;
  list: any;
  clearFilters: any;
}) {
  if (list.selectedCategories.length + list.selectedSemester.length <= 0)
    return <Box></Box>;
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
        {button && <Button onClick={clearFilters}>Clear Filters</Button>}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", m: 1 }}>
        {list.selectedCategories.map((item: string) => {
          return <Chip key={item} label={item} />;
        })}
        {list.selectedSemester.map((item: string) => {
          return <Chip key={item} label={item} />;
        })}
      </Box>
    </Box>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const pb = await initPocketbase(context);

  const authData = JSON.parse(JSON.stringify(pb.authStore));  

  if (!pb.authStore.isValid) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      isLoggedIn: pb.authStore.isValid,
      authData: authData.baseModel,
    },
  };
}
