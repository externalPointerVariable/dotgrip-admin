import {
  Box,
  Button,
  Center,
  Icon,
  Spacer,
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
import InfluencerForm from "@/components/InfluencerForm";
import { LuSheet } from "react-icons/lu";
import { FileUpload } from "@/components/FileUpload";

interface influencers {
  instagramLink: string;
  _id: string;
  instagram: {
    averageLikes: number;
    followerCount: number;
  };
}

export default function PendingTasks() {
  const [pendingTasks, setPendingTasks] = useState<influencers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvalForm, setApprovalForm] = useState<{ id: string } | null>(null);
  const [uploadFile, setUploadFile] = useState<boolean>(false);

  const fetchPendingTasks = async (token: string) => {
    try {
      fetch("http://localhost:8000/api/influencers?status=pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setPendingTasks(data));
    } catch (error) {
      setError("Failed to fetch pending tasks");
      console.error("Error fetching pending tasks:", error);
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

  const columnHelper = createColumnHelper<influencers>();

  const columns = [
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
      cell: () => <Text>Pending</Text>,
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <Button
          bg={"cyan.600"}
          color={"white"}
          onClick={() => setApprovalForm({ id: info.row.original._id })}
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

  const handleCloseFileUpload = () => {
    setUploadFile(false);
  };

  if (approvalForm) {
    return <InfluencerForm influencerId={approvalForm.id} />;
  }

  if (loading) {
    return <Text>Loading...</Text>;
  } else if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (uploadFile) {
    return <FileUpload closeDialog={handleCloseFileUpload} />;
  }

  return (
    <Box>
      <Button
        marginEnd={"auto"}
        variant={"ghost"}
        border={"ActiveBorder"}
        _hover={{ bg: "cyan.600" }}
        onClick={() => setUploadFile(true)}
      >
        <Icon as={LuSheet} mr={2} />
        Import
      </Button>
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
    </Box>
  );
}
