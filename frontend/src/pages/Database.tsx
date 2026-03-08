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
} from "@chakra-ui/react";
import { LuDownload, LuSearch } from "react-icons/lu";
import { IoMdOpen } from "react-icons/io";
import { useState, useEffect } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import MenuItem from "@/components/MenuItem";

interface influencers {
  instagramLink: string;
  _id: string;
  name?: string;
  instagram: {
    averageLikes: number;
    followerCount: number;
  };
  taskStatus: string;
}

function Database() {
  const [nicheActive, setNicheActive] = useState<boolean>(false);
  const [influencers, setInfluencers] = useState<influencers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
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

  const filteredInfluencers = influencers.filter((influencer) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesName = influencer.name
      ? influencer.name.toLowerCase().includes(searchLower)
      : false;
    const matchesInstagram = influencer.instagramLink
      .toLowerCase()
      .includes(searchLower);
    return matchesName || matchesInstagram;
  });

  const columnHelper = createColumnHelper<influencers>();

  const columns = [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <Checkbox.Root
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox.Root
          checked={row.getIsSelected()}
          onCheckedChange={row.getToggleSelectedHandler()}
        />
      ),
      enableSorting: false,
    }),
    columnHelper.accessor("name", {
      header: "Name",
      enableSorting: true,
      cell: (info) => <Text>{info.getValue() || "Anonymous"}</Text>,
    }),
    columnHelper.accessor("instagramLink", {
      header: "Instagram Link",
      enableSorting: true,
      cell: (info) => (
        <Text>
          {info.getValue() + " "}
          <a href={info.getValue()} target="_blank" rel="noopener noreferrer">
            <Icon as={IoMdOpen} boxSize={3} />
          </a>
        </Text>
      ),
    }),
    columnHelper.accessor("instagram.averageLikes", {
      header: "Average Likes",
      enableSorting: true,
      cell: (info) => <Text>{info.getValue()}</Text>,
    }),
    columnHelper.accessor("instagram.followerCount", {
      header: "Follower Count",
      enableSorting: true,
      cell: (info) => <Text>{info.getValue()}</Text>,
    }),
    columnHelper.display({
      id: "status",
      header: "Status",
      cell: () => <Text>Approved</Text>,
    }),
  ];

  const table = useReactTable({
    data: filteredInfluencers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: (updater) => {
      const newSelection =
        typeof updater === "function"
          ? updater(table.getState().rowSelection)
          : updater;
      setSelectedRows(Object.keys(newSelection));
    },
    state: {
      rowSelection: selectedRows.reduce(
        (acc, id) => ({ ...acc, [id]: true }),
        {},
      ),
    },
  });

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
      </Flex>
      <Flex gap={4} justifyContent={"space-between"} marginTop={"15px"}>
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
      <Center>
        <Table.Root
          p={20}
          showColumnBorder={true}
          variant="outline"
          textAlign={"left"}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <Box
                        as="button"
                        onClick={header.column.getToggleSortingHandler()}
                        cursor={
                          header.column.getCanSort() ? "pointer" : "default"
                        }
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        w="full"
                        p={2}
                        bg="transparent"
                        border="none"
                        _hover={{
                          bg: header.column.getCanSort()
                            ? "gray.100"
                            : "transparent",
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanSort() && (
                          <Text ml={2}>
                            {{
                              asc: "↑",
                              desc: "↓",
                            }[header.column.getIsSorted() as string] ?? "↕"}
                          </Text>
                        )}
                      </Box>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table.Root>
      </Center>
    </>
  );
}

export default Database;
