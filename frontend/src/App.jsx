import { useEffect, useState } from "react";
import HomePage from "./components/HomePage";
import AnalyzerPage from "./components/AnalyzerPage";
import ChallengesPage from "./components/ChallengesPage";
import LearnPage from "./components/LearnPage";

function App() {
  const [route, setRoute] = useState(window.location.pathname || "/");
  const [search, setSearch] = useState(window.location.search || "");

  useEffect(() => {
    const onPop = () => {
      setRoute(window.location.pathname || "/");
      setSearch(window.location.search || "");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (path) => {
    const [pathname, searchStr] = path.split("?");
    if (window.location.pathname === pathname && window.location.search === ("?" + (searchStr || ""))) return;
    window.history.pushState({}, "", path);
    setRoute(pathname);
    setSearch(searchStr ? "?" + searchStr : "");
  };

  const currentPath = route;

  if (route === "/analyzer") return <AnalyzerPage onNavigate={navigate} currentPath={currentPath} />;
  if (route === "/challenges") return <ChallengesPage onNavigate={navigate} currentPath={currentPath} />;
  if (route === "/learn") return <LearnPage onNavigate={navigate} currentPath={currentPath} search={search} />;
  
  return <HomePage onNavigate={navigate} currentPath={currentPath} />;
}

export default App;
