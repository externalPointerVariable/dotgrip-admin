import {
  Box,
  Button,
  CloseButton,
  Drawer,
  Icon,
  Portal,
  Table,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { IoMdOpen } from "react-icons/io";
import { LuSheet } from "react-icons/lu";

import InfluencerForm from "@/components/InfluencerForm";
import { FileUploader } from "@/components/FileUploader";
import type { Influencer } from "@/types/influencer";

export default function PendingTasks() {
  const [pendingTasks, setPendingTasks] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [approvalForm, setApprovalForm] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [uploadFile, setUploadFile] = useState(false);

  const fetchPendingTasks = async (token: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/influencers/pending-influencers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.reload();
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        throw new Error("Failed to fetch pending tasks");
      }

      const data = await response.json();
      setPendingTasks(data);
    } catch (err) {
      setError("Failed to fetch pending tasks");
      console.error(err);
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

    fetchPendingTasks(token);
  }, []);

  const columnHelper = createColumnHelper<Influencer>();

  const columns = [
    columnHelper.accessor("instagramLink", {
      header: "Instagram Link",
      cell: (info) => {
        const url = info.getValue();
        const username = url.split("/").pop()?.split("?")[0];

        return (
          <Text color="cyan.400" fontSize="sm">
            <a href={url} target="_blank" rel="noopener noreferrer">
              {username}
              <Icon as={IoMdOpen} ml={1} boxSize={3} />
            </a>
          </Text>
        );
      },
    }),

    columnHelper.accessor("instagram.averageLikes", {
      header: "Average Likes",
      cell: (info) => <Text fontSize="sm">{info.getValue()}</Text>,
    }),

    columnHelper.accessor("instagram.followerCount", {
      header: "Follower Count",
      cell: (info) => <Text fontSize="sm">{info.getValue()}</Text>,
    }),

    columnHelper.display({
      id: "status",
      header: "Status",
      cell: () => (
        <Text fontSize="sm" color="yellow.400">
          Pending
        </Text>
      ),
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <Button
          size="sm"
          bg="cyan.500"
          color="white"
          _hover={{ bg: "cyan.400" }}
          onClick={() =>
            setApprovalForm({
              id: info.row.original._id,
              name: info.row.original.name,
            })
          }
        >
          Approve
        </Button>
      ),
    }),
  ];

  const table = useReactTable({
    data: pendingTasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleCloseFileUpload = () => setUploadFile(false);
  const handleCloseForm = () => setApprovalForm(null);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  if (uploadFile) {
    return <FileUploader closeDialog={handleCloseFileUpload} />;
  }

  return (
    <Box w="full" px={6} py={4}>
      {/* Import Button */}
      <Box display="flex" justifyContent="flex-end" mb={4}>
        <Button
          size="sm"
          variant="outline"
          borderColor="gray.600"
          _hover={{ bg: "gray.700" }}
          onClick={() => setUploadFile(true)}
        >
          <Icon as={LuSheet} mr={2} />
          Import
        </Button>
      </Box>

      {/* Table */}
      <Box bg="gray.900" borderRadius="xl" overflow="hidden">
        <Table.Root size="md" w="full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    <Box
                      as="button"
                      onClick={header.column.getToggleSortingHandler()}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      w="full"
                      px={4}
                      py={3}
                      fontWeight="semibold"
                      fontSize="sm"
                      color="gray.400"
                      borderBottom="1px solid"
                      borderColor="gray.700"
                      _hover={{ bg: "gray.800" }}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}

                        {/* 🔥 Dynamic Sorting Arrow */}
                        {header.column.getCanSort() && (
                          <Text
                            fontSize="xs"
                            transition="all 0.2s"
                            color={
                              header.column.getIsSorted()
                                ? "cyan.400"
                                : "gray.500"
                            }
                          >
                            {{
                              asc: "↑",
                              desc: "↓",
                            }[header.column.getIsSorted() as string] ?? "↕"}
                          </Text>
                        )}
                      </Box>
                    </Box>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                style={{ transition: "background 0.2s" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#1a202c")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    <Box
                      px={4}
                      py={3}
                      borderBottom="1px solid"
                      borderColor="gray.800"
                      fontSize="sm"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Box>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table.Root>
      </Box>

      {/* Drawer */}
      <Drawer.Root
        open={!!approvalForm}
        onOpenChange={({ open }) => {
          if (!open) setApprovalForm(null);
        }}
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Edit Influencer Profile</Drawer.Title>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Drawer.Header>

              <Drawer.Body p={0}>
                {approvalForm && (
                  <InfluencerForm
                    influencerId={approvalForm.id}
                    influencerName={approvalForm.name}
                    onClose={handleCloseForm}
                  />
                )}
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </Box>
  );
}
