import {
  Avatar,
  Badge,
  Box,
  Flex,
  Heading,
  Icon,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Center,
  HStack,
} from "@chakra-ui/react";
import {
  LuArrowLeft,
  LuMail,
  LuPhone,
  LuMapPin,
  LuUsers,
} from "react-icons/lu";
import { FaStar } from "react-icons/fa";
import type { Influencer } from "@/types/influencer";

/* ---------------- HELPERS ---------------- */

const formatDate = (value?: string | Date | null) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
};

const formatNumber = (value?: number) => {
  if (typeof value !== "number") return "-";
  return value.toLocaleString();
};

const getEngagementRate = (inf: Influencer) => {
  const likes = inf.instagram?.averageLikes ?? 0;
  const comments = inf.instagram?.averageComments ?? 0;
  const followers = inf.instagram?.followerCount ?? 0;
  if (!followers) return 0;
  return ((likes + comments) / followers) * 100;
};

/* ---------------- COMPONENT ---------------- */

const InfluencerProfile = ({
  dummyInfluencer,
  unsetSelectedInfluencer,
}: {
  dummyInfluencer: Influencer;
  unsetSelectedInfluencer: () => void;
}) => {
  const inf = dummyInfluencer;
  const selfContact = inf.contact?.find((c) => c.type === "self");
  const managerContact = inf.contact?.find((c) => c.type === "manager");
  const location = inf.address?.[0];

  const handle =
    inf.instagramLink?.split("/").filter(Boolean).slice(-1)[0] ?? "";

  return (
    <Center w="100%">
      <Box maxW="1100px" w="100%">
        {/* BACK BUTTON */}
        <HStack
          mb={4}
          gap={2}
          cursor="pointer"
          onClick={unsetSelectedInfluencer}
          align="center"
        >
          <Icon as={LuArrowLeft} boxSize={4} />
          <Text fontSize="sm" fontWeight="medium">
            Back to Database
          </Text>
        </HStack>

        <Stack gap={6}>
          {/* HEADER */}
          <Box
            bg="gray.900"
            border="1px solid"
            borderColor="whiteAlpha.200"
            borderRadius="xl"
            p={6}
          >
            <Flex
              justify="space-between"
              align="flex-start"
              flexDir={{ base: "column", md: "row" }}
              gap={6}
            >
              {/* LEFT */}
              <HStack align="flex-start" gap={4}>
                <Avatar.Root size="xl">
                  <Avatar.Fallback name={inf.name ?? ""} />
                </Avatar.Root>

                <Box>
                  <Heading size="md">{inf.name}</Heading>

                  <Link
                    href={inf.instagramLink}
                    color="cyan.400"
                    fontSize="sm"
                  >
                    @{handle}
                  </Link>

                  <HStack mt={2}>
                    <Badge colorScheme="green" variant="subtle">
                      Active
                    </Badge>
                    <Badge colorScheme="green">Approved</Badge>
                    {inf.primeNiche && (
                      <Badge colorScheme="cyan" variant="subtle">
                        {inf.primeNiche}
                      </Badge>
                    )}
                  </HStack>

                  <HStack mt={3}>
                    <Text fontSize="sm" color="gray.400">
                      Followers:
                    </Text>
                    <Text fontWeight="bold">
                      {formatNumber(inf.instagram?.followerCount)}
                    </Text>
                  </HStack>

                  <HStack mt={2}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icon
                        key={i}
                        as={FaStar}
                        color={
                          i < (inf.contentRating ?? 0)
                            ? "yellow.400"
                            : "gray.600"
                        }
                      />
                    ))}
                  </HStack>
                </Box>
              </HStack>
            </Flex>
          </Box>

          {/* STATS */}
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3 }}
            gap={6}
            w="100%"
          >
            {[
              { label: "Avg Views", value: inf.instagram?.averageViews },
              { label: "Avg Likes", value: inf.instagram?.averageLikes },
              { label: "Avg Comments", value: inf.instagram?.averageComments },
            ].map((stat) => (
              <Box
                key={stat.label}
                bg="gray.900"
                border="1px solid"
                borderColor="whiteAlpha.200"
                borderRadius="lg"
                px={5}
                py={4}
                minH="100px"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                transition="0.2s"
                _hover={{
                  borderColor: "cyan.400",
                  transform: "translateY(-2px)",
                }}
              >
                <Text fontSize="xs" color="gray.500">
                  {stat.label}
                </Text>

                <Text fontSize="2xl" fontWeight="bold">
                  {formatNumber(stat.value)}
                </Text>
              </Box>
            ))}
          </SimpleGrid>

          {/* DETAILS */}
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            {/* CONTACT */}
            <Box
              bg="gray.900"
              border="1px solid"
              borderColor="whiteAlpha.200"
              borderRadius="xl"
              p={5}
            >
              <Heading size="sm" mb={4}>
                Contact
              </Heading>

              <Stack gap={3}>
                <HStack>
                  <Icon as={LuMail} />
                  <Text>{selfContact?.email ?? "-"}</Text>
                </HStack>
                <HStack>
                  <Icon as={LuPhone} />
                  <Text>{selfContact?.phone ?? "-"}</Text>
                </HStack>
                <HStack>
                  <Icon as={LuMail} />
                  <Text>{managerContact?.email ?? "-"}</Text>
                </HStack>
                <HStack>
                  <Icon as={LuPhone} />
                  <Text>{managerContact?.phone ?? "-"}</Text>
                </HStack>
              </Stack>
            </Box>

            {/* PROFILE DETAILS */}
            <Box
              bg="gray.900"
              border="1px solid"
              borderColor="whiteAlpha.200"
              borderRadius="xl"
              p={5}
            >
              <Heading size="sm" mb={4}>
                Profile Details
              </Heading>

              <Stack gap={3}>
                <HStack align="start">
                  <Icon as={LuMapPin} />
                  <Text>
                    {location
                      ? `${location.city}, ${location.state}, ${location.country}`
                      : "-"}
                  </Text>
                </HStack>

                <HStack>
                  <Icon as={LuUsers} />
                  <Text>{managerContact?.email ?? "-"}</Text>
                </HStack>

                <HStack justify="space-between">
                  <Text>Gender</Text>
                  <Text color="gray.400">{inf.Gender ?? "-"}</Text>
                </HStack>

                <HStack justify="space-between">
                  <Text>Age</Text>
                  <Text color="gray.400">{inf.age ?? "-"} yrs</Text>
                </HStack>

                <HStack justify="space-between">
                  <Text>Onboarded</Text>
                  <Text color="gray.400">
                    {formatDate(inf.onboardDate)}
                  </Text>
                </HStack>

                <HStack justify="space-between">
                  <Text>Renewal</Text>
                  <Text color="gray.400">
                    {formatDate(inf.plan?.renewalDate)}
                  </Text>
                </HStack>
              </Stack>
            </Box>
          </SimpleGrid>
        </Stack>
      </Box>
    </Center>
  );
};

export default InfluencerProfile;