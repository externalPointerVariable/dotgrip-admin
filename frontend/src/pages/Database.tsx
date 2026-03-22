import {
  Flex,
  Button,
  Icon,
  Input,
  InputGroup,
  Center,
  Tabs,
} from "@chakra-ui/react";
import { LuDownload, LuSearch } from "react-icons/lu";
import { useState } from "react";
import MenuItem from "@/components/MenuItem";
import DatabaseTable from "@/components/DatabaseTable";
import CardsView from "@/components/CardsView";

function Database() {
  const [nicheActive, setNicheActive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const items = [{ value: "1", label: "Fashion" }];

  return (
    <>
      <Flex gap={4} justifyContent={"space-between"}>
        <Button _hover={{ bg: "cyan.600", color: "white" }}>
          <Icon as={LuDownload} mr={2} />
          Export
        </Button>
        <InputGroup
          startElement={<LuSearch />}
          marginEnd={"auto"}
          width={"50%"}
          _active={{ border: "cyan.600" }}
        >
          <Input
            placeholder="Search by name or Instagram handle"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
        <MenuItem
          label="All Niches"
          items={items}
          isActive={nicheActive}
          setActive={setNicheActive}
        />
      </Flex>
      <Center w="100%" p={4} marginTop={4}>
        <Tabs.Root
          w="100%"
          defaultValue="table"
          variant="plain"
          css={{
            "--tabs-indicator-bg": "colors.gray.subtle",
            "--tabs-indicator-shadow": "shadows.xs",
            "--tabs-trigger-radius": "radii.full",
          }}
        >
          <Tabs.List>
            <Tabs.Trigger value="table">Table</Tabs.Trigger>
            <Tabs.Trigger value="card">Cards</Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Content value="table">
            <DatabaseTable />
          </Tabs.Content>
          <Tabs.Content value="card">
            <CardsView />
          </Tabs.Content>
        </Tabs.Root>
      </Center>
    </>
  );
}

export default Database;
