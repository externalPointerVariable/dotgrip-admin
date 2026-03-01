import {
  Checkbox,
  Table,
  Flex,
  Button,
  Icon,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import { LuTrash2, LuDownload, LuSheet, LuSearch } from "react-icons/lu";
import { useState } from "react";
import MenuItem from "@/components/MenuItem";
import { label } from "framer-motion/client";

function Database() {
  const [nicheActive, setNicheActive] = useState<boolean>(false);
  const [tiersActive, setTiersActive] = useState<boolean>(false);
  const [regionsActive, setRegionsActive] = useState<boolean>(false);
  const [keywordsActive, setKeywordsActive] = useState<boolean>(false);
  const items = [{ value: "1", label: "Fashion" }];
  return (
    <>
      <Flex gap={4} justifyContent={"space-between"}>
        <Button _hover={{ bg: "cyan.600", color: "white" }}>
          <Icon as={LuDownload} mr={2} />
          Export
        </Button>
        <Button
          marginEnd={"auto"}
          variant={"ghost"}
          border={"ActiveBorder"}
          _hover={{ bg: "cyan.600" }}
        >
          <Icon as={LuSheet} mr={2} />
          Import
        </Button>
        <Button bg={"red.600"} color={"white"}>
          <Icon as={LuTrash2} mr={2} />
          Delete Selected <span>{0}</span>
        </Button>
      </Flex>
      <Flex gap={4} justifyContent={"space-between"} marginTop={"15px"}>
        <InputGroup
          startElement={<LuSearch />}
          marginEnd={"auto"}
          width={"50%"}
          _active={{ border: "cyan.600" }}
        >
          <Input placeholder="Search by name or Instagram handle" />
        </InputGroup>
        <MenuItem
          label="All Niches"
          items={items}
          isActive={nicheActive}
          setActive={setNicheActive}
        />
      </Flex>
    </>
  );
}

export default Database;
