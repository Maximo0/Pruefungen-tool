import MultiSelectField from "@/components/Form/MultiSelectField";
import initPocketbase from "@/helpers/initPocketbase";
import { authData } from "@/types/user";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  InputBase,
  ListItemIcon,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
} from "@mui/material";
import useSWR from "swr";
import EditIcon from "@mui/icons-material/Edit";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import { Logout, Upload, Password } from "@mui/icons-material";
import Link from "next/link";

// Fetcher for useSWR
const fetcher = (...args: [RequestInfo, RequestInit?]): Promise<any> => {
  return fetch(...args).then((res: Response) => res.json());
};

function getCategoryParams(params: any[]) {
  if (params.length <= 0) return "";
  const query = params
    .map((param: any) => `kategorien.name?='${param}'`)
    .join("||");
  return `&&(${query})`;
}

interface Data {
  id: any;
  aufgabe: string;
  kategorie: string;
  bereich: number;
  semester: string;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  alignRight: boolean;
}
const headCells: readonly HeadCell[] = [
  { id: "aufgabe", disablePadding: false, label: "Aufgabe", alignRight: false },
  {
    id: "kategorie",
    disablePadding: false,
    label: "Kategorie",
    alignRight: true,
  },
  { id: "bereich", disablePadding: false, label: "Bereich", alignRight: true },
  {
    id: "semester",
    disablePadding: false,
    label: "Semester",
    alignRight: true,
  },
];

/**
 * TableToolbar component
 * @returns
 */
function TaskTableToolbar({ authData }: { authData: authData }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Toolbar
        sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, bgcolor: "lightblue" }}
      >
        <Typography variant="h6" id="tableTitle" component="div">
          Prüfungs Aufgaben
        </Typography>

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

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
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
          disabled={authData.role == "gast"}
        >
          <ListItemIcon>
            <Upload fontSize="small" />
          </ListItemIcon>
          Upload
        </MenuItem>
        <MenuItem
          component={Link}
          href="/change-password"
          disabled={authData.role == "gast"}
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
    </>
  );
}

type Order = "asc" | "desc";

interface TaskTableProps {
  order: Order;
  orderBy: string;
}

/**
 * Tablehead component
 * @param props
 * @returns
 */
function TaskTableHead(props: TaskTableProps, authData: authData) {
  const { order, orderBy } = props;

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sx={{ backgroundColor: "lightBlue" }}
          >
            {headCell.label}
          </TableCell>
        ))}
        {authData.role != "gast" && (
          <TableCell sx={{ backgroundColor: "lightBlue" }}></TableCell>
        )}
      </TableRow>
    </TableHead>
  );
}

/**
 * TaskTableFilter component
 * @returns
 */
function TaskTableFilter({
  query,
  setQuery,
  DBdata,
  categories,
  setCategories,
  clearFilters,
}: {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  DBdata: any;
  categories: any;
  setCategories: any;
  clearFilters: any;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        p: 2,
      }}
    >
      <Paper sx={{ display: "flex", flexGrow: 2 }}>
        <InputBase
          sx={{ padding: "0.3rem", width: "100%" }}
          placeholder="Aufgaben suchen"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
      </Paper>
      <Box
        sx={{ display: "flex", flexGrow: 1, gap: ".5rem", maxWidth: "25vw" }}
      >
        <MultiSelectField
          item={categories}
          list={DBdata}
          label={"Kategorien"}
          onChange={(event: any) => {
            const {
              target: { value },
            } = event;
            setCategories(typeof value === "string" ? value.split(",") : value);
          }}
        />
      </Box>
      {categories.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexShrink: 1,
            gap: ".25rem",
            flexBasis: "100%",
          }}
        >
          <Typography variant="h6">
            Filter {<Button onClick={clearFilters}>Clear Filters</Button>}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              flexShrink: 1,
              gap: ".25rem",
              flexBasis: "100%",
            }}
          >
            {categories.map((item: string) => (
              <Chip
                key={item}
                label={item}
                onDelete={() => {
                  setCategories((prevCategories: string[]) =>
                    prevCategories.filter((category) => category !== item)
                  );
                }}
              />
            ))}
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}

export default function TaskTableView({
  isLoggedIn,
  authData,
}: {
  isLoggedIn: boolean;
  authData: authData;
}) {
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("semester");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [count, setCount] = useState(0);

  // Task related states
  const [query, setQuery] = useState("");
  const [tasks, setTasks] = useState([]);

  // Filter Options
  const DBdata = useSWR("/api/categories", fetcher);
  const [categories, setCategories] = useState([]);

  // Modal states
  const [open, setOpen] = useState(false);
  const [linkParams, setLinkParams] = useState(["", "", ""]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        perPage: rowsPerPage.toString(),
        expand: "semester,bereich,kategorien,pruefung",
        filter: `name~'${query}'${getCategoryParams(categories)}`,
      });

      fetch(
        `${process.env.PocketbaseIP}/api/collections/aufgaben/records?${params}`
      ).then((response) => {
        response.json().then((data) => {
          setTasks(data.items);
          setCount(data.totalItems);
        });
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [query, page, categories]);

  /**
   * Handle open modal
   */
  const handleOpen = () => {
    setOpen(true);
  };
  /**
   * Handle close modal
   */
  const handleClose = () => {
    setOpen(false);
  };

  // Styles for table cell
  const styles = {
    cursor: "pointer",
    transition: "250ms",
    "&:hover": {
      background: "#f6f6f6",
    },
  };

  /**
   * Leert die Filter und setzt die seiten zahl auf 0
   */
  function clearFilters() {
    setCategories([]);
    setPage(0);
  }

  /**
   * Handle page change
   * @param event
   * @param newPage
   */
  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  /**
   * TaskItem component
   * @param task
   * @returns
   */
  function TaskItem(task: any) {
    let categoryField;
    if (!task.expand.kategorien) {
      categoryField = "";
    } else {
      const kategorien = task.expand.kategorien.map((kategorie: any) => {
        return kategorie.name;
      });
      categoryField = kategorien.join(", ");
    }

    return (
      <TableRow key={task.id}>
        <TableCell
          sx={styles}
          onClick={() => {
            setLinkParams([
              task.expand.pruefung.id,
              task.expand.pruefung.file,
              task.page,
            ]);
            handleOpen();
          }}
        >
          {task.name}
        </TableCell>
        <TableCell align="right">{categoryField}</TableCell>
        <TableCell align="right">{task.expand.bereich.name}</TableCell>
        <TableCell align="right">{`${task.expand.semester.semester} ${task.expand.semester.jahr}`}</TableCell>
        {authData.role != "gast" && (
          <TableCell sx={{ padding: ".5rem" }}>
            <IconButton href={`/edit/${task.id}`}>
              <EditIcon />
            </IconButton>
          </TableCell>
        )}
      </TableRow>
    );
  }

  /**
   * Main JSX Component
   * @returns
   */
  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <TaskTableToolbar authData={authData} />
        {DBdata.data != undefined ? (
          <TaskTableFilter
            query={query}
            setQuery={setQuery}
            DBdata={DBdata.data.categories}
            categories={categories}
            setCategories={setCategories}
            clearFilters={clearFilters}
          />
        ) : null}
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
              src={`${process.env.PocketbaseIP}/api/files/pruefungen/${
                linkParams[0]
              }/${linkParams[1]}#view=fit&page=${parseInt(linkParams[2]) + 1}`}
              style={{ userSelect: "none" }}
            />
          </Box>
        </Modal>
        <TableContainer sx={{ flexGrow: 1 }}>
          <Table stickyHeader aria-label="sticky table">
            <TaskTableHead
              order={order}
              orderBy={orderBy}
              // authData={authData}
            />
            <TableBody>
              {tasks.map((task: any) => {
                return TaskItem(task);
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          sx={{
            flexShrink: 1,
            overflow: "visible",
            borderTop: "1px solid gray",
          }}
          component="div"
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]}
          onPageChange={handlePageChange}
        />
      </Paper>
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
