import { useEffect, useState } from "react";
import HomePage from "./components/HomePage";
import AnalyzerPage from "./components/AnalyzerPage";

function App() {
  const [route, setRoute] = useState(window.location.pathname || "/");

  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname || "/");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (path) => {
    if (window.location.pathname === path) {
      return;
    }
    window.history.pushState({}, "", path);
    setRoute(path);
  };

  if (route === "/analyzer") {
    return <AnalyzerPage />;
  }

  return <HomePage onNavigate={navigate} />;
}

export default App;
