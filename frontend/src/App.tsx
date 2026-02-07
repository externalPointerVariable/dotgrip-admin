import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/header/Header";

function App() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(
    localStorage.getItem("sidebarCollapsed") === "true"
  );

  // keep localStorage in sync
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isCollapsed.toString());
  }, [isCollapsed]);

  return (
    <>
      <Header
        heading="Dashboard"
        subheading="Overview of your influencer network"
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isCollapsed={isCollapsed}
      />
      <Sidebar isCollapsed={isCollapsed} />
    </>
  );
}

export default App;