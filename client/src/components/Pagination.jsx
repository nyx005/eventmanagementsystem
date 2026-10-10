export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;

  const numbers = Array.from({ length: pages }, (_, i) => i + 1);

  return (
    <nav aria-label="Pages" className="mt-4">
      <ul className="pagination justify-content-center flex-wrap">
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onChange(page - 1)}>Previous</button>
        </li>
        {numbers.map((n) => (
          <li key={n} className={`page-item ${n === page ? "active" : ""}`}>
            <button className="page-link" onClick={() => onChange(n)}>{n}</button>
          </li>
        ))}
        <li className={`page-item ${page === pages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onChange(page + 1)}>Next</button>
        </li>
      </ul>
    </nav>
  );
}