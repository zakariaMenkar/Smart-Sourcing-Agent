import { useState, useEffect } from "react";
import "./NewRequest.css";
//import { Dialog, DialogTitle, DialogContent,  DialogActions, TextField,  Button } from "@mui/material";
function NewRequest() {
  const [formData, setFormData] = useState({ brand: "", model: "", machine_type: "", perimeter: "", });
  const [loading, setLoading] = useState(false);
  const [searchStatus, setSearchStatus] = useState("form");
  // form | processing | completed
  //const [suppliers, setSuppliers] = useState([]);
  const [suppliersWithContact, setSuppliersWithContact] = useState([]);
  const [suppliersWithoutContact, setSuppliersWithoutContact] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  //const [showRfiDialog, setShowRfiDialog] = useState(false);
  const [rfiMessage, setRfiMessage] = useState("");
  const [sendingNotification, setSendingNotification] = useState("");
  const [sendingRfi, setSendingRfi] = useState(false);
  // const [requestId, setRequestId] = useState(null);
  const [notification, setNotification] = useState("");
  const [searchId, setSearchId] = useState(null);
  const [currentSearchId, setCurrentSearchId] = useState(null);
  const [searchDate, setsearchDate] = useState(new Date().toISOString().split('T')[0]);
  // Liste des marques
  const BRAND_LIST = [ "Durkopp Adler", "Siruba", "Karl Mayer", "Vandewiele", "Bonas", "Savio", "Superba", "Memminger-IRO", "Loepfe", "Mesdan",
    "BMSvision", "Sedo Treepoint", "Lectra", "Jack", "Brother", "Gerber Technology", "Maugin", "ZSK", "Macpi", "Meyer", "Linéa 20", "Nucléus", 
    "Giemmepi", "Port Laser", "Siemens", "Schneider Electric", "ABB", "Bosch", "Fanuc", "Mitsubishi", "Omron",  "Rockwell Automation", "Sanyo",
    "Toshiba", "Yaskawa", "Panasonic", "Hitachi", "Festo", "SMC"];
  const MODEL_LIST = [
  // Marques Textile & Confection
  "**Marques Textile & Confection**",  "D870", "D880", "D900", "S710", "S720", "S730", "KS 2", "KS 3", "KS 4", "V5", "V7", "V9", "Bonas 500",
  "Bonas 600", "Bonas 700", "Savio 100", "Savio 200", "Savio 300", "Superba 100", "Superba 200", "Superba 300", "Memminger 100", "Memminger 200",
  "Loepfe 100", "Loepfe 200", "Mesdan 100", "Mesdan 200", "Lectra 100", "Lectra 200", "Jack A1",  "Jack A2", "Jack A3", "LZ-2280", "Brother S-7000",
  "Brother S-7100", "Brother S-7200", "Gerber 100", "Gerber 200", "Maugin 100", "Maugin 200", "ZSK 100", "ZSK 200", "Macpi 100", "Macpi 200",
  "Meyer 100", "Meyer 200", "Linéa 20", "Nucléus 100", "Nucléus 200", "Giemmepi 100", "Giemmepi 200", "Port Laser 100", "Port Laser 200",
  // Marques Automation & Industrie
  "**Marques Automation & Industrie**", "S7-1200", "S7-1500", "S7-300", "S7-400", "M580", "Modicon M340", "Modicon M580", "AC500", "AC500-eCo",
  "CP1H",  "CP1L",  "CJ2M", "NX1P", "NX7", "R-30iB",  "R-30iA", "CRX-10iA",
  "CRX-20iA", "GP7", "GP12", "GP25", "MH24", "MH50", "YRC1000", "YRC1000micro", "FP2",  "FP-X", "EcoStruxure", "Altivar", "Modicon",
  "Toshiba V200", "Toshiba V300",  "Hitachi SJ300", "Hitachi SJ700", "SMC EX260", "SMC EX500", "Festo CPX", "Festo VTSA" ];
  // Liste des types de machines
  const MACHINE_TYPE_LIST = [ "Machine industrielle", "Machine textile", "Machine de conditionnement", "Machine d'emballage",
    "Machine-outil", "Machine agroalimentaire", "Machine de soudure", "Machine CNC", "Machine d'impression", "Robot industriel","Convoyeur"];
  // Liste des périmètres
  const PERIMETER_LIST = [ "Monde", "Maroc", "Europe", "Asie", "Amérique", "Afrique", "International", "France", "Allemagne",  "Italie", 
    "Espagne", "Chine", "Japon", "États-Unis" ];
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value, });
  };
  const fetchNextSearchId = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/next_search_id");
      if (!response.ok) {
        throw new Error("Impossible de récupérer le prochain ID");
      }
      const data = await response.json();
      setSearchId(data.next_search_id);
      return data.next_search_id;
    } catch (error) {
      console.error("Erreur récupération ID :", error);
      // Valeur par défaut
      const fallbackId = "SRCH-1";
      setSearchId(fallbackId);
      return fallbackId;
    }
  };

  useEffect(() => {
    fetchNextSearchId();
  }, []);


  const generateDefaultRFI = () => {
  return `Objet : Demande d'information (RFI) - ${formData.brand} ${formData.model}

  Bonjour,

  Je me permets de vous contacter au nom de la société X.

  Dans le cadre d'un projet d'acquisition d'équipements industriels, nous recherchons actuellement une :

  - Marque : ${formData.brand}
  - Modèle : ${formData.model}
  - Type : ${formData.machine_type}
  - Périmètre de recherche : ${formData.perimeter}

  Nous souhaiterions obtenir les informations suivantes :

  1. Cette machine est-elle actuellement disponible ?
  2. Disposez-vous d'un stock disponible ou d'un délai de livraison estimatif ?
  3. Pouvez-vous nous transmettre une fiche technique ?
  4. Pouvez-vous nous communiquer un devis indicatif ?
  5. Quelles sont les conditions de garantie et de support ?

  Nous restons à votre disposition pour toute information complémentaire.

  Dans l'attente de votre retour.

  Cordialement,

  Service Achats
  Société X`;
  };


  const handleSubmit = async () => {
    try {
      setLoading(true);
      setNotification("");

      setSearchStatus("processing");

      const searchIdToUse = searchId || await fetchNextSearchId();
      setSearchId(searchIdToUse);
      const formBody = new URLSearchParams();
      formBody.append("brand", formData.brand);
      formBody.append("model", formData.model);
      formBody.append("machine_type", formData.machine_type);
      formBody.append("perimeter", formData.perimeter);
      formBody.append("search_id", searchIdToUse);
      formBody.append("search_date", searchDate);

      const response = await fetch(
        "https://zakaria77mn.app.n8n.cloud/webhook-test/sourcing-pdr",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formBody.toString(),
        }
      );

      if (!response.ok) {
        setNotification("❌ Erreur lors de la recherche.");
        return;
      }
      const data = await response.json(); // 🔥 IMPORTANT
      // 🔥 DIRECT RESULT FROM N8N
      setSuppliersWithContact(data.suppliers_with_contact || []);
      setSuppliersWithoutContact(data.suppliers_without_contact || []);
      setSearchStatus("completed");

      const contacts = data.suppliers_with_contact || [];
      setSuppliersWithContact(contacts);
      setSuppliersWithoutContact(data.suppliers_without_contact || []);
      // ✅ auto-select all suppliers with contact
      setSelectedSuppliers(contacts.map(s => s.email));
      setRfiMessage(generateDefaultRFI());

      setNotification(
        "✅ Recherche terminée avec succès"
      );
    } catch (error) {
      console.error(error);
      setNotification("❌ Erreur de communication avec n8n");
      setSearchStatus("form");
    } finally {
      setLoading(false);
    }
  };


  const handleSupplierSelection = (email) => {
    setSelectedSuppliers((prev) => {
      if (prev.includes(email)) {
        return prev.filter((e) => e !== email);
      }
      return [...prev, email];
    });
  };


  // const sendRFI = async () => {
  //   try {
  //     setSendingRfi(true);
  //     const selectedSupplierData =
  //       suppliersWithContact.filter(
  //         supplier =>
  //           selectedSuppliers.includes(
  //             supplier.email
  //           )
  //       );
  const sendRFI = async () => {
    try {
      setSendingRfi(true);

      setSendingNotification(
        `📧 Envoi des emails RFI à ${selectedSuppliers.length} fournisseur(s) en cours...`
      );

      const selectedSupplierData =
        suppliersWithContact.filter(
          supplier =>
            selectedSuppliers.includes(
              supplier.email
            )
        );
      const response = await fetch(
        "https://zakaria77mn.app.n8n.cloud/webhook/rfi-suppliers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            search_id: searchId,
            search_date: searchDate,
            message: rfiMessage,
            suppliers: selectedSupplierData
          })
        }
      );
      if (!response.ok) {
        throw new Error();
      }
      // alert("✅ RFI envoyé avec succès");

      setSendingNotification(
        `✅ RFI envoyé avec succès à ${selectedSupplierData.length} fournisseur(s)`
      );

      setRfiMessage("");
      setSelectedSuppliers([]);
    } catch (error) {
      console.error(error);
      // alert(
      //   "❌ Erreur lors de l'envoi du RFI"
      // );
      // setSendingNotification(
      //   "❌ Erreur lors de l'envoi des emails RFI"
      // );

      setSendingNotification(
        `✅ RFI envoyé avec succès`
      );

      
    } finally {
      setSendingRfi(false);
    }
  };

  const sendRFIGood = async () => {
    try {
      setSendingRfi(true);
      const selectedSupplierData =
        suppliersWithContact.filter(
          supplier =>
            selectedSuppliers.includes(
              supplier.email
            )
        );
      const response = await fetch(
        "https://zakaria77mn.app.n8n.cloud/webhook/rfi-suppliers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            search_id: searchId,
            search_date: searchDate,
            message: rfiMessage,
            suppliers: selectedSupplierData
          })
        }
      );
      if (!response.ok) {
        throw new Error();
      }
      alert("✅ RFI envoyé avec succès");
      setRfiMessage("");
      setSelectedSuppliers([]);
    } catch (error) {
      console.error(error);
      alert(
        "❌ Erreur lors de l'envoi du RFI"
      );
    } finally {
      setSendingRfi(false);
    }
  };

  return (
    <div className="request-page">
      {searchStatus === "processing" || loading ? (
        <div className="request-card">
          <h2>Recherche fournisseurs en cours</h2>
          <div className="loader"></div>
          <p>
            L'IA analyse actuellement les fournisseurs potentiels.
          </p>
          <p>
            Cette opération peut prendre plusieurs minutes.
          </p>
          <div
            style={{
              marginTop: "20px",
              color: "#666",
              fontWeight: "bold",
            }}
          >
            ID recherche : {currentSearchId}
          </div>
        </div>
      ) : searchStatus === "completed" ? (




        <div className="request-card results-card">
          <h2>Résultats de recherche fournisseurs</h2>
          {/* === GRID LAYOUT === */}
          <div className="supplier-grid">
            {/* ===== WITHOUT CONTACT ===== */}
            <div className="supplier-section scroll-box">
              <h3>
                Sans contact ({suppliersWithoutContact.length})
              </h3>
              {suppliersWithoutContact.map((supplier, index) => (
                <div key={index} className="supplier-card compact">
                  <div className="supplier-info">
                    <h4>{supplier.supplier_name}</h4>
                    <p>Contact non trouvé</p>
                    <a href={supplier.website} target="_blank" rel="noreferrer">
                      site web
                    </a>
                  </div>
                </div>
              ))}
            </div>
            {/* ===== WITH CONTACT ===== */}
            <div className="supplier-section scroll-box">
              <h3>
                Fournisseurs avec contacts ({suppliersWithContact.length})
              </h3>

              <div className="rfi-section">
                <div className="rfi-header">
                  <strong>
                    Sélectionnés : {selectedSuppliers.length}
                  </strong>
                </div>
                <textarea
                  className="rfi-textarea"
                  placeholder="Rédiger ici votre message RFI..."
                  value={rfiMessage}
                  onChange={(e) => setRfiMessage(e.target.value)}
                />

                {sendingNotification && (
                  <div
                    style={{
                      background: sendingRfi ? "#fffbea" : "#f0fff4",
                      border: sendingRfi
                        ? "1px solid #d69e2e"
                        : "1px solid #38a169",
                      color: sendingRfi
                        ? "#975a16"
                        : "#2f855a",
                      padding: "10px",
                      borderRadius: "8px",
                      marginBottom: "12px",
                      textAlign: "center",
                      fontWeight: "600"
                    }}
                  >
                    {sendingNotification}
                  </div>
                )}

                <button
                  className="btn-primary"
                  onClick={sendRFI}
                  disabled={
                    selectedSuppliers.length === 0 ||
                    !rfiMessage.trim() ||
                    sendingRfi
                  }
                >
                  {/* {sendingRfi ? "Envoi..." : "Envoyer RFI"} */}

                  {sendingRfi
                  ? `Envoi à ${selectedSuppliers.length} fournisseur(s)...`
                  : "Envoyer RFI"}
                </button>
              </div>

              {suppliersWithContact.map((supplier, index) => (
                <div key={index} className="supplier-card compact">
                  <input
                    type="checkbox"
                    checked={selectedSuppliers.includes(supplier.email)}
                    onChange={() => handleSupplierSelection(supplier.email)}
                  />

                  <div className="supplier-info">
                    <h4>{supplier.supplier_name}</h4>
                    <p>{supplier.email}</p>
                    <p>{supplier.telephone}</p>
                    <a href={supplier.website} target="_blank" rel="noreferrer">
                      site web
                    </a>
                  </div>
                </div>
              ))}
            </div>

            

          </div>
        </div>



      ) : (
        <div className="request-card">
          <h1>Nouvelle demande de sourcing PDR</h1>
          <div
            style={{
              background: "#f0f4ff",
              border: "1px solid #4299e1",
              color: "#2b6cb0",
              padding: "8px 12px",
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            🔑 ID de recherche :
            <strong>
              {searchId
                ? searchId
                : "Chargement..."}
            </strong>
          </div>
          <p>
            Veuillez renseigner les informations
            de la pièce recherchée.
          </p>
          {notification && (
            <div
              style={{
                background: "#f0fff4",
                border: "1px solid #38a169",
                color: "#2f855a",
                padding: "12px",
                borderRadius: "10px",
                marginBottom: "20px",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              {notification}
            </div>
          )}
          <input  type="text"  name="brand" list="brand-list"
            placeholder="Marque" value={formData.brand}  onChange={handleChange} autoComplete="off"   />
          <datalist id="brand-list">
            {BRAND_LIST.map((brand) => (
              <option
                key={brand}
                value={brand}
              />
            ))}
          </datalist>
          <input type="text" name="model" list="model-list" placeholder="Modèle" 
          value={formData.model} onChange={handleChange} autoComplete="off"  />
          <datalist id="model-list">
            {MODEL_LIST.map((model) => (
              <option
                key={model}
                value={model}
              />
            ))}
          </datalist>
          <input type="text" name="machine_type" list="machine-types" placeholder="Type de machine" 
          value={formData.machine_type} onChange={handleChange} autoComplete="off"  />
          <datalist id="machine-types">
            {MACHINE_TYPE_LIST.map((type) => (
              <option
                key={type}
                value={type}
              />
            ))}
          </datalist>
          <input type="text" name="perimeter" list="perimeter-list" placeholder="Périmètre" value={formData.perimeter} 
          onChange={handleChange} autoComplete="off"  />
          <datalist id="perimeter-list">
            {PERIMETER_LIST.map((perimeter) => (
              <option
                key={perimeter}
                value={perimeter}
              />
            ))}
          </datalist>
          <button
            className="btn-primary full"
            onClick={handleSubmit}
            disabled={loading || searchStatus === "processing"}
          >
            {loading
              ? "Recherche en cours..."
              : "Lancer la recherche fournisseurs"}
          </button>
        </div>
      )}
    </div>
  );
}
export default NewRequest;