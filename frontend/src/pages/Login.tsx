import {
  Flex,
  Box,
  Text,
  Input,
  Button,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { LuUser, LuEye, LuEyeOff } from "react-icons/lu";
import { useState } from "react";

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Flex
      h="100vh"
      align="center"
      justify="center"
      bg="gray.900"
      color="white"
    >
      <Box
        bg="gray.800"
        p={8}
        borderRadius="md"
        boxShadow="lg"
        w="sm"
        textAlign="center"
      >
        {/* Top Icon */}
        <Icon as={LuUser} boxSize={12} color="teal.400" mb={4} />

        {/* Heading */}
        <Text fontSize="2xl" fontWeight="bold" mb={2}>
          Welcome back
        </Text>
        <Text fontSize="sm" color="gray.400" mb={6}>
          Sign in to your Dotgrip Admin account
        </Text>

        {/* Form */}
        <VStack gap={4}>
          <Input
            placeholder="Email"
            type="email"
            bg="gray.700"
            border="none"
            _placeholder={{ color: "gray.400" }}
          />

          {/* Password with toggle (Flex workaround + Button child icon) */}
          <Flex
            align="center"
            bg="gray.700"
            borderRadius="md"
            px={1}
            width={"full"}
          >
            <Input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              border="none"
              _placeholder={{ color: "gray.400" }}
              flex="1"
            />
            <Button
              aria-label={showPassword ? "Hide password" : "Show password"}
              size="sm"
              variant="ghost"
              color="white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <LuEyeOff /> : <LuEye />}
            </Button>
          </Flex>

          <Button colorScheme="teal" w="full">
            Sign in
          </Button>
        </VStack>

        {/* Demo credentials */}
        <Text fontSize="xs" color="gray.500" mt={6}>
          Demo credentials: admin@dotgrip.com / admin123
        </Text>
      </Box>
    </Flex>
  );
};

export default LoginPage;