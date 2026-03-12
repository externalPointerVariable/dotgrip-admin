import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  VStack,
  Text,
  Icon,
  Button,
  Image,
  Spacer,
} from "@chakra-ui/react";
import {
  LuLayoutDashboard,
  LuDatabase,
  LuSettings,
  LuUserX,
  LuClock,
  LuUserCheck,
  LuLogOut,
} from "react-icons/lu";

import {
  Dashboard,
  Profile,
  Settings,
  Database,
  InactiveProfiles,
  PendingTasks,
  InfluencerProfile,
} from "@/pages";

interface SidebarProps {
  isCollapsed: boolean;
  onActiveItemChange: (item: string) => void;
  routeAfterLogin: (isLoggedIn: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onActiveItemChange,
  routeAfterLogin,
}) => {
  const [activeItem, setActiveItem] = useState<string>("dashboard");
  useEffect(() => {
    onActiveItemChange(activeItem);
  }, [activeItem]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    routeAfterLogin(false);
  };

  // Menu items now include the component reference
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LuLayoutDashboard,
      component: Dashboard,
    },
    {
      id: "influencers",
      label: "Influencer Profile",
      icon: LuUserCheck,
      component: InfluencerProfile,
    },
    {
      id: "database",
      label: "Database",
      icon: LuDatabase,
      component: Database,
    },
    {
      id: "tasks",
      label: "Pending Tasks",
      icon: LuClock,
      component: PendingTasks,
    },
    {
      id: "inactive",
      label: "Inactive Profiles",
      icon: LuUserX,
      component: InactiveProfiles,
    },
    { id: "profile", label: "Profile", icon: LuUserCheck, component: Profile },
    {
      id: "settings",
      label: "Settings",
      icon: LuSettings,
      component: Settings,
    },
  ];

  // Find the active menu item
  const activeMenu = menuItems.find((item) => item.id === activeItem);
  const ActiveComponent = activeMenu?.component;

  return (
    <Flex>
      {/* Sidebar itself */}
      <Flex
        direction="column"
        bg="gray.800"
        color="white"
        h="88.5vh"
        top="11.5vh"
        w={isCollapsed ? "80px" : "250px"}
        p={6}
        position="fixed"
        transition="width 0.3s ease-in-out"
      >
        {/* Branding */}
        <VStack gap={2} mb={8}>
          <Image
            src="https://dotgrip.com/logo.png"
            alt="Dotgrip Logo"
            boxSize="50px"
          />
          {!isCollapsed && (
            <>
              <Text fontSize="2xl" fontWeight="bold">
                Dotgrip
              </Text>
              <Text fontSize="sm" color="gray.300">
                Admin Panel
              </Text>
            </>
          )}
        </VStack>

        {/* Menu */}
        <VStack align="stretch" gap={2} flex="1">
          {menuItems.map(({ id, label, icon }) => (
            <Button
              key={id}
              onClick={() => setActiveItem(id)}
              justifyContent={isCollapsed ? "center" : "flex-start"}
              variant="ghost"
              fontWeight={activeItem === id ? "bold" : "normal"}
              bg={activeItem === id ? "cyan.600" : "transparent"}
              _hover={{ bg: "gray.700" }}
              color="white"
            >
              <Icon as={icon} mr={!isCollapsed ? 2 : 0} />
              {!isCollapsed && label}
            </Button>
          ))}
        </VStack>

        <Spacer />

        {/* Logout */}
        <Box>
          <Button
            justifyContent={isCollapsed ? "center" : "flex-start"}
            variant="ghost"
            onClick={handleLogout}
            _hover={{ bg: "gray.700" }}
            w="full"
            color="white"
          >
            <Icon as={LuLogOut} mr={2} />
            {!isCollapsed && "Logout"}
          </Button>
        </Box>
      </Flex>

      {/* Content Area */}
      <Box
        flex="1"
        position="relative"
        top="11.5vh"
        ml={isCollapsed ? "80px" : "250px"}
        p={6}
      >
        {ActiveComponent && <ActiveComponent />}
      </Box>
    </Flex>
  );
};

export default Sidebar;
