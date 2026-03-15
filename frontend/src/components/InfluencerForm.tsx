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
} from "@chakra-ui/react";
import { toaster } from "./ui/toaster";

interface Contact {
  type: "self" | "manager" | "agency";
  email?: string;
  phone?: string;
}

interface Address {
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  region: "urban" | "rural";
}

interface Plan {
  pricing?: "lite" | "standard" | "premium";
  renewalDate?: string;
}

interface InfluencerFormData {
  name?: string;
  primeNiche?: string;
  contentKeywords?: string[];
  audienceCityTier?: string[];
  contentRating?: number;
  Gender?: "male" | "female" | "other";
  onboardDate?: string;
  age?: number;
  contact?: Contact[];
  address?: Address[];
  plan?: Plan;
  taskStatus: "pending" | "approved";
}

interface InfluencerFormProps {
  influencerId: string;
  title?: string;
  onClose?: () => void;
}

const InfluencerForm = ({
  influencerId,
  title = "Influencer Form",
  onClose,
}: InfluencerFormProps) => {
  const [formData, setFormData] = useState<InfluencerFormData>({
    taskStatus: "pending",
  });

  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof InfluencerFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (
    field: "contentKeywords" | "audienceCityTier",
    value: string[],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (
    index: number,
    key: keyof Contact,
    value: string,
  ) => {
    const contacts = formData.contact || [];
    contacts[index] = { ...contacts[index], [key]: value };
    setFormData((prev) => ({ ...prev, contact: contacts }));
  };

  const addContact = () => {
    const contacts = formData.contact || [];
    contacts.push({ type: "self" });
    setFormData((prev) => ({ ...prev, contact: contacts }));
  };

  const removeContact = (index: number) => {
    const contacts = formData.contact || [];
    contacts.splice(index, 1);
    setFormData((prev) => ({ ...prev, contact: contacts }));
  };

  const handleAddressChange = (
    index: number,
    key: keyof Address,
    value: string,
  ) => {
    const addresses = formData.address || [];
    addresses[index] = { ...addresses[index], [key]: value as any };
    setFormData((prev) => ({ ...prev, address: addresses }));
  };

  const addAddress = () => {
    const addresses = formData.address || [];
    addresses.push({ region: "urban" });
    setFormData((prev) => ({ ...prev, address: addresses }));
  };

  const removeAddress = (index: number) => {
    const addresses = formData.address || [];
    addresses.splice(index, 1);
    setFormData((prev) => ({ ...prev, address: addresses }));
  };

  const handlePlanChange = (key: keyof Plan, value: string) => {
    const plan = formData.plan || {};
    plan[key] = value as any;
    setFormData((prev) => ({ ...prev, plan }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    formData.taskStatus = "approved";
    try {
      const response = await fetch(
        `http://localhost:8000/api/influencers/${influencerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update influencer");
      }

      onClose?.();

      toaster.create({
        title: "Success",
        description: "Influencer updated successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    setToken(token);
  }, []);

  if (error) {
    return (
      <Box p={6} color="red.500">
        {error}
      </Box>
    );
  }

  return (
    <Box p={6} w="full" h="full" overflowY="auto">
      {(title || onClose) && (
        <HStack justify="space-between" mb={6}>
          {title && <Heading size="lg">{title}</Heading>}
        </HStack>
      )}
      <form onSubmit={handleSubmit}>
        <VStack align="stretch">
          {/* Basic Information */}
          <Box>
            <Heading size="md" mb={4}>
              Basic Information
            </Heading>
            <VStack>
              <label>Name</label>
              <Input
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter name"
              />

              <label>Prime Niche</label>
              <Input
                value={formData.primeNiche || ""}
                onChange={(e) =>
                  handleInputChange("primeNiche", e.target.value)
                }
                placeholder="Enter prime niche"
              />

              <label>Content Keywords</label>
              <Wrap>
                {(formData.contentKeywords || []).map((keyword, index) => (
                  <WrapItem key={index}>
                    <Tag.Root size="md" variant="solid" colorScheme="blue">
                      <Tag.Label>{keyword}</Tag.Label>
                      <Tag.CloseTrigger
                        onClick={() => {
                          const keywords =
                            formData.contentKeywords?.filter(
                              (_, i) => i !== index,
                            ) || [];
                          handleArrayChange("contentKeywords", keywords);
                        }}
                      />
                    </Tag.Root>
                  </WrapItem>
                ))}
              </Wrap>
              <Input
                placeholder="Add keyword and press Enter"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const value = (e.target as HTMLInputElement).value.trim();
                    if (value) {
                      const keywords = [
                        ...(formData.contentKeywords || []),
                        value,
                      ];
                      handleArrayChange("contentKeywords", keywords);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }}
              />

              <label>Audience City Tier</label>
              <Wrap>
                {(formData.audienceCityTier || []).map((tier, index) => (
                  <WrapItem key={index}>
                    <Tag.Root size="md" variant="solid" colorScheme="green">
                      <Tag.Label>{tier}</Tag.Label>
                      <Tag.CloseTrigger
                        onClick={() => {
                          const tiers =
                            formData.audienceCityTier?.filter(
                              (_, i) => i !== index,
                            ) || [];
                          handleArrayChange("audienceCityTier", tiers);
                        }}
                      />
                    </Tag.Root>
                  </WrapItem>
                ))}
              </Wrap>
              <Input
                placeholder="Add city tier and press Enter"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const value = (e.target as HTMLInputElement).value.trim();
                    if (value) {
                      const tiers = [
                        ...(formData.audienceCityTier || []),
                        value,
                      ];
                      handleArrayChange("audienceCityTier", tiers);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }}
              />

              <label>Content Rating</label>
              <select
                value={formData.contentRating || ""}
                onChange={(e) =>
                  handleInputChange(
                    "contentRating",
                    parseInt(e.target.value) || null,
                  )
                }
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>

              <label>Gender</label>
              <select
                value={formData.Gender || ""}
                onChange={(e) =>
                  handleInputChange("Gender", e.target.value || null)
                }
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <label>Onboard Date</label>
              <Input
                type="date"
                value={formData.onboardDate || ""}
                onChange={(e) =>
                  handleInputChange("onboardDate", e.target.value)
                }
              />

              <label>Age</label>
              <NumberInput.Root
                value={formData.age?.toString() || ""}
                onValueChange={(details) =>
                  handleInputChange("age", parseInt(details.value) || null)
                }
                min={0}
                max={120}
              >
                <NumberInput.Input placeholder="Enter age" />
                <NumberInput.Control>
                  <NumberInput.IncrementTrigger />
                  <NumberInput.DecrementTrigger />
                </NumberInput.Control>
              </NumberInput.Root>
            </VStack>
          </Box>

          {/* Contact Information */}
          <Box>
            <Heading size="md" mb={4}>
              Contact Information
            </Heading>
            {(formData.contact || []).map((contact, index) => (
              <Box
                key={index}
                p={4}
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
                mb={4}
              >
                <HStack justify="space-between" mb={4}>
                  <Heading size="sm">Contact {index + 1}</Heading>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => removeContact(index)}
                  >
                    Remove
                  </Button>
                </HStack>
                <VStack>
                  <label>Type</label>
                  <select
                    value={contact.type}
                    onChange={(e) =>
                      handleContactChange(index, "type", e.target.value)
                    }
                  >
                    <option value="self">Self</option>
                    <option value="manager">Manager</option>
                    <option value="agency">Agency</option>
                  </select>

                  <label>Email</label>
                  <Input
                    type="email"
                    value={contact.email || ""}
                    onChange={(e) =>
                      handleContactChange(index, "email", e.target.value)
                    }
                    placeholder="Enter email"
                  />

                  <label>Phone</label>
                  <Input
                    value={contact.phone || ""}
                    onChange={(e) =>
                      handleContactChange(index, "phone", e.target.value)
                    }
                    placeholder="Enter phone"
                  />
                </VStack>
              </Box>
            ))}
            <Button onClick={addContact} colorScheme="blue">
              Add Contact
            </Button>
          </Box>

          {/* Address Information */}
          <Box>
            <Heading size="md" mb={4}>
              Address Information
            </Heading>
            {(formData.address || []).map((address, index) => (
              <Box
                key={index}
                p={4}
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
                mb={4}
              >
                <HStack justify="space-between" mb={4}>
                  <Heading size="sm">Address {index + 1}</Heading>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => removeAddress(index)}
                  >
                    Remove
                  </Button>
                </HStack>
                <VStack>
                  <label>City</label>
                  <Input
                    value={address.city || ""}
                    onChange={(e) =>
                      handleAddressChange(index, "city", e.target.value)
                    }
                    placeholder="Enter city"
                  />

                  <label>State</label>
                  <Input
                    value={address.state || ""}
                    onChange={(e) =>
                      handleAddressChange(index, "state", e.target.value)
                    }
                    placeholder="Enter state"
                  />

                  <label>Country</label>
                  <Input
                    value={address.country || ""}
                    onChange={(e) =>
                      handleAddressChange(index, "country", e.target.value)
                    }
                    placeholder="Enter country"
                  />

                  <label>Zip Code</label>
                  <Input
                    value={address.zipCode || ""}
                    onChange={(e) =>
                      handleAddressChange(index, "zipCode", e.target.value)
                    }
                    placeholder="Enter zip code"
                  />

                  <label>Region</label>
                  <select
                    value={address.region}
                    onChange={(e) =>
                      handleAddressChange(index, "region", e.target.value)
                    }
                  >
                    <option value="urban">Urban</option>
                    <option value="rural">Rural</option>
                  </select>
                </VStack>
              </Box>
            ))}
            <Button onClick={addAddress} colorScheme="blue">
              Add Address
            </Button>
          </Box>

          {/* Plan Information */}
          <Box>
            <Heading size="md" mb={4}>
              Plan Information
            </Heading>
            <VStack>
              <label>Pricing</label>
              <select
                value={formData.plan?.pricing || ""}
                onChange={(e) => handlePlanChange("pricing", e.target.value)}
              >
                <option value="lite">Lite</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>

              <label>Renewal Date</label>
              <Input
                type="date"
                value={formData.plan?.renewalDate || ""}
                onChange={(e) =>
                  handlePlanChange("renewalDate", e.target.value)
                }
              />
            </VStack>
          </Box>

          <HStack mt={2}>
            {onClose && (
              <Button variant="outline" flex={1} onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              colorScheme="teal"
              size="lg"
              flex={1}
              w={onClose ? undefined : "full"}
            >
              Save Changes
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
};

export default InfluencerForm;
