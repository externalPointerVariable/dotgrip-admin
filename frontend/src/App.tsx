import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/header/Header";
import LoginPage from "./pages/Login";

// 1. Move headerDetails outside the component or keep it inside, 
// but define its structure to allow string indexing.
const headerDetails = {
  dashboard: {
    heading: "Dashboard",
    subheading: "Overview of your influencer network",
  },
  database: {
    heading: "Database",
    subheading: "Manage your influencer database",
  },
  tasks: {
    heading: "Pending Tasks",
    subheading: "Review and approve new influencer submissions",
  },
  inactive: {
    heading: "Inactive Profiles",
    subheading: "Review inactive influencer profiles",
  },
  settings: {
    heading: "Settings",
    subheading: "Configure application settings",
  },
};

// 2. Create a type based on the keys of headerDetails
type SidebarKey = keyof typeof headerDetails;

function App() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(
    localStorage.getItem("sidebarCollapsed") === "true",
  );

  const [loggedIn, setLoggedIn] = useState<boolean>(
    localStorage.getItem("token") !== null &&
      localStorage.getItem("token") !== undefined,
  );

  const routeAfterLogin = (loginState: boolean) => {
    setLoggedIn(loginState);
  };

  // 3. Set the state type to SidebarKey instead of a generic string
  const [activeSidebarItem, setActiveSidebarItem] =
    useState<SidebarKey>("dashboard");

  // 4. Update the parameter type here as well
  const storedActiveItem = (currentSidebarItem: string) => {
    // Cast it as SidebarKey to satisfy the state setter
    setActiveSidebarItem(currentSidebarItem as SidebarKey);
  };

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isCollapsed.toString());
  }, [isCollapsed]);

  if (loggedIn === false) {
    return <LoginPage routeAfterLogin={routeAfterLogin} />;
  }

  return (
    <>
      <Header
        // Now TypeScript knows activeSidebarItem is a valid key!
        heading={headerDetails[activeSidebarItem].heading}
        subheading={headerDetails[activeSidebarItem].subheading}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isCollapsed={isCollapsed}
      />
      <Sidebar
        routeAfterLogin={routeAfterLogin}
        isCollapsed={isCollapsed}
        onActiveItemChange={storedActiveItem}
      />
    </>
  );
}

export default App;