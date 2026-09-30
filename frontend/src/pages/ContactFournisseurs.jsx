import { useEffect, useState } from "react";
import "./ContactFournisseurs.css";

const PAGE_SIZE = 25;

function ContactFournisseurs() {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("http://localhost:5000/api/contact_fournisseurs")
      .then(res => res.json())
      .then(data => {
        const filtered = Array.isArray(data)
          ? data.filter(f => f?.has_contact === "TRUE")
          : [];
        setFournisseurs(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

//   if (loading) {
//     return <p className="loading">Chargement des fournisseurs...</p>;
//   }

  if (loading) {
    return (
        <div className="loader-container">
        <div className="spinner"></div>
        <p>Chargement des fournisseurs...</p>
        </div>
    );
    }


  //const totalPages = Math.ceil(fournisseurs.length / PAGE_SIZE);
  //const start = (page - 1) * PAGE_SIZE;
  //const currentData = fournisseurs.slice(start, start + PAGE_SIZE);
  const currentData = fournisseurs;

  return (
    <div className="contact-page">
      <h2>Fournisseurs avec contact</h2>

      <div className="table-container">
        <table className="erp-table">
          <thead>
            <tr>
              <th>Fournisseur</th>
              <th>Marque</th>
              <th>Modèle</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Site</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((f, index) => (
              <tr key={index}>
                <td>{f.supplier_name || "-"}</td>
                <td>{f.brand || "-"}</td>
                <td>{f.model || "-"}</td>
                <td>{f.email || "-"}</td>
                <td>{f.telephone || "-"}</td>
                <td>
                  {f.website ? (
                    <a href={f.website} target="_blank" rel="noreferrer">
                      Ouvrir
                    </a>
                  ) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
        >
          ◀
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          ▶
        </button>
      </div>

      <p className="count">
        Total : {fournisseurs.length} fournisseurs
      </p> */}
    </div>
  );
}

export default ContactFournisseurs;