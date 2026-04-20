import { Button, Icon, FileUpload, Box } from "@chakra-ui/react";
import React, { useState } from "react";
import { LuUpload } from "react-icons/lu";

export const FileUploader: React.FC<{ closeDialog: () => void }> = ({
  closeDialog,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("excelFile", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/influencers/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },

          body: formData,
        },
      );

      if (response.ok) {
        setMessage("File uploaded successfully");
        setFile(null);
      } else {
        setMessage("Upload failed");
      }
    } catch (error) {
      setMessage("Error uploading file");
    } finally {
      setLoading(false);
      closeDialog();
    }
  };

  return (
    <dialog
      open
      style={{
        border: "none",
        borderRadius: "8px",
        padding: "20px",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        margin: 0,
        zIndex: 1000,
      }}
    >
      <form className="upload-form mr-3" onSubmit={handleSubmit}>
        <FileUpload.Root
          onChange={handleFileChange}
          disabled={loading}
          accept={[
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ]}
          maxFiles={1}
          w={"100%"}
        >
          <FileUpload.HiddenInput />
          <FileUpload.Dropzone w={"100%"}>
            <Icon>
              <LuUpload />
            </Icon>
            <FileUpload.DropzoneContent>
              <Box>Drag and Drop Files here.</Box>
              <Box>.xls, .xlsx</Box>
            </FileUpload.DropzoneContent>
          </FileUpload.Dropzone>
          <FileUpload.List />
        </FileUpload.Root>
        <Button
          type="submit"
          disabled={loading || !file}
          _hover={{ bg: "cyan.600", color: "white" }}
        >
          <Icon as={LuUpload} mr={2} />
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </form>
      {message && <p>{message}</p>}
    </dialog>
  );
};
