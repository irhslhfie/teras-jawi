import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 190,
        },
    },
};

export default function MultipleSelectChipBranch({ title, names = [], personName, setPersonName, multiple = false }) {
    const theme = useTheme();

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;

        if (multiple) {
            const selectedValue = typeof value === 'string' ? value.split(',') : value;
            setPersonName(selectedValue);
        } else {
            const currentIndex = personName.indexOf(value);
            setPersonName(currentIndex === -1 ? [value] : []);
        }
    };

    return (
        <FormControl sx={{ width: 170 }}>
            <InputLabel htmlFor="demo-multiple-chip-label">{title}</InputLabel>
            <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple={multiple}
                value={personName}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label={title} size="medium" />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {multiple
                            ? selected.map((value) => {
                                const selectedLabel = names.find((name) => name.value === value)?.label || value;
                                return <Chip key={value} label={selectedLabel} sx={{ backgroundColor: '#1565c0', color: '#ffffff' }} />;
                            })
                            : <Chip label={names.find((name) => name.value === selected)?.label || selected} sx={{ backgroundColor: '#1565c0', color: '#ffffff' }} />}
                    </Box>
                )}
                MenuProps={MenuProps}
            >
                {names?.map((name, index) => (
                    <MenuItem
                        key={index}
                        value={name.value}
                        style={{
                            backgroundColor: personName?.includes(name.value) ? '#1565c0' : 'inherit',
                            color: personName?.includes(name.value) ? '#ffffff' : 'inherit',
                        }}
                        sx={{
                            '&.Mui-selected': {
                                backgroundColor: '#1565c0',
                                color: '#ffffff',
                                '&:hover': { opacity: 0.8 },
                            },
                        }}
                    >
                        {name.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}