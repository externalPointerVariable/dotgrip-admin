import {
  Button,
  Icon,
  Input,
  InputGroup,
  Tabs,
  Text,
  HStack,
  NativeSelect,
  VStack,
} from "@chakra-ui/react";
import { LuDownload, LuSearch } from "react-icons/lu";
import { useEffect, useState } from "react";
import DatabaseTable from "@/components/DatabaseTable";
import CardsView from "@/components/CardsView";
import type { Influencer } from "@/types/influencer";

function Database() {
  const [influencers, setInfluencers] = useState<[Influencer] | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [niches, setNiches] = useState<string[]>([]);
  const [activeNiche, setActiveNiche] = useState<string>("");
  const [tiers, setTiers] = useState<string[]>([]);
  const [activeTier, setActiveTier] = useState<string>("");
  const [regions, setRegions] = useState<string[]>([]);
  const [activeRegion, setActiveRegion] = useState<string>("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [activeKeyword, setActiveKeyword] = useState<string>("");
  const [filteredInfluencers, setFilteredInfluencers] = useState<
    [Influencer] | null
  >(null);

  useEffect(() => {
    setLoading(true);

    // 1. Fixed URL Construction (See Note 1)
    const queryParams = new URLSearchParams({
      page: currentPage.toString(),
    });

    // Only append filters if they actually have a value
    if (activeNiche) queryParams.append("niches", activeNiche);
    if (activeTier) queryParams.append("tier", activeTier);
    if (activeKeyword) queryParams.append("keywords", activeKeyword);

    const url = `${import.meta.env.VITE_BASE_URL}/influencers/?${queryParams.toString()}`;

    // 2. The Promise Chain
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        // Handle Unauthorized
        if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.reload();
          // Reject the promise to skip the next .then() block
          return Promise.reject(new Error("Unauthorized"));
        }

        // Handle other HTTP errors
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse JSON
        return response.json();
      })
      .then((data) => {
        // Update state with parsed data
        setNiches(data.uniqueFiltersValues.niches);
        setTiers(data.uniqueFiltersValues.tiers);
        setRegions(data.uniqueFiltersValues.regions);
        setKeywords(data.uniqueFiltersValues.keywords);
        setCurrentPage(data.pagination.page);

        const pagesArray = Array.from(
          { length: data.pagination.totalPages },
          (_, i) => i + 1,
        );
        setTotalPages(pagesArray);

        setFilteredInfluencers(data.data);
        setInfluencers(data.data);
      })
      .catch((error) => {
        // We ignore the custom "Unauthorized" error we threw above since we are reloading anyway
        if (error.message !== "Unauthorized") {
          setError(error.message);
          console.error("Error fetching influencers:", error);
        }
      })
      .finally(() => {
        // Ensure loading stops whether it succeeds or fails
        setLoading(false);
      });
  }, [currentPage, activeNiche, activeTier, activeRegion, activeKeyword]);

  useEffect(() => {
    if (!searchQuery.trim() || !influencers) {
      setFilteredInfluencers(null);
      return;
    }

    const filtered = influencers.filter(
      (influencer) =>
        influencer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        influencer.instagramLink
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
    );

    setFilteredInfluencers(
      filtered.length > 0 ? (filtered as [Influencer]) : null,
    );
  }, [searchQuery, influencers]);

  if (loading) return <Text>Loading...</Text>;
  else if (error) return <Text>{error}</Text>;

  return (
    <>
      <VStack w="100%" p={4} alignItems={"Space-between"}>
        <HStack w="100%" justifyContent={"space-between"}>
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
        </HStack>
        <HStack>
          <NativeSelect.Root
            value={activeNiche}
            onChange={(e) => setActiveNiche(e.target.value)}
          >
            <NativeSelect.Field placeholder="Filter by niche">
              {niches.map((niche) => (
                <option key={niche} value={niche}>
                  {niche}
                </option>
              ))}
            </NativeSelect.Field>
          </NativeSelect.Root>
          <NativeSelect.Root
            value={activeTier}
            onChange={(e) => setActiveTier(e.target.value)}
          >
            <NativeSelect.Field placeholder="Filter by tier">
              {tiers.map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </NativeSelect.Field>
          </NativeSelect.Root>
          <NativeSelect.Root
            value={activeRegion}
            onChange={(e) => setActiveRegion(e.target.value)}
          >
            <NativeSelect.Field placeholder="Filter by region">
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </NativeSelect.Field>
          </NativeSelect.Root>
          <NativeSelect.Root
            value={activeKeyword}
            onChange={(e) => setActiveKeyword(e.target.value)}
          >
            <NativeSelect.Field placeholder="Filter by keyword">
              {keywords.map((keyword) => (
                <option key={keyword} value={keyword}>
                  {keyword}
                </option>
              ))}
            </NativeSelect.Field>
          </NativeSelect.Root>
        </HStack>
      </VStack>
      <VStack w="100%" p={4} marginTop={4}>
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
            <DatabaseTable
              influencers={
                searchQuery !== "" ? filteredInfluencers : influencers
              }
            />
          </Tabs.Content>
          <Tabs.Content value="card">
            <CardsView
              influencers={
                searchQuery !== "" ? filteredInfluencers : influencers
              }
            />
          </Tabs.Content>
        </Tabs.Root>
        <HStack>
          <NativeSelect.Root
            onChange={(value) => setCurrentPage(Number(value))}
          >
            <NativeSelect.Field
              placeholder={currentPage.toString()}
            ></NativeSelect.Field>
            {totalPages.map((page) => (
              <option key={page} value={page.toString()}></option>
            ))}
          </NativeSelect.Root>
          /{totalPages.length}
        </HStack>
      </VStack>
    </>
  );
}

export default Database;
