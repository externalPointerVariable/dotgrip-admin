import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  NumberInput,
  VStack,
  HStack,
  Tag,
  Wrap,
  WrapItem,
  Heading,
  SimpleGrid,
  Field,
  Separator,
  Select,
  createListCollection,
} from "@chakra-ui/react";

const InfluencerForm = ({ influencerId, influencerName, onClose }: any) => {
  const [formData, setFormData] = useState<any>({
    name: influencerName || "",
    taskStatus: "pending",
    contentKeywords: [],
    audienceCityTier: [],
    plan: {},
  });

  const [token, setToken] = useState<string | null>(null);

  // ✅ Sync name when prop changes (IMPORTANT)
  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      name: influencerName || "",
    }));
  }, [influencerName]);

  // ✅ Collections
  const ratingCollection = createListCollection({
    items: [1, 2, 3, 4, 5].map((n) => ({
      label: n.toString(),
      value: n.toString(),
    })),
  });

  const genderCollection = createListCollection({
    items: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Other", value: "other" },
    ],
  });

  const pricingCollection = createListCollection({
    items: [
      { label: "Lite", value: "lite" },
      { label: "Standard", value: "standard" },
      { label: "Premium", value: "premium" },
    ],
  });

  const handleInputChange = (field: string, value: any) => {
    const actualValue = Array.isArray(value) ? value[0] : value;
    setFormData((prev: any) => ({ ...prev, [field]: actualValue }));
  };

  const handlePlanChange = (key: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      plan: { ...prev.plan, [key]: value },
    }));
  };

  const addTag = (field: string, value: string) => {
    if (!value) return;
    setFormData((prev: any) => ({
      ...prev,
      [field]: [...(prev[field] || []), value],
    }));
  };

  const removeTag = (field: string, index: number) => {
    const updated = [...formData[field]];
    updated.splice(index, 1);
    handleInputChange(field, updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      ...formData,
      taskStatus: "approved",
    };

    console.log(payload);

    await fetch(
      `${import.meta.env.VITE_BASE_URL}/influencers/${influencerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );

    onClose?.();
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  return (
    <Box h="full" display="flex" flexDirection="column">
      {/* Scroll Area */}
      <Box flex="1" overflowY="auto" px={6} py={5}>
        <form id="influencer-form" onSubmit={handleSubmit}>
          <VStack align="stretch" gap={8}>
            {/* ================= BASIC INFO ================= */}
            <Box>
              <Heading size="md" mb={4}>
                Basic Information
              </Heading>

              <VStack gap={5}>
                {/* NAME */}
                <Field.Root>
                  <Field.Label>Name</Field.Label>
                  <Input
                    value={formData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </Field.Root>

                {/* NICHE */}
                <Field.Root>
                  <Field.Label>Prime Niche</Field.Label>
                  <Input
                    value={formData.primeNiche || ""}
                    onChange={(e) =>
                      handleInputChange("primeNiche", e.target.value)
                    }
                  />
                </Field.Root>

                {/* KEYWORDS */}
                <Field.Root>
                  <Field.Label>Content Keywords</Field.Label>
                  <Wrap mb={2}>
                    {formData.contentKeywords.map((k: string, i: number) => (
                      <WrapItem key={i}>
                        <Tag.Root borderRadius="full">
                          {k}
                          <Tag.CloseTrigger
                            onClick={() => removeTag("contentKeywords", i)}
                          />
                        </Tag.Root>
                      </WrapItem>
                    ))}
                  </Wrap>

                  <Input
                    placeholder="Press Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag(
                          "contentKeywords",
                          (e.target as HTMLInputElement).value,
                        );
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                  />
                </Field.Root>

                {/* CITY TIER */}
                <Field.Root>
                  <Field.Label>Audience City Tier</Field.Label>
                  <Wrap mb={2}>
                    {formData.audienceCityTier.map((t: string, i: number) => (
                      <WrapItem key={i}>
                        <Tag.Root borderRadius="full">
                          {t}
                          <Tag.CloseTrigger
                            onClick={() => removeTag("audienceCityTier", i)}
                          />
                        </Tag.Root>
                      </WrapItem>
                    ))}
                  </Wrap>

                  <Input
                    placeholder="Press Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag(
                          "audienceCityTier",
                          (e.target as HTMLInputElement).value,
                        );
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                  />
                </Field.Root>

                {/* SELECTS */}
                <SimpleGrid columns={2} gap={4}>
                  <Field.Root>
                    <Field.Label>Content Rating</Field.Label>

                    <Select.Root
                      collection={ratingCollection}
                      value={[String(formData.contentRating || "1")]} // ✅ array
                      onValueChange={(e) =>
                        handleInputChange("contentRating", Number(e.value[0]))
                      }
                    >
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select rating" />
                      </Select.Trigger>

                      <Select.Content>
                        {ratingCollection.items.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            <Select.ItemText>{item.label}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Gender</Field.Label>
                    <Select.Root
                      collection={genderCollection}
                      value={[formData.Gender]}
                      onValueChange={(e) =>
                        handleInputChange("Gender", e.value)
                      }
                    >
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select gender" />
                      </Select.Trigger>
                      <Select.Content>
                        {genderCollection.items.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            <Select.ItemText>{item.label}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </Field.Root>
                </SimpleGrid>

                {/* DATE + AGE */}
                <SimpleGrid columns={2} gap={4}>
                  <Field.Root>
                    <Field.Label>Date</Field.Label>
                    <Input
                      type="date"
                      value={formData.onboardDate || ""}
                      onChange={(e) =>
                        handleInputChange("onboardDate", e.target.value)
                      }
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Age</Field.Label>
                    <NumberInput.Root
                      value={formData.age?.toString() || ""}
                      onValueChange={(e) =>
                        handleInputChange("age", Number(e.value))
                      }
                    >
                      <NumberInput.Input />
                    </NumberInput.Root>
                  </Field.Root>
                </SimpleGrid>
              </VStack>
            </Box>

            <Separator />

            {/* ================= PLAN ================= */}
            <Box>
              <Heading size="md" mb={4}>
                Plan
              </Heading>

              <SimpleGrid columns={2} gap={4}>
                <Field.Root>
                  <Field.Label>Pricing</Field.Label>
                  <Select.Root
                    collection={pricingCollection}
                    value={formData.plan?.pricing || ""}
                    onValueChange={(e: any) =>
                      handlePlanChange("pricing", e.value)
                    }
                  >
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select plan" />
                    </Select.Trigger>
                    <Select.Content>
                      {pricingCollection.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                          <Select.ItemText>{item.label}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Field.Root>

                <Field.Root>
                  <Field.Label>Renewal Date</Field.Label>
                  <Input
                    type="date"
                    value={formData.plan?.renewalDate || ""}
                    onChange={(e) =>
                      handlePlanChange("renewalDate", e.target.value)
                    }
                  />
                </Field.Root>
              </SimpleGrid>
            </Box>
          </VStack>
        </form>
      </Box>

      {/* FOOTER */}
      <Box p={4} borderTop="1px solid" bg="gray.900">
        <HStack justifyContent="center">
          <Button
            variant="ghost"
            border="1px solid"
            borderColor="gray.300"
            _hover={{ bg: "whiteAlpha.200" }}
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="influencer-form"
            bg="cyan.600"
            color="white"
            _hover={{ bg: "cyan.700" }}
          >
            Save
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default InfluencerForm;
