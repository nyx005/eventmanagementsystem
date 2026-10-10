import { useState } from "react";
import ImageUpload from "./ImageUpload.jsx";
import { CATEGORIES, EXPERIENCE_LEVELS } from "../constants.js";

const emptyForm = {
  title: "",
  organization: "",
  description: "",
  date: "",
  time: "",
  location: "",
  category: "Other",
  capacity: "",
  whatToBring: "",
  experience: "None",
  image: "",
};

export default function EventForm({ initial, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(
    initial
      ? {
          ...emptyForm,
          title: initial.title,
          organization: initial.organization,
          description: initial.description || "",
          date: initial.date,
          time: initial.time,
          location: initial.location,
          category: initial.category,
          capacity: String(initial.capacity),
          whatToBring: initial.whatToBring || "",
          experience: initial.experience || "None",
          image: initial.image,
        }
      : emptyForm
  );
  const [errors, setErrors] = useState({});

  const setField = (name, value) => setForm({ ...form, [name]: value });
  const handleChange = (e) => setField(e.target.name, e.target.value);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.date) e.date = "Date is required";
    if (!form.time) e.time = "Time is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.organization.trim()) e.organization = "Organization is required";
    if (!form.capacity || Number(form.capacity) < 1)
      e.capacity = "Volunteers needed must be at least 1";
    if (!form.image) e.image = "Image is required";
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSubmit({ ...form, capacity: Number(form.capacity) });
  };

  const err = (name) =>
    errors[name] && <div className="invalid-feedback d-block">{errors[name]}</div>;

  return (
    <form onSubmit={handleSubmit} noValidate className="paw-card p-4">
      <h5 className="fw-bold mb-3">{initial ? "Edit drive" : "Post a new drive"}</h5>

      <div className="mb-3">
        <label className="form-label fw-bold">Title *</label>
        <input
          name="title"
          className={`form-control ${errors.title ? "is-invalid" : ""}`}
          value={form.title}
          onChange={handleChange}
        />
        {err("title")}
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Organization *</label>
        <input
          name="organization"
          className={`form-control ${errors.organization ? "is-invalid" : ""}`}
          value={form.organization}
          onChange={handleChange}
        />
        {err("organization")}
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Description</label>
        <textarea
          name="description"
          rows="3"
          className="form-control"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="row">
        <div className="col-6 mb-3">
          <label className="form-label fw-bold">Date *</label>
          <input
            type="date"
            name="date"
            className={`form-control ${errors.date ? "is-invalid" : ""}`}
            value={form.date}
            onChange={handleChange}
          />
          {err("date")}
        </div>
        <div className="col-6 mb-3">
          <label className="form-label fw-bold">Time *</label>
          <input
            type="time"
            name="time"
            className={`form-control ${errors.time ? "is-invalid" : ""}`}
            value={form.time}
            onChange={handleChange}
          />
          {err("time")}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Location *</label>
        <input
          name="location"
          className={`form-control ${errors.location ? "is-invalid" : ""}`}
          value={form.location}
          onChange={handleChange}
        />
        {err("location")}
      </div>

      <div className="row">
        <div className="col-6 mb-3">
          <label className="form-label fw-bold">Category</label>
          <select
            name="category"
            className="form-select"
            value={form.category}
            onChange={handleChange}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="col-6 mb-3">
          <label className="form-label fw-bold">Volunteers needed *</label>
          <input
            type="number"
            min="1"
            name="capacity"
            className={`form-control ${errors.capacity ? "is-invalid" : ""}`}
            value={form.capacity}
            onChange={handleChange}
          />
          {err("capacity")}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Experience needed</label>
        <select
          name="experience"
          className="form-select"
          value={form.experience}
          onChange={handleChange}
        >
          {EXPERIENCE_LEVELS.map((x) => (
            <option key={x} value={x}>{x}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">What to bring</label>
        <input
          name="whatToBring"
          className="form-control"
          value={form.whatToBring}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Cover photo * (max 1MB)</label>
        <ImageUpload
          value={form.image}
          onChange={(img) => setField("image", img)}
          error={errors.image}
        />
      </div>

      <div className="d-flex gap-2">
        <button className="btn btn-primary flex-grow-1 py-2" disabled={saving}>
          {saving ? "Saving..." : initial ? "Save changes" : "Post drive"}
        </button>
        {initial && (
          <button type="button" className="btn btn-outline-primary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}