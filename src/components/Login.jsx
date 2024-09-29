import React, { useRef } from "react";

function Login() {
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <img src=".../public/logo-Tzorva.png" alt="לוגו צורבא" />
        <h1>התחברות למערכת</h1>
        <label htmlFor="username">שם:</label>
        <input ref={usernameRef} type="text" id="username" />
        <label htmlFor="password">סיסמא:</label>
        <input ref={passwordRef} type="password" id="password" />
        <button>כניסה</button>
      </form>
    </div>
  );
}

export default Login;
