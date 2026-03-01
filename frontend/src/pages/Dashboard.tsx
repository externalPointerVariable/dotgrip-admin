import React, { useState } from "react";
import {
  Box,
  SimpleGrid,
  Stat,
  Flex,
  Icon,
  Card,
  Text,
  VStack,
  Progress,
} from "@chakra-ui/react";
import { LuUsers, LuClock, LuUserX } from "react-icons/lu";

interface TopNiche {
  name: string;
  influencers: number;
  progressValue: number;
}

interface DashboardPropsValues {
  numberOfInfluencers: object;
  pendingTasks: number;
  inactiveProfiles: number;
}

const Dashboard: React.FC = () => {
  const [topNiches, setTopNiches] = useState<TopNiche[]>([
    { name: "Fashion", influencers: 1, progressValue: 30 },
    { name: "Fitness", influencers: 1, progressValue: 20 },
    { name: "Beauty", influencers: 1, progressValue: 25 },
    { name: "Tech", influencers: 1, progressValue: 15 },
    { name: "Food", influencers: 1, progressValue: 10 },
  ]);
  const [dashboardValues, setDashboardValues] = useState<DashboardPropsValues>({
    numberOfInfluencers: {
      currentValue: 10,
      percentageChange: 12,
      changeType: "increase",
    },
    pendingTasks: 3,
    inactiveProfiles: 2,
  });
  return (
    <Box>
      {/* Metrics Section */}
      <SimpleGrid
        columns={{ base: 1, md: 3 }} // 3 cards side by side on desktop
        gap={10} // more space between cards
        mb={10}
      >
        <Stat.Root
          bg="gray.700"
          transitionDuration="0.3s"
          _hover={{ transform: "scale(1.02)" }} // subtle hover effect
          p={8} // larger padding
          borderRadius="lg" // slightly bigger radius
          color="white"
          fontSize="lg" // bigger text overall
        >
          <Flex justify="space-between" align="center" mb={2}>
            <Stat.Label fontSize="lg">Total Influencers</Stat.Label>
            <Icon as={LuUsers} boxSize={6} color="cyan.400" />
          </Flex>
          <Stat.ValueText fontSize="3xl">10</Stat.ValueText>
          <Stat.HelpText fontSize="md">
            <Stat.UpIndicator />
            12% from last month
          </Stat.HelpText>
        </Stat.Root>

        <Stat.Root
          transitionDuration="0.3s"
          _hover={{ transform: "scale(1.02)" }}
          bg="gray.700"
          p={8}
          borderRadius="lg"
          color="white"
          fontSize="lg"
        >
          <Flex justify="space-between" align="center" mb={2}>
            <Stat.Label fontSize="lg">Pending Tasks</Stat.Label>
            <Icon as={LuClock} boxSize={6} color="yellow.400" />
          </Flex>
          <Stat.ValueText fontSize="3xl">3</Stat.ValueText>
          <Stat.HelpText fontSize="md">Awaiting approval</Stat.HelpText>
        </Stat.Root>

        <Stat.Root
          transitionDuration="0.3s"
          _hover={{ transform: "scale(1.02)" }}
          bg="gray.700"
          p={8}
          borderRadius="lg"
          color="white"
          fontSize="lg"
        >
          <Flex justify="space-between" align="center" mb={2}>
            <Stat.Label fontSize="lg">Inactive Profiles</Stat.Label>
            <Icon as={LuUserX} boxSize={6} color="red.400" />
          </Flex>
          <Stat.ValueText fontSize="3xl">2</Stat.ValueText>
          <Stat.HelpText fontSize="md">Need attention</Stat.HelpText>
        </Stat.Root>
      </SimpleGrid>

      {/* Top Niches - Full Width with improved spacing */}
      <Card.Root
        transitionDuration="0.3s"
        _hover={{ transform: "scale(1.01)" }}
        bg="gray.700"
        color="white"
        mb={10}
        p={8}
        borderRadius="lg"
      >
        <Card.Title>
          <Text fontSize="2xl" fontWeight="bold">
            Top Niches
          </Text>
        </Card.Title>
        <Card.Body>
          <VStack align="stretch" gap={5}>
            {topNiches.map((niche) => (
              <Stat.Root>
                <Flex gap={2} align="center" justifyContent={"space-between"}>
                  <Stat.Label fontSize="lg">{niche.name}</Stat.Label>
                  <Stat.Label fontSize="lg">
                    <span>{niche.influencers}</span> Influencers
                  </Stat.Label>
                </Flex>
                <Progress.Root
                  width={"90%"}
                  defaultValue={niche.progressValue}
                  colorPalette={"cyan"}
                  variant={"outline"}
                >
                  <Progress.Track borderRadius="full">
                    <Progress.Range borderRadius="full" />
                  </Progress.Track>
                </Progress.Root>
              </Stat.Root>
            ))}
          </VStack>
        </Card.Body>
      </Card.Root>
    </Box>
  );
};

export default Dashboard;
