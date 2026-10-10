import { FaMapMarkerAlt, FaMedal, FaShoppingBag } from "react-icons/fa";

const formatWhen = (date, time) => {
  const [y, m, d] = date.split("-").map(Number);
  const [h, min] = time.split(":").map(Number);
  const dt = new Date(y, m - 1, d, h, min);
  const day = dt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const hour = dt.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${day} · ${hour}`;
};

export default function EventCard({ event, joined, busy, onJoin, onCancel }) {
  const needed = event.capacity - event.registered;
  const full = needed <= 0;

  return (
    <div className="paw-card h-100 d-flex flex-column">
      <div className="cover-wrap">
        <img className="cover-img" src={event.image} alt={event.title} />
        <span className="cat-pill">{event.category}</span>
      </div>

      <div className="p-3 d-flex flex-column flex-grow-1">
        <div className="when mb-1">{formatWhen(event.date, event.time)}</div>
        <h5 className="fw-bold mb-1">{event.title}</h5>
        <p className="meta mb-1">{event.organization}</p>
        <p className="meta small mb-1">
          <FaMapMarkerAlt className="me-2" />
          {event.location}
        </p>
        <p className="meta small mb-1">
          <FaMedal className="me-2" />
          Experience: {event.experience}
        </p>
        {event.whatToBring && (
          <p className="meta small mb-1">
            <FaShoppingBag className="me-2" />
            Bring: {event.whatToBring}
          </p>
        )}
        {event.description && <p className="meta mt-2 mb-2">{event.description}</p>}

        <div className="mt-auto pt-2">
          <p className={`needed mb-2 ${full ? "full" : ""}`}>
            {full
              ? "Drive full"
              : `${needed} of ${event.capacity} volunteers still needed`}
          </p>

          {joined ? (
            <button
              className="btn btn-outline-primary w-100 py-2"
              disabled={busy}
              onClick={() => onCancel(event._id)}
            >
              {busy ? "Please wait..." : "Cancel my slot"}
            </button>
          ) : full ? (
            <button className="btn btn-full w-100 py-2" disabled>
              Full
            </button>
          ) : (
            <button
              className="btn btn-primary w-100 py-2"
              disabled={busy}
              onClick={() => onJoin(event._id)}
            >
              {busy ? "Please wait..." : "Join this drive"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}