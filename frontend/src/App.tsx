import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/header/Header";

function App() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(
    localStorage.getItem("sidebarCollapsed") === "true"
  );
  
  const [activeSidebarItem, setActiveSidebarItem] = useState<string>( "dashboard" );
  
  const storedActiveItem = (currentSidebarItem: string) => {
    setActiveSidebarItem(currentSidebarItem);
  }
  
  const headerDetails = {
    dashboard: {
      heading: "Dashboard",
      subheading: "Overview of your influencer network"},
    database: {
      heading: "Database",
      subheading: "Manage your influencer database"},
    tasks: {
      heading: "Pending Tasks",
      subheading: "Review and approve new influencer submissions"},
    inactive: {
      heading: "Inactive Profiles",
      subheading: "Review inactive influencer profiles"},
    profile: {
      heading: "Profile",
      subheading: "Manage your user profile settings"},
    settings: {
      heading: "Settings",
      subheading: "Configure application settings"},
  };
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isCollapsed.toString());
  }, [isCollapsed]);

  return (
    <>
      <Header
        heading={headerDetails[activeSidebarItem].heading}
        subheading={headerDetails[activeSidebarItem].subheading}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isCollapsed={isCollapsed}
      />
      <Sidebar isCollapsed={isCollapsed} 
        onActiveItemChange={storedActiveItem}
        />
    </>
  );
}

export default App;