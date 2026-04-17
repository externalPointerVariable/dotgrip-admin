import {
  Avatar,
  Badge,
  Box,
  Card,
  Grid,
  HStack,
  Text,
  Center,
} from "@chakra-ui/react";
import type { Influencer } from "@/types/influencer";
import { useState } from "react";
import { InfluencerProfile } from "@/pages";
import { LuExternalLink } from "react-icons/lu";

/* ---------------- HELPERS ---------------- */

const formatNumber = (value?: number | null) =>
  value === undefined || value === null ? "N/A" : value.toLocaleString();

const getInstagramHandle = (link: string) => {
  if (!link) return "-";

  try {
    const url = new URL(link);
    const handle = url.pathname.replace(/^\//, "").replace(/\/$/, "");
    return handle ? `@${handle}` : link;
  } catch {
    return link.startsWith("@") ? link : `@${link}`;
  }
};

const getInitials = (name?: string) => {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

/* ---------------- SMALL COMPONENT ---------------- */

const Stat = ({
  label,
  value,
  big = false,
}: {
  label: string;
  value: string;
  big?: boolean;
}) => (
  <Box>
    <Text fontSize="xs" color="gray.500">
      {label}
    </Text>
    <Text fontSize={big ? "xl" : "sm"} fontWeight={big ? "bold" : "semibold"}>
      {value}
    </Text>
  </Box>
);

/* ---------------- MAIN COMPONENT ---------------- */

interface CardViewProps {
  influencers: Influencer[] | null;
}

export default function CardsView({ influencers }: CardViewProps) {
  const [current, setCurrent] = useState<Influencer | null>(null);

  const unset = () => {
    setCurrent(null);
  };

  if (current) {
    return (
      <InfluencerProfile
        dummyInfluencer={current}
        unsetSelectedInfluencer={unset}
      />
    );
  }

  return (
    <Center w="100%">
      <Grid
        maxW="1100px"
        w="100%"
        gap={6}
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
      >
        {influencers
          ?.filter((inf) => inf.taskStatus === "approved")
          .map((influencer) => {
            const instagramHandle = getInstagramHandle(
              influencer.instagramLink
            );

            const followers = formatNumber(
              influencer.instagram?.followerCount
            );
            const views = formatNumber(influencer.instagram?.averageViews);
            const likes = formatNumber(influencer.instagram?.averageLikes);
            const comments = formatNumber(
              influencer.instagram?.averageComments
            );

            const address = influencer.address?.[0];
            const contact = influencer.contact?.[0];

            return (
              <Card.Root
                key={influencer._id}
                maxW="340px"
                w="100%"
                bg="gray.900"
                border="1px solid"
                borderColor="whiteAlpha.200"
                borderRadius="xl"
                boxShadow="lg"
                transition="0.25s"
                _hover={{
                  transform: "translateY(-4px)",
                  boxShadow: "2xl",
                  borderColor: "cyan.400",
                }}
              >
                {/* HEADER */}
                <Box
                  px={5}
                  py={4}
                  borderBottom="1px solid"
                  borderColor="whiteAlpha.200"
                >
                  <HStack align="center" gap={3}>
                    <Avatar.Root bg="cyan.500" size="md">
                      <Avatar.Fallback>
                        {getInitials(influencer.name)}
                      </Avatar.Fallback>
                    </Avatar.Root>

                    <Box flex="1">
                      <Text
                        fontWeight="semibold"
                        fontSize="md"
                        cursor="pointer"
                        onClick={() => setCurrent(influencer)}
                      >
                        {influencer.name || "Unnamed"}
                      </Text>

                      <HStack fontSize="xs" color="gray.400">
                        <Text>{instagramHandle}</Text>
                        <a
                          href={influencer.instagramLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LuExternalLink />
                        </a>
                      </HStack>
                    </Box>
                  </HStack>

                  {/* BADGES */}
                  <HStack mt={3} gap={2} flexWrap="wrap">
                    {influencer.primeNiche && (
                      <Badge colorScheme="cyan" variant="subtle">
                        {influencer.primeNiche}
                      </Badge>
                    )}
                    <Badge colorScheme="green" variant="subtle">
                      Active
                    </Badge>
                    <Badge colorScheme="green" variant="solid">
                      Approved
                    </Badge>
                  </HStack>
                </Box>

                {/* BODY */}
                <Card.Body px={5} py={4}>
                  {/* STATS */}
                  <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
                    <Stat label="Followers" value={followers} big />
                    <Stat label="Views" value={views} />
                    <Stat label="Likes" value={likes} />
                    <Stat label="Comments" value={comments} />
                  </Grid>

                  {/* KEYWORDS */}
                  <HStack flexWrap="wrap" mb={3}>
                    {influencer.contentKeywords?.map((keyword) => (
                      <Badge
                        key={keyword}
                        colorScheme="purple"
                        variant="subtle"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </HStack>

                  {/* ADDRESS */}
                  {address && (
                    <Text fontSize="sm" color="gray.400" mb={1}>
                      {address.city}
                      {address.state && `, ${address.state}`}
                      {address.country && `, ${address.country}`}
                    </Text>
                  )}

                  {/* CONTACT */}
                  {contact && (
                    <Text fontSize="sm" color="gray.400">
                      {contact.email}
                      {contact.phone && ` • ${contact.phone}`}
                    </Text>
                  )}

                  {/* FOOTER */}
                  <Text fontSize="xs" color="gray.500" mt={2}>
                    {influencer.plan?.renewalDate &&
                      `Renewal: ${new Date(
                        influencer.plan.renewalDate
                      ).toLocaleDateString()}`}
                    {influencer.onboardDate &&
                      ` • Onboarded: ${new Date(
                        influencer.onboardDate
                      ).toLocaleDateString()}`}
                  </Text>
                </Card.Body>
              </Card.Root>
            );
          })}
      </Grid>
    </Center>
  );
}