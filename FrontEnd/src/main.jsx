 import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { useAuthStore } from "./features/auth/auth.store";
import "./index.css";

function Bootstrap() {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    useAuthStore
      .getState()
      .initializeAuth()
      .finally(() => setReady(true));
  }, []);

  if (!ready) return <p>Loading application...</p>;

  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Bootstrap />
  </React.StrictMode>
);