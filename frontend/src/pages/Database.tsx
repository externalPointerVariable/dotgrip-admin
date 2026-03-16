import {
  Flex,
  Button,
  Icon,
  Input,
  InputGroup,
  Center,
  Box,
  Text,
  Table,
  Checkbox,
  Tabs,
} from "@chakra-ui/react";
import { LuDownload, LuSearch } from "react-icons/lu";
import { useState, useEffect } from "react";
import MenuItem from "@/components/MenuItem";
import DatabaseTable from "@/components/DatabaseTable";
import CardsView from "@/components/CardsView";
import type { Influencer } from "@/types/influencer";

function Database() {
  const [nicheActive, setNicheActive] = useState<boolean>(false);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const items = [{ value: "1", label: "Fashion" }];

  const fetchInfluencers = async (token: string) => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/influencers?status=approved",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 401) {
        setError("Unauthorized. Please log in again.");
        setLoading(false);
        localStorage.removeItem("token");
        window.location.reload();
        return;
      } else if (!response.ok) {
        setError(`Error: ${response.status} ${response.statusText}`);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setInfluencers(data);
    } catch (error) {
      setError("Failed to fetch influencers");
      console.error("Error fetching influencers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    fetchInfluencers(token);
  }, []);

  const filteredInfluencers =
    typeof influencers === "object" && influencers.length > 0
      ? influencers.filter((influencer) => {
          const searchLower = searchQuery.toLowerCase();
          const matchesName = influencer.name
            ? influencer.name.toLowerCase().includes(searchLower)
            : false;
          const matchesInstagram = influencer.instagramLink
            .toLowerCase()
            .includes(searchLower);
          return matchesName || matchesInstagram;
        })
      : [];

  if (loading) {
    return <Text>Loading...</Text>;
  } else if (error) {
    return <Text>Error: {error}</Text>;
  }

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
            <DatabaseTable filteredInfluencers={filteredInfluencers} />
          </Tabs.Content>
          <Tabs.Content value="card">
            <CardsView filteredInfluencers={filteredInfluencers} />
          </Tabs.Content>
        </Tabs.Root>
      </Center>
    </>
  );
}

export default Database;
