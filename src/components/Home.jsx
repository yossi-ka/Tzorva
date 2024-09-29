import React, {  useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
//   useEffect(() => {
//     if (!user) {
//       navigate("/login", { replace: true });
//     }
//   }, []);
  return <div>Home</div>;
}

export default Home;
