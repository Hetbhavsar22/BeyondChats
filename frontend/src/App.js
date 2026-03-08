import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Integrations from "./pages/Integrations";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard folder="inbox" />} />
        <Route path="/sent" element={<Dashboard folder="sent" />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
}

export default App;