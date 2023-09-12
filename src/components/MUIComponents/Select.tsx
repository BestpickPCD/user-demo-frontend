/* eslint-disable arrow-body-style */
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select as MUISelect,
  SelectProps,
  TextField,
} from "@mui/material";
import { memo, ReactNode } from "react";
import { Controller } from "react-hook-form";
export interface MUISelectProps extends SelectProps {
  control?: any;
  name: string;
  label: string | ReactNode;
  isFetching?: boolean;
  options: { id: number | string; name: string; value: string | number }[];
  errors?: any;
  onSearch?: (value: string) => void;
  setSelected?: (value: any) => void;
  searchTerm?: string;
}

const Select = ({
  control,
  name,
  label,
  options,
  isFetching,
  errors,
  searchTerm,
  onSearch,
  setSelected,
  ...props
}: MUISelectProps): JSX.Element => {
  const onSelected = (value: {
    id: number | string;
    name: string;
    value: string | number;
  }) => {
    setSelected?.(value);
  };
  return control ? (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormControl fullWidth>
          <InputLabel
            id="demo-simple-select-label"
            sx={{
              color: errors?.[name] && !field.value ? "#FF1943" : "inherit",
            }}
          >
            {label}
          </InputLabel>
          <MUISelect
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label={label}
            error={!!errors?.[name] && !field.value}
            {...field}
            {...props}
            value={field?.value || ""}
          >
            {onSearch && (
              <ListSubheader>
                <TextField
                  size="small"
                  autoFocus
                  placeholder="Type to search..."
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  value={searchTerm}
                  onChange={(e) => onSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key !== "Escape") {
                      e.stopPropagation();
                    }
                  }}
                />
              </ListSubheader>
            )}
            {options?.map((item) => (
              <MenuItem
                key={item.id}
                value={item.value}
                onKeyDown={(e) => e.stopPropagation()}
                onClick={() => onSelected(item)}
              >
                {item.name}
              </MenuItem>
            ))}
            {isFetching && (
              <Box
                display="flex"
                justifyContent="center"
                marginTop="12px"
                marginBottom="12px"
              >
                <CircularProgress size={32} disableShrink thickness={3} />
              </Box>
            )}
          </MUISelect>
          {errors?.[name] && !field.value && (
            <FormHelperText
              sx={{
                color: "#FF1943",
              }}
            >
              {errors?.[name]?.message}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  ) : (
    <FormControl fullWidth>
      <InputLabel
        id="demo-simple-select-label"
        sx={{
          color: errors?.[name] ? "#FF1943" : "inherit",
        }}
      >
        {label}
      </InputLabel>
      <MUISelect
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        label={label}
        {...props}
        error={!!errors?.[name]}
      >
        {options?.map((item) => (
          <MenuItem key={item.id} value={item.value}>
            {item.name}
          </MenuItem>
        ))}
      </MUISelect>
      {!!errors?.[name] && (
        <FormHelperText
          sx={{
            color: "#FF1943",
          }}
        >
          {errors?.[name]?.message}
        </FormHelperText>
      )}
    </FormControl>
  );
};
export default memo(Select);
