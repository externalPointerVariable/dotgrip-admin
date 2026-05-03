import React, { useState, useEffect } from "react";
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
  numberOfInfluencers: {
    currentValue: number;
    percentageChange: number;
    changeType: "increase" | "decrease";
  };
  pendingTasks: number;
  inactiveProfiles: number;
}

const Dashboard: React.FC = () => {
  const [topNiches, setTopNiches] = useState<TopNiche[]>([]);
  const [dashboardValues, setDashboardValues] = useState<DashboardPropsValues | null>(null);

  useEffect(() => {
    // Initializing data inside useEffect to prevent infinite loops
    setTopNiches([
      { name: "Fashion", influencers: 120, progressValue: 80 },
      { name: "Tech", influencers: 90, progressValue: 60 },
      { name: "Fitness", influencers: 70, progressValue: 50 },
    ]);

    setDashboardValues({
      numberOfInfluencers: {
        currentValue: 10,
        percentageChange: 12,
        changeType: "increase",
      },
      pendingTasks: 3,
      inactiveProfiles: 2,
    });
  }, []);

  // Loading state to prevent errors if dashboardValues is null
  if (!dashboardValues) return null;

  return (
    <Box>
      {/* Metrics Section */}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={10} mb={10}>
        
        {/* Total Influencers */}
        <Stat.Root
          bg="gray.700"
          transitionDuration="0.3s"
          _hover={{ transform: "scale(1.02)" }}
          p={8}
          borderRadius="lg"
          color="white"
          fontSize="lg"
        >
          <Flex justify="space-between" align="center" mb={2}>
            <Stat.Label fontSize="lg">Total Influencers</Stat.Label>
            <Icon as={LuUsers} boxSize={6} color="cyan.400" />
          </Flex>
          <Stat.ValueText fontSize="3xl">
            {dashboardValues.numberOfInfluencers.currentValue}
          </Stat.ValueText>
          <Stat.HelpText fontSize="md">
            {dashboardValues.numberOfInfluencers.changeType === "increase" ? (
              <Stat.UpIndicator />
            ) : (
              <Stat.DownIndicator />
            )}
            {dashboardValues.numberOfInfluencers.percentageChange}% from last month
          </Stat.HelpText>
        </Stat.Root>

        {/* Pending Tasks */}
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
          <Stat.ValueText fontSize="3xl">
            {dashboardValues.pendingTasks}
          </Stat.ValueText>
          <Stat.HelpText fontSize="md">Awaiting approval</Stat.HelpText>
        </Stat.Root>

        {/* Inactive Profiles */}
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
          <Stat.ValueText fontSize="3xl">
            {dashboardValues.inactiveProfiles}
          </Stat.ValueText>
          <Stat.HelpText fontSize="md">Need attention</Stat.HelpText>
        </Stat.Root>
      </SimpleGrid>

      {/* Top Niches */}
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
          <Text fontSize="2xl" fontWeight="bold">Top Niches</Text>
        </Card.Title>
        <Card.Body>
          <VStack align="stretch" gap={5}>
            {topNiches.map((niche, index) => (
              <Stat.Root key={index}>
                <Flex gap={2} align="center" justifyContent={"space-between"}>
                  <Stat.Label fontSize="lg">{niche.name}</Stat.Label>
                  <Stat.Label fontSize="lg">
                    <span>{niche.influencers}</span> Influencers
                  </Stat.Label>
                </Flex>
                <Progress.Root
                  width={"90%"}
                  value={niche.progressValue}
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