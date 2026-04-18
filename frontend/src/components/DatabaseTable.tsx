import { InfluencerProfile } from "@/pages";
import type { Influencer } from "@/types/influencer";
import {
  Box,
  Center,
  HStack,
  RatingGroup,
  Table,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuExternalLink } from "react-icons/lu";

interface DatabaseTableProps {
  influencers: Influencer[] | null;
}

export default function DatabaseTable({ influencers }: DatabaseTableProps) {
  console.log(influencers);
  const [current, setCurrent] = useState<Influencer | null>(null);

  const unset = () => {
    setCurrent(null);
  };

  if (current)
    return (
      <InfluencerProfile
        dummyInfluencer={current}
        unsetSelectedInfluencer={unset}
      />
    );

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
          {influencers
            ?.filter((inf) => inf.taskStatus === "approved")
            .map((influencer) => (
              <Table.Row key={influencer._id}>
                <Table.Cell>
                  <Box>
                    <Text onClick={() => setCurrent(influencer)}>
                      {influencer.name}
                    </Text>

                    <HStack>
                      {"@" +
                        influencer.instagramLink.split("/")[3]?.split("?")[0]}
                      <a href={influencer.instagramLink} target="_blank">
                        <LuExternalLink />
                      </a>
                    </HStack>
                  </Box>
                </Table.Cell>

                <Table.Cell>{influencer.instagram?.followerCount}</Table.Cell>

                <Table.Cell>
                  <RatingGroup.Root
                    colorPalette="yellow"
                    allowHalf
                    readOnly
                    count={5}
                    value={influencer?.contentRating || 0}
                  >
                    <RatingGroup.HiddenInput />
                    <RatingGroup.Control />
                  </RatingGroup.Root>
                </Table.Cell>

                <Table.Cell>{influencer.primeNiche}</Table.Cell>
                <Table.Cell>{influencer.instagram?.averageViews}</Table.Cell>
                <Table.Cell>{influencer.instagram?.averageLikes}</Table.Cell>
                <Table.Cell>{influencer.address?.[0]?.city}</Table.Cell>
                <Table.Cell>{influencer.taskStatus}</Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    </Center>
  );
}
