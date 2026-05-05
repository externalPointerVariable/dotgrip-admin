import {
  Flex,
  Box,
  Text,
  IconButton,
  Badge,
  MenuRoot,
  Menu,
  Portal,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuBell } from "react-icons/lu";
import {
  TbLayoutSidebarLeftExpand,
  TbLayoutSidebarRightExpand,
} from "react-icons/tb";

interface HeaderProps {
  heading: any;
  subheading: any;
  onToggleCollapse: () => void;
  isCollapsed: boolean;
}

interface Notification {
  id: number;
  message: string;
  read: boolean;
}

const Header: React.FC<HeaderProps> = ({
  heading,
  subheading,
  onToggleCollapse,
  isCollapsed,
}) => {
  // ✅ Initialize state directly (no setState in render)
  const [notifications] = useState<Notification[]>([
    { id: 1, message: "New user registered", read: false },
    { id: 2, message: "Server backup completed", read: true },
    { id: 3, message: "New comment on post", read: false },
  ]);

  return (
    <Flex
      as="header"
      bg="gray.800"
      color="white"
      align="center"
      justify="space-between"
      position="fixed"
      w="100%"
      zIndex={1000}
      px={6}
      py={4}
      boxShadow="sm"
    >
      {/* Left side: Collapse toggle + Title */}
      <Flex align="center">
        <IconButton
          aria-label="Toggle sidebar"
          onClick={onToggleCollapse}
          color="white"
          variant="ghost"
          mr={3}
        >
          {isCollapsed ? (
            <TbLayoutSidebarRightExpand size={22} />
          ) : (
            <TbLayoutSidebarLeftExpand size={22} />
          )}
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

      {/* Notification Menu */}
      <MenuRoot>
        <Menu.Trigger asChild>
          <IconButton aria-label="User Menu" variant="ghost" color="white">
            <LuBell size={24} />
            {notifications.length > 0 && (
              <Badge
                position="absolute"
                top="0"
                right="0"
                transform="translate(50%, -50%)"
                bg="red.500"
                color="white"
                borderRadius="full"
                fontSize="xs"
                px={2}
                py={1}
              >
                {notifications.length}
              </Badge>
            )}
          </IconButton>
        </Menu.Trigger>

        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              {notifications.map((n) => (
                <Menu.Item
                  key={n.id} // ✅ added key
                  value={n.id.toString()}
                  color={n.read ? "gray.400" : "yellow.400"}
                >
                  {n.message}
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </MenuRoot>
    </Flex>
  );
};

export default Header;