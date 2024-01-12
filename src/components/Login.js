import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styles from "./css/Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className={styles.container}>
  <h1>Login</h1>
  <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin();
    }}
  >
    <div className={styles["form-group"]}>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
    </div>
    <div className={styles["form-group"]}>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
    </div>
    <button type="submit">Login</button>
  </form>
</div>

  );
};

export default Login;
