import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Link,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  LuArrowLeft,
  LuMail,
  LuPhone,
  LuMapPin,
  LuUsers,
  LuPencil,
} from "react-icons/lu";
import { FaStar } from "react-icons/fa";
import type { Influencer } from "@/types/influencer";

const formatDate = (value?: string | Date | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const formatNumber = (value?: number) => {
  if (typeof value !== "number") return "-";
  return value.toLocaleString(undefined, { maximumFractionDigits: 1 });
};

const getEngagementRate = (inf: Influencer) => {
  const likes = inf.instagram?.averageLikes ?? 0;
  const comments = inf.instagram?.averageComments ?? 0;
  const followers = inf.instagram?.followerCount ?? 0;
  if (!followers) return 0;
  return ((likes + comments) / followers) * 100;
};

const InfluencerProfile = ({
  dummyInfluencer,
  unsetSelectedInfluencer,
}: {
  dummyInfluencer: Influencer;
  unsetSelectedInfluencer: () => void;
}) => {
  const inf = dummyInfluencer;
  const engagementRate = getEngagementRate(inf);
  const selfContact = inf.contact?.find((c) => c.type === "self");
  const managerContact = inf.contact?.find((c) => c.type === "manager");
  const location = inf.address?.[0];
  const handle =
    inf.instagramLink?.split("/").filter(Boolean).slice(-1)[0] ?? "";
  const badgeColor = inf.taskStatus === "approved" ? "green" : "orange";

  return (
    <Box maxW="1200px">
      <Button variant="ghost" size="sm" onClick={unsetSelectedInfluencer}>
        <LuArrowLeft />
        Back to Database
      </Button>

      <Stack>
        {/* Header Card */}
        <Flex
          borderRadius="lg"
          bg={"gray.700"}
          boxShadow="sm"
          justify="space-between"
          align="flex-start"
          flexDir={{ base: "column", md: "row" }}
        >
          <Flex flex={1} minW={0}>
            <Avatar.Root size="xl" key="xl">
              <Avatar.Fallback name={inf.name ?? ""} />
              <Avatar.Image src={undefined} alt={inf.name ?? "Avatar"} />
            </Avatar.Root>

            <Box flex={1} minW={0}>
              <Heading size="md">{inf.name}</Heading>
              <Stack>
                <Link
                  href={inf.instagramLink}
                  color="cyan.600"
                  fontWeight="medium"
                >
                  @{handle}
                </Link>
                <Stack direction="row">
                  <Badge colorScheme={badgeColor} variant="subtle">
                    {inf.taskStatus === "approved" ? "Active" : "Pending"}
                  </Badge>
                  <Badge colorScheme="green" variant="subtle">
                    {inf.taskStatus === "approved" ? "Approved" : "Review"}
                  </Badge>
                  {inf.audienceCityTier?.map((tier) => (
                    <Badge key={tier} colorScheme="purple" variant="subtle">
                      {tier}
                    </Badge>
                  ))}
                </Stack>
              </Stack>

              <Stack direction="row">
                {inf.primeNiche && (
                  <Badge colorScheme="cyan" variant="outline">
                    {inf.primeNiche}
                  </Badge>
                )}
                {inf.contentKeywords?.map((kw) => (
                  <Badge key={kw} colorScheme="gray" variant="outline">
                    {kw}
                  </Badge>
                ))}
              </Stack>

              <Stack direction="row">
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Followers
                  </Text>
                  <Text fontSize="lg" fontWeight="semibold">
                    {inf.instagram?.followerCountString ??
                      formatNumber(inf.instagram?.followerCount)}
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Rating
                  </Text>
                  <Stack direction="row">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Icon
                        key={idx}
                        as={FaStar}
                        color={
                          idx < (inf.contentRating ?? 0)
                            ? "yellow.400"
                            : "gray.200"
                        }
                      />
                    ))}
                  </Stack>
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Engagement
                  </Text>
                  <Text fontSize="lg" fontWeight="semibold">
                    {engagementRate.toFixed(2)}%
                  </Text>
                </Box>
              </Stack>
            </Box>
          </Flex>

          {/* <Button colorScheme="teal">
            <LuPencil />
            Edit Profile
          </Button> */}
        </Flex>

        {/* Stats Cards */}
        <SimpleGrid columns={{ base: 1, md: 4 }}>
          <Box borderRadius="lg" bg={"gray.700"} boxShadow="sm">
            <Text fontSize="sm" color="gray.500">
              Avg Views
            </Text>
            <Text fontSize="2xl" fontWeight="bold">
              {formatNumber(inf.instagram?.averageViews)}
            </Text>
          </Box>
          <Box borderRadius="lg" bg={"gray.700"} boxShadow="sm">
            <Text fontSize="sm" color="gray.500">
              Avg Likes
            </Text>
            <Text fontSize="2xl" fontWeight="bold">
              {formatNumber(inf.instagram?.averageLikes)}
            </Text>
          </Box>
          <Box borderRadius="lg" bg={"gray.700"} boxShadow="sm">
            <Text fontSize="sm" color="gray.500">
              Avg Comments
            </Text>
            <Text fontSize="2xl" fontWeight="bold">
              {formatNumber(inf.instagram?.averageComments)}
            </Text>
          </Box>
          <Box borderRadius="lg" bg={"gray.700"} boxShadow="sm">
            <Text fontSize="sm" color="gray.500">
              Avg Shares
            </Text>
            <Text fontSize="2xl" fontWeight="bold">
              {formatNumber(inf.instagram?.averageShares)}
            </Text>
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }}>
          <Box borderRadius="lg" bg={"gray.700"} boxShadow="sm">
            <Heading size="sm">Contact</Heading>
            <Stack>
              <Stack direction="row">
                <Icon as={LuMail} color="gray.500" />
                <Text fontWeight="medium">{selfContact?.email ?? "-"}</Text>
              </Stack>
              <Stack direction="row">
                <Icon as={LuPhone} color="gray.500" />
                <Text fontWeight="medium">{selfContact?.phone ?? "-"}</Text>
              </Stack>
              <Stack direction="row">
                <Icon as={LuMail} color="gray.500" />
                <Text fontWeight="medium">{managerContact?.email ?? "-"}</Text>
              </Stack>
              <Stack direction="row">
                <Icon as={LuPhone} color="gray.500" />
                <Text fontWeight="medium">{managerContact?.phone ?? "-"}</Text>
              </Stack>
            </Stack>
          </Box>

          <Box borderRadius="lg" bg={"gray.700"} boxShadow="sm">
            <Heading size="sm">Profile Details</Heading>
            <Stack>
              <Stack direction="row" align="start">
                <Icon as={LuMapPin} color="gray.500" />
                <Box>
                  <Text fontWeight="medium">Location</Text>
                  <Text color="gray.500">
                    {location
                      ? `${location.city}, ${location.state}, ${location.country} ${location.zipCode} (${location.region})`
                      : "-"}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="row" align="start">
                <Icon as={LuUsers} color="gray.500" />
                <Box>
                  <Text fontWeight="medium">Manager</Text>
                  <Text color="gray.500">{managerContact?.email ?? "-"}</Text>
                </Box>
              </Stack>
              <Stack direction="row">
                <Text fontWeight="medium" minW="120px">
                  Gender
                </Text>
                <Text color="gray.500">{inf.Gender ?? "-"}</Text>
              </Stack>
              <Stack direction="row">
                <Text fontWeight="medium" minW="120px">
                  Age
                </Text>
                <Text color="gray.500">{inf.age ?? "-"} yrs</Text>
              </Stack>
              <Stack direction="row">
                <Text fontWeight="medium" minW="120px">
                  Onboarded
                </Text>
                <Text color="gray.500">{formatDate(inf.onboardDate)}</Text>
              </Stack>
              <Stack direction="row">
                <Text fontWeight="medium" minW="120px">
                  Renewal
                </Text>
                <Text color="gray.500">
                  {formatDate(inf.plan?.renewalDate)}
                </Text>
              </Stack>
            </Stack>
          </Box>
        </SimpleGrid>
      </Stack>
    </Box>
  );
};

export default InfluencerProfile;
