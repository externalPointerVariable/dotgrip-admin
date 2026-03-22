import type { Influencer } from "@/types/influencer";
import {
  Center,
  HStack,
  NativeSelect,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function DatabaseTable() {
  const [influencers, setInfluencers] = useState<[Influencer] | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      fetch("http://localhost:8000/api/influencers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          if (response.status == 401) {
            localStorage.removeItem("token");
            window.location.reload();
          }

          return response;
        })
        .then((response) => {
          setLoading(false);
          return response.json();
        })
        .then((data) => {
          setCurrentPage(data.pagination.page);
          setTotalPages(
            Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1),
          );
          setInfluencers(data.data);
        });
    } catch (error: any) {
      setError(error.message);
      console.error("Error fetching influencers:", error);
    }
  }, []);

  if (loading) return <Text>Loading...</Text>;
  else if (error) return <Text>{error}</Text>;

  return (
    <Center>
      <VStack>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Influencer</Table.ColumnHeader>
              <Table.ColumnHeader>Followers</Table.ColumnHeader>
              <Table.ColumnHeader>Rating</Table.ColumnHeader>
              <Table.ColumnHeader>Niche</Table.ColumnHeader>
              <Table.ColumnHeader>Avg. Views</Table.ColumnHeader>
              <Table.ColumnHeader>Avg. Likes</Table.ColumnHeader>
              <Table.ColumnHeader>Location</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {influencers &&
              influencers.length > 0 &&
              influencers.map((influencer) => {
                return (
                  <Table.Row key={influencer._id}>
                    <Table.Cell>{influencer.name}</Table.Cell>
                    <Table.Cell>
                      {influencer.instagram?.followerCount}
                    </Table.Cell>
                    <Table.Cell>{influencer.contentRating}</Table.Cell>
                    <Table.Cell>{influencer.primeNiche}</Table.Cell>
                    <Table.Cell>
                      {influencer.instagram?.averageViews}
                    </Table.Cell>
                    <Table.Cell>
                      {influencer.instagram?.averageLikes}
                    </Table.Cell>
                    <Table.Cell>{influencer.address?.[0].city}</Table.Cell>
                    <Table.Cell>{influencer.taskStatus}</Table.Cell>
                  </Table.Row>
                );
              })}
          </Table.Body>
        </Table.Root>
        <HStack>
          <NativeSelect.Root>
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
    </Center>
  );
}
