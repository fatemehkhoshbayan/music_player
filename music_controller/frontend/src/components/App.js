import React from "react";
import ReactDOM from "react-dom/client"; 
import HomePage from "./HomePage";

export default function App() {
  return (
    <div className="center">
      <HomePage />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
