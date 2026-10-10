import { useState } from "react";
import { MAX_IMAGE_BYTES } from "../constants.js";

export default function ImageUpload({ value, onChange, error }) {
  const [fileError, setFileError] = useState("");

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileError("");

    if (!file.type.startsWith("image/")) {
      setFileError("Please choose an image file");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setFileError("Image must be 1MB or smaller");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  const shownError = fileError || error;

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        className={`form-control ${shownError ? "is-invalid" : ""}`}
        onChange={handleFile}
      />
      {shownError && <div className="invalid-feedback d-block">{shownError}</div>}
      {value && <img src={value} alt="Preview" className="preview-img" />}
    </div>
  );
}