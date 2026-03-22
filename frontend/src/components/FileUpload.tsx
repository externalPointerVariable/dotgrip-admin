import React, { useState } from "react";

export const FileUpload: React.FC<{ closeDialog: () => void }> = ({
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
      const response = await fetch("http://localhost:8000/api/influencers/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        body: formData,
      });

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
    <dialog open>
      <h2>Upload Excel File</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileChange}
          disabled={loading}
        />
        {file && <p>Selected: {file.name}</p>}
        <button type="submit" disabled={loading || !file}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </dialog>
  );
};
