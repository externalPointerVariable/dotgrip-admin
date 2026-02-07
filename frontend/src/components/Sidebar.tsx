import { useState } from "react";
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

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const [activeItem, setActiveItem] = useState<string>("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LuLayoutDashboard },
    { id: "database", label: "Database", icon: LuDatabase },
    { id: "tasks", label: "Pending Tasks", icon: LuClock },
    { id: "inactive", label: "Inactive Profiles", icon: LuUserX },
    { id: "profile", label: "Profile", icon: LuUserCheck },
    { id: "settings", label: "Settings", icon: LuSettings },
  ];

  return (
    <Flex
      direction="column"
      bg="gray.800"
      color="white"
      h="88vh"
      w={isCollapsed ? "80px" : "250px"}
      p={6}
      transition="width 0.3s ease-in-out"
    >
      {/* Branding */}
      <VStack gap={2} mb={8}>
        <Image src="https://dotgrip.com/logo.png" alt="Dotgrip Logo" boxSize="50px" />
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
            <Icon as={icon} mr={2} />
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
          _hover={{ bg: "gray.700" }}
          w="full"
          color="white"
        >
          <Icon as={LuLogOut} mr={2} />
          {!isCollapsed && "Logout"}
        </Button>
      </Box>
    </Flex>
  );
};

export default Sidebar;