import { useState, createContext } from "react";
import "./App.css";
import Routing from "./Routing.jsx";
import { createTheme, ThemeProvider } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { NotificationProvider } from "./components/massage-comp/NotificationContext.jsx";

import { heIL } from "@mui/material/locale/index.js";

const theme = createTheme(
  {
    direction: "rtl",
    typography: {
      fontFamily: "Rubik, Arial, sans-serif",
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          body {
            direction: rtl;
          }
        `,
      },
    },
  },
  heIL
);

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

export const UserContext = createContext();

function App() {
  const [user, setUser] = useState({});
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CacheProvider value={cacheRtl}>
          <UserContext.Provider value={{ user, setUser }}>
            <NotificationProvider>
              <Routing />
            </NotificationProvider>
          </UserContext.Provider>
        </CacheProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
