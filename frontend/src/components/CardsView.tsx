import {
  Avatar,
  Badge,
  Box,
  Card,
  Flex,
  Grid,
  HStack,
  IconButton,
  Text,
  AvatarGroup,
  VStack,
} from "@chakra-ui/react";
import { FiEdit2 } from "react-icons/fi";
import type { Influencer } from "@/types/influencer";

const formatNumber = (value?: number | null) =>
  value === undefined || value === null ? "N/A" : value.toLocaleString();

const getInstagramHandle = (link: string) => {
  if (!link) return "-";

  try {
    const url = new URL(link);
    const handle = url.pathname.replace(/^\//, "").replace(/\/$/, "");
    return handle ? `@${handle}` : link;
  } catch {
    // if not a valid URL, return as-is (maybe already an @handle)
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

export default function CardsView({
  filteredInfluencers,
}: {
  filteredInfluencers: Influencer[];
}) {
  return (
    <Grid
      gap={6}
      templateColumns={{
        base: "1fr",
        md: "repeat(2, 1fr)",
        lg: "repeat(3, 1fr)",
      }}
    >
      {filteredInfluencers.map((influencer) => {
        const instagramHandle = getInstagramHandle(influencer.instagramLink);
        const followers = formatNumber(influencer.instagram?.followerCount);
        const views = formatNumber(influencer.instagram?.averageViews);
        const likes = formatNumber(influencer.instagram?.averageLikes);
        const comments = formatNumber(influencer.instagram?.averageComments);
        const shares = formatNumber(influencer.instagram?.averageShares);

        const address = influencer.address?.[0];
        const contact = influencer.contact?.[0];

        const statusBadge =
          influencer.taskStatus === "approved" ? "Approved" : "Pending";
        const activeBadge =
          influencer.taskStatus === "approved" ? "Active" : "Inactive";

        return (
          <Card.Root
            key={influencer._id}
            bg="whiteAlpha.100"
            borderRadius="lg"
            boxShadow="lg"
            overflow="hidden"
            transitionDuration="0.25s"
            _hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
          >
            <Box bg="gray.800" px={5} py={4}>
              <Flex justify="space-between" align="center" gap={4}>
                <HStack>
                  <AvatarGroup>
                    <Avatar.Root bg="cyan.500" color="white" size="md">
                      <Avatar.Fallback>
                        {getInitials(influencer.name)}
                      </Avatar.Fallback>
                      <Avatar.Image
                        src={undefined}
                        alt={influencer.name ?? "Avatar"}
                      />
                    </Avatar.Root>
                  </AvatarGroup>

                  <Box>
                    <Text fontSize="lg" fontWeight="bold">
                      {influencer.name || "Unnamed"}
                    </Text>
                    <Text fontSize="sm" color="gray.300">
                      {instagramHandle}
                    </Text>
                  </Box>
                </HStack>

                <IconButton
                  aria-label="Edit"
                  variant="ghost"
                  color="gray.200"
                  _hover={{ bg: "whiteAlpha.100" }}
                  size="sm"
                >
                  <FiEdit2 />
                </IconButton>
              </Flex>

              <HStack mt={3} wrap="wrap">
                {influencer.primeNiche && (
                  <Badge colorScheme="cyan" variant="solid">
                    {influencer.primeNiche}
                  </Badge>
                )}
                <Badge
                  colorScheme={activeBadge === "Active" ? "green" : "gray"}
                >
                  {activeBadge}
                </Badge>
                <Badge
                  colorScheme={statusBadge === "Approved" ? "green" : "yellow"}
                >
                  {statusBadge}
                </Badge>
              </HStack>
            </Box>

            <Card.Body px={5} py={4}>
              <Flex justify="space-between" align="flex-end" mb={4}>
                <VStack align="flex-start">
                  <Text fontSize="xs" color="gray.400">
                    Followers
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold">
                    {followers}
                  </Text>
                </VStack>

                <HStack>
                  <VStack align="flex-start">
                    <Text fontSize="xs" color="gray.400">
                      Views
                    </Text>
                    <Text fontWeight="semibold">{views}</Text>
                  </VStack>
                  <VStack align="flex-start">
                    <Text fontSize="xs" color="gray.400">
                      Likes
                    </Text>
                    <Text fontWeight="semibold">{likes}</Text>
                  </VStack>
                  <VStack align="flex-start">
                    <Text fontSize="xs" color="gray.400">
                      Comments
                    </Text>
                    <Text fontWeight="semibold">{comments}</Text>
                  </VStack>
                  <VStack align="flex-start">
                    <Text fontSize="xs" color="gray.400">
                      Shares
                    </Text>
                    <Text fontWeight="semibold">{shares}</Text>
                  </VStack>
                </HStack>
              </Flex>

              <VStack align="stretch" mt={4}>
                <HStack wrap="wrap">
                  {influencer.contentKeywords?.map((keyword) => (
                    <Badge key={keyword} colorScheme="purple" variant="subtle">
                      {keyword}
                    </Badge>
                  ))}
                </HStack>

                {address && (
                  <Text fontSize="sm" color="gray.300">
                    {address.city ?? ""}
                    {address.state ? `, ${address.state}` : ""}
                    {address.country ? `, ${address.country}` : ""}
                    {address.zipCode ? `, ${address.zipCode}` : ""}
                    {address.region ? ` (${address.region})` : ""}
                  </Text>
                )}

                {contact && (
                  <Text fontSize="sm" color="gray.300">
                    {contact.email ? `${contact.email}` : ""}
                    {contact.phone ? ` • ${contact.phone}` : ""}
                    {contact.type ? ` • ${contact.type}` : ""}
                  </Text>
                )}

                <Text fontSize="xs" color="gray.500">
                  {influencer.plan?.renewalDate
                    ? `Renewal: ${new Date(influencer.plan.renewalDate).toLocaleDateString()}`
                    : ""}
                  {influencer.onboardDate
                    ? ` • Onboarded: ${new Date(influencer.onboardDate).toLocaleDateString()}`
                    : ""}
                </Text>
              </VStack>
            </Card.Body>
          </Card.Root>
        );
      })}
    </Grid>
  );
}
