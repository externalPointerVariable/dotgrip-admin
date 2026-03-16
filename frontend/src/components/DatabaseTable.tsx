import { Icon, Center, Box, Text, Table, Checkbox } from "@chakra-ui/react";
import { IoMdOpen } from "react-icons/io";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import type { Influencer } from "@/types/influencer";
import { InfluencerProfile } from "@/pages";

export default function DatabaseTable({
  filteredInfluencers,
}: {
  filteredInfluencers: Influencer[];
}) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedInfluencer, setSelectedInfluencer] =
    useState<Influencer | null>(null);

  const unsetSelectedInfluencer = () => setSelectedInfluencer(null);

  const columnHelper = createColumnHelper<Influencer>();

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
      cell: (info) => (
        <Text onClick={() => setSelectedInfluencer(info.row.original)}>
          {info.getValue() || "Anonymous"}
        </Text>
      ),
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

  if (selectedInfluencer) {
    return (
      <InfluencerProfile
        unsetSelectedInfluencer={unsetSelectedInfluencer}
        dummyInfluencer={selectedInfluencer}
      />
    );
  }

  return (
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
  );
}
