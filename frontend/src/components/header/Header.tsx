import { Flex, Box, Text, IconButton, Badge } from "@chakra-ui/react";
import { useState } from "react";
import { LuBell } from "react-icons/lu";
import { TbLayoutSidebarLeftExpand, TbLayoutSidebarRightExpand } from "react-icons/tb";

interface HeaderProps {
  heading: string;
  subheading: string;
  onToggleCollapse: () => void;
  isCollapsed: boolean;
}

interface Notification {
  id: number;
  message: string;
  read: boolean;
}

const Header: React.FC<HeaderProps> = ({ heading, subheading, onToggleCollapse, isCollapsed }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]); 

  return (
    <Flex
      as="header"
      bg="gray.900"
      color="white"
      align="center"
      justify="space-between"
      px={6}
      py={4}
      boxShadow="sm"
    >
      {/* Left side: Collapse toggle + Title */}
      <Flex align="center">
        <IconButton
        aria-label="Toggle sidebar"
        onClick={onToggleCollapse}
        variant="ghost"
        color="white"
        mr={3}
        >
        {isCollapsed ? <TbLayoutSidebarRightExpand size={22} /> : <TbLayoutSidebarLeftExpand size={22} />}
        </IconButton>
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            {heading}
          </Text>
          <Text fontSize="sm" color="gray.400">
            {subheading}
          </Text>
        </Box>
      </Flex>

      {/* Right side: Notification Bell */}
      <Box position="relative">
        <IconButton aria-label="Notifications" variant="ghost" color="white">
          <LuBell size={24} />
        </IconButton>
        {notifications.length > 0 ? (
        <Badge
          position="absolute"
          top="2"
          right="2"
          bg="red.500"
          borderRadius="full"
          boxSize="3"
        />
        ) : null}
      </Box>
    </Flex>
  );
};

export default Header;