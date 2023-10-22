import { createTheme, ThemeProvider } from "@mui/material";
import { createContext, useState, useMemo } from "react";
import { grey } from '@mui/material/colors';

export const ColorModeContext = createContext({
    toggleMode: () => { },
    mode: 'light'
})

const themeObj = {
    dark: {
        background: {
            default: grey[800]
        }
    }
}

export const ColorContextProvider = ({ children }) => {
    const [mode, setMode] = useState('light')

    const colorMode = useMemo(() => ({
        toggleMode: () => setMode(prevMode => prevMode === 'light' ? 'dark' : 'light'),
        mode
    }), [mode])
    
    const theme = useMemo(() => createTheme({
        palette: {
            mode: mode,
            ...themeObj[mode]
        }
    }), [mode])
    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    )
}