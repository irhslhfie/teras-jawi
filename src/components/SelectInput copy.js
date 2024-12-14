export default function MultipleSelectChip({ title, names = [], personName, setPersonName, multiple = false }) {
    const theme = useTheme();

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;

        if (multiple) {
            const selectedValue = typeof value === 'string' ? value.split(',') : value;
            setPersonName(selectedValue);
        } else {
            // For single selection logic
            const currentIndex = personName.indexOf(value);
            if (currentIndex === -1) {
                // Set selected value if it's not already selected
                setPersonName([value]);
            } else {
                // Clear selection if the same item is clicked again
                setPersonName([]);
            }
        }
    };

    return (
        <div>
            <FormControl sx={{ width: 140 }}>
                <InputLabel htmlFor="demo-multiple-chip-label">{title}</InputLabel>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple={multiple}
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label={title} size="medium" sx={{}} />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {multiple
                                ? selected.map((value) => (
                                    <Chip key={value} label={value} sx={{ backgroundColor: '#1565c0', color: '#ffffff' }} />
                                ))
                                : <Chip label={selected} sx={{ backgroundColor: '#1565c0', color: '#ffffff' }} />}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {names?.map((name, index) => (
                        <MenuItem
                            key={index}
                            value={name}
                            style={{
                                backgroundColor: personName?.includes(name) ? '#1565c0' : 'inherit',
                                color: personName?.includes(name) ? '#ffffff' : 'inherit',
                                fontWeight: personName?.includes(name)
                                    ? theme.typography.fontWeightMedium
                                    : theme.typography.fontWeightRegular,
                            }}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: '#1565c0',
                                    color: '#ffffff',
                                    '&:hover': {
                                        backgroundColor: '#1565c0',
                                        opacity: 0.8,
                                    },
                                },
                            }}
                        >
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}