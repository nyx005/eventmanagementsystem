import { useEffect, useState } from "react";
import {
  fetchEvents,
  fetchMyRegistrations,
  joinEvent,
  cancelEvent,
  errorMessage,
} from "../api.js";
import { CATEGORIES } from "../constants.js";
import EventGrid from "./EventGrid.jsx";
import Pagination from "./Pagination.jsx";

export default function DriveBrowser({ title, onChange }) {
  const [events, setEvents] = useState([]);
  const [joinedIds, setJoinedIds] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchEvents({
          search: debouncedSearch,
          category,
          page,
          limit: 6,
        });
        if (cancelled) return;
        setEvents(res.data.events);
        setPages(res.data.pages);
        setTotal(res.data.total);
      } catch (err) {
        if (!cancelled) setError(errorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, category, page]);

  useEffect(() => {
    fetchMyRegistrations()
      .then((res) => setJoinedIds(res.data.map((r) => r.event._id)))
      .catch((err) => setError(errorMessage(err)));
  }, []);

  const replaceEvent = (updated) =>
    setEvents((list) => list.map((e) => (e._id === updated._id ? updated : e)));

  const handleJoin = async (id) => {
    setError("");
    setSuccess("");
    setBusyId(id);
    try {
      const res = await joinEvent(id);
      replaceEvent(res.data);
      setJoinedIds((ids) => [...ids, id]);
      setSuccess("You joined the drive. Thank you for helping!");
      if (onChange) onChange();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleCancel = async (id) => {
    setError("");
    setSuccess("");
    setBusyId(id);
    try {
      const res = await cancelEvent(id);
      replaceEvent(res.data);
      setJoinedIds((ids) => ids.filter((x) => x !== id));
      setSuccess("Your spot was cancelled.");
      if (onChange) onChange();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section>
      <h2 className="section-title mb-3">
        {title} <span className="count">({total})</span>
      </h2>

      <div className="row g-3 mb-3">
        <div className="col-12 col-md-8">
          <input
            className="form-control"
            placeholder="Search drives by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-4">
          <select
            className="form-select"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="All">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <p className="text-center py-5">Loading drives...</p>
      ) : (
        <>
          <EventGrid
            events={events}
            joinedIds={joinedIds}
            busyId={busyId}
            onJoin={handleJoin}
            onCancel={handleCancel}
          />
          <Pagination page={page} pages={pages} onChange={setPage} />
        </>
      )}
    </section>
  );
}