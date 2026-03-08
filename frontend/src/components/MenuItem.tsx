import { Menu, Button, Portal, Icon } from "@chakra-ui/react";
import { LuMoveDown } from "react-icons/lu";

interface MenuItemProps {
  label: string;
  items: Array<{ value: string; label: string }>;
  isActive: boolean;
  setActive: (open: boolean) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  label,
  items,
  isActive,
  setActive,
}) => {
  return (
    <>
      <Menu.Root open={isActive} onOpenChange={(e) => setActive(e.open)}>
        <Menu.Trigger asChild>
          <Button variant={"outline"}>
            {label}
            <Icon as={LuMoveDown} boxSize={4} marginLeft={2} />
          </Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              {items.map((item) => (
                <Menu.Item key={item.value} value={item.value}>
                  {item.label}
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </>
  );
};

export default MenuItem;
