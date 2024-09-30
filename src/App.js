import { useState, createContext } from "react";
import "./App.css";
import Routing from "./Routing.jsx";

export const UserContext = createContext();

function App() {
  const [user, setUser] = useState({});
  return (
    <div className="App">
      <UserContext.Provider value={{ user, setUser }}>
        <Routing />
      </UserContext.Provider>
    </div>
  );
}

export default App;
