import { useState, createContext } from "react";
import "./App.css";
import Routing from "./Routing.jsx";
// import { createTheme } from '@mui/material/styles';
// import { CacheProvider } from '@emotion/react';
// import createCache from '@emotion/cache';
// import { prefixer } from 'stylis';
// import rtlPlugin from 'stylis-plugin-rtl';

// const theme = createTheme({
//   direction: 'rtl',
// });
// const cacheRtl = createCache({
//   key: 'muirtl',
//   stylisPlugins: [prefixer, rtlPlugin],
// });
export const UserContext = createContext();

function App() {
  const [user, setUser] = useState({});
  return (
    <div className="App">
      
      {/* <CacheProvider value={cacheRtl}> */}
      <UserContext.Provider value={{ user, setUser }}>
        <Routing />
      </UserContext.Provider>
      {/* </CacheProvider> */}
    </div>
  );
}

export default App;
