import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Integrations from "./pages/Integrations";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/integrations" element={<Integrations />} />
      </Routes>
    </Router>
  );
}

export default App;