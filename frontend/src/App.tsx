import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/header/Header";
import LoginPage from "./pages/Login";

function App() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(
    localStorage.getItem("sidebarCollapsed") === "true",
  );

  const [loggedIn, setLoggedIn] = useState<boolean>(
    localStorage.getItem("token") !== null,
  );

  const routeAfterLogin = (loginState: boolean) => {
    setLoggedIn(loginState);
  };

  const [activeSidebarItem, setActiveSidebarItem] =
    useState<string>("dashboard");

  const storedActiveItem = (currentSidebarItem: string) => {
    setActiveSidebarItem(currentSidebarItem);
  };

  const headerDetails = {
    dashboard: {
      heading: "Dashboard",
      subheading: "Overview of your influencer network",
    },
    influencers: {
      heading: "Influencer Profile",
      subheading: "Detailed insights into influencer performance",
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
    profile: {
      heading: "Profile",
      subheading: "Manage your user profile settings",
    },
    settings: {
      heading: "Settings",
      subheading: "Configure application settings",
    },
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
      <Toaster />
    </>
  );
}

export default App;
