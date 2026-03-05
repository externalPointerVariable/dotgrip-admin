import { Box, Button, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface influencers {
  instagramLink: string;
}

export default function PendingTasks() {
  const [pendingTasks, setPendingTasks] = useState<influencers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return <Text>Loading...</Text>;
  } else if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <Box>
      <Table.Root striped>
        <Table.Caption>Influencers pending to be approved</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Instagram Link</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {pendingTasks.map((task, index) => (
            <Table.Row key={index}>
              <Table.Cell>{task.instagramLink}</Table.Cell>
              <Table.Cell>
                <Button bg="green.400" size="sm">
                  Approve
                </Button>
                <Button bg="red.400" size="sm" ml={2}>
                  Reject
                </Button>
                <Button bg="blue.400" size="sm" ml={2}>
                  Open
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
