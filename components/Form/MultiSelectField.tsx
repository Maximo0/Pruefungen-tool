import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";

interface MultiSelectFieldProps {
  item: string[];
  list: Array<any>;
  label: string;
  onChange: (event: any) => void;
}

export default function MultiSelectField({
  item,
  list,
  label = "Select",
  onChange,
}: MultiSelectFieldProps) {
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

  return (
    <FormControl sx={{ flex: 1, width: "100%" }}>
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
