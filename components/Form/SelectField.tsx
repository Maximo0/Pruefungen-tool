import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface SelectFieldProps {
  item: string;
  list: Array<any>;
  label: string;
  onChange: (event: any) => void;
  nullOption?: boolean;
}

export default function SelectField({
  item,
  list,
  label = "Select",
  onChange,
  nullOption = false,
}: SelectFieldProps) {
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
    <FormControl sx={{ flex: 1, width: "100%"}}>
      <InputLabel id={`${label}-Label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-Label`}
        label={label}
        onChange={onChange}
        value={item}
        MenuProps={MenuProps}
      >
        {nullOption ? (
          <MenuItem value="" selected>
            None
          </MenuItem>
        ) : null}
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
