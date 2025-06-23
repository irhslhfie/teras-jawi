import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Grid,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';

const SearchAndFilter = ({
  searchValue = '',
  onSearchChange,
  filters = {},
  onFilterChange,
  filterOptions = {},
  onClearFilters,
  placeholder = "Search..."
}) => {
  const handleFilterChange = (filterKey, value) => {
    onFilterChange({
      ...filters,
      [filterKey]: value
    });
  };

  const handleClearAll = () => {
    onSearchChange('');
    onClearFilters();
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Search Field */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Filter Dropdowns */}
        {Object.entries(filterOptions).map(([key, options]) => (
          <Grid item xs={12} sm={6} md={2} key={key}>
            <FormControl fullWidth>
              <InputLabel>{options.label}</InputLabel>
              <Select
                value={filters[key] || ''}
                label={options.label}
                onChange={(e) => handleFilterChange(key, e.target.value)}
              >
                <MenuItem value="">
                  <em>Semua</em>
                </MenuItem>
                {options.items.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ))}

        {/* Clear Filters Button */}
        <Grid item xs={12} md={2}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClearAll}
            sx={{ height: '56px' }}
          >
            Clear All
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SearchAndFilter;