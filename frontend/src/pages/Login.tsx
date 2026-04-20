import { Flex, Box, Text, Input, Button, VStack, Icon } from "@chakra-ui/react";
import { LuUser, LuEye, LuEyeOff } from "react-icons/lu";
import { useState } from "react";

const LoginPage: React.FC<{
  routeAfterLogin: (loginState: boolean) => void;
}> = ({ routeAfterLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ message: "" });

  const handleLogin = () => {
    fetch(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usernameOrEmail: email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token == null || data.token == undefined) {
          throw new Error("Invalid login response: " + JSON.stringify(data));
        }
        console.log("Login successful:", data);
        localStorage.setItem("token", data.token);
      })
      .then(() => {
        routeAfterLogin(true);
      })
      .catch((error) => {
        console.error("Login failed:", error);
        setError({ message: "Login failed. Please check your credentials." });
        routeAfterLogin(false);
      });
  };

  return (
    <Flex h="100vh" align="center" justify="center" bg="gray.900" color="white">
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <Text fontSize="sm" color="red.400" alignSelf="center" mb={4}>
            {error.message}
          </Text>
          <Button colorScheme="teal" w="full" onClick={() => handleLogin()}>
            Sign in
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default LoginPage;
