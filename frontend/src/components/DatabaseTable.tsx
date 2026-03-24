import type { Influencer } from "@/types/influencer";
import { Center, Table } from "@chakra-ui/react";

interface DatabaseTableProps {
  influencers: [Influencer] | null;
}

export default function DatabaseTable({ influencers }: DatabaseTableProps) {
  return (
    <Center>
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
                  <Table.Cell>{influencer.instagram?.followerCount}</Table.Cell>
                  <Table.Cell>{influencer.contentRating}</Table.Cell>
                  <Table.Cell>{influencer.primeNiche}</Table.Cell>
                  <Table.Cell>{influencer.instagram?.averageViews}</Table.Cell>
                  <Table.Cell>{influencer.instagram?.averageLikes}</Table.Cell>
                  <Table.Cell>{influencer.address?.[0].city}</Table.Cell>
                  <Table.Cell>{influencer.taskStatus}</Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table.Root>
    </Center>
  );
}
