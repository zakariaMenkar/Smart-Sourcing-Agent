import { useState } from "react";
import "./NewRequest.css";
function NewRequest() {
  const [formData, setFormData] = useState({ brand: "", model: "", machine_type: "", perimeter: "", });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  // Liste des marques
  const BRAND_LIST = [ "Durkopp Adler", "Siruba", "Karl Mayer", "Vandewiele", "Bonas", "Savio", "Superba", "Memminger-IRO", "Loepfe", "Mesdan",
    "BMSvision", "Sedo Treepoint", "Lectra", "Jack", "Brother", "Gerber Technology", "Maugin", "ZSK", "Macpi", "Meyer", "Linéa 20", "Nucléus", 
    "Giemmepi", "Port Laser", "Siemens", "Schneider Electric", "ABB", "Bosch", "Fanuc", "Mitsubishi", "Omron",  "Rockwell Automation", "Sanyo",
    "Toshiba", "Yaskawa", "Panasonic", "Hitachi", "Festo", "SMC"];

  const MODEL_LIST = [
  // Marques Textile & Confection
  "**Marques Textile & Confection**",  "D870", "D880", "D900", "S710", "S720", "S730", "KS 2", "KS 3", "KS 4", "V5", "V7", "V9", "Bonas 500",
  "Bonas 600", "Bonas 700", "Savio 100", "Savio 200", "Savio 300", "Superba 100", "Superba 200", "Superba 300", "Memminger 100", "Memminger 200",
  "Loepfe 100", "Loepfe 200", "Mesdan 100", "Mesdan 200", "Lectra 100", "Lectra 200", "Jack A1",  "Jack A2", "Jack A3", "Brother S-7000",
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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setNotification("");

      const formBody = new URLSearchParams();
      formBody.append("brand", formData.brand);
      formBody.append("model", formData.model);
      formBody.append("machine_type", formData.machine_type);
      formBody.append("perimeter", formData.perimeter);

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

      if (response.ok) {
        setNotification( "✅ Recherche fournisseurs lancée avec succès !" );

        setTimeout(() => { setNotification(""); }, 5000);
      } else {
        setNotification( "❌ Erreur lors du lancement de la recherche." );
      }
    } catch (error) {
      console.error(error);
      setNotification( "❌ Impossible de contacter le workflow n8n." );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="request-page">
      <div className="request-card">
        <h1>Nouvelle demande de sourcing PDR00</h1>
        <p> Veuillez renseigner les informations de la pièce recherchée. </p>

        {/* Notification */}
        {notification && (
          <div style={{ background: "#f0fff4", border: "1px solid #38a169", color: "#2f855a",  padding: "12px", 
              borderRadius: "10px", marginBottom: "20px", textAlign: "center", fontWeight: "600", }} >
            {notification}
          </div>
        )}

        {/* <input type="text" name="brand" placeholder="Marque" value={formData.brand} onChange={handleChange} /> */}
        {/* <input type="text" name="brand" list="brand-list" placeholder="Marque"  value={formData.brand}  
        onChange={handleChange} autoComplete="off"  />
        <datalist id="brand-list">
          <option value="Durkopp Adler" /> <option value="Siruba" /> <option value="Karl Mayer" /> <option value="Vandewiele" />
          <option value="Bonas" /> <option value="Savio" /> <option value="Superba" /> <option value="Memminger-IRO" />
          <option value="Loepfe" /> <option value="Mesdan" /> <option value="BMSvision" /> <option value="Sedo Treepoint" />
          <option value="Lectra" /> <option value="Jack" /> <option value="Brother" /> <option value="Gerber Technology" /> 
          <option value="Maugin" /> <option value="ZSK" /> <option value="Macpi" /> <option value="Meyer" /> <option value="Linéa 20" />
          <option value="Nucléus" /> <option value="Giemmepi" /> <option value="Port Laser" />
          <option value="Siemens" /> <option value="Schneider Electric" /> <option value="ABB" /> <option value="Bosch" />
          <option value="Fanuc" /> <option value="Mitsubishi" /> <option value="Omron" /> <option value="Rockwell Automation" />
          <option value="Sanyo" />  <option value="Toshiba" />
          <option value="Yaskawa" /> <option value="Panasonic" /> <option value="Hitachi" /> <option value="Festo" /> <option value="SMC" />
        </datalist> */}


        <input type="text" name="brand" list="brand-list" placeholder="Marque" value={formData.brand} onChange={handleChange}  
        autoComplete="off"  />
        <datalist id="brand-list">
          {BRAND_LIST.map((brand) => (
            <option key={brand} value={brand} />
          ))}
        </datalist>



        {/* <input type="text" name="model" placeholder="Modèle" value={formData.model} onChange={handleChange} /> */}

        <input  type="text" name="model" list="model-list" placeholder="Modèle"  value={formData.model}  onChange={handleChange}  
        autoComplete="off"  />
        <datalist id="model-list">
          {MODEL_LIST.map((model) => (
            <option key={model} value={model} />
          ))}
        </datalist>

        {/* <select name="machine_type" value={formData.machine_type} onChange={handleChange}  >
          <option value="">Type de machine</option>
          <option value="Machine industrielle"> Machine industrielle </option>
          <option value="Machine textile"> Machine textile </option>
        </select> */}

        {/* <input  type="text"  name="machine_type" list="machine-types" placeholder="Type de machine" value={formData.machine_type} 
          onChange={handleChange}  autoComplete="off" />
        <datalist id="machine-types">
          <option value="Machine industrielle" />
          <option value="Machine textile" />
          <option value="Machine de conditionnement" />
          <option value="Machine d'emballage" />
          <option value="Machine-outil" />
        </datalist> */}

        <input type="text" name="machine_type" list="machine-types" placeholder="Type de machine" value={formData.machine_type} 
         onChange={handleChange}  autoComplete="off" />
        <datalist id="machine-types">
          {MACHINE_TYPE_LIST.map((type) => (
            <option key={type} value={type} />
          ))}
        </datalist>

        {/* <select name="perimeter" value={formData.perimeter} onChange={handleChange} >
          <option value="">Périmètre</option>
          <option value="Maroc">Maroc</option>
          <option value="Europe">Europe</option>
        </select> */}

        {/* <input  type="text"  name="perimeter"  list="perimeter-list"  placeholder="Périmètre" value={formData.perimeter} 
         onChange={handleChange} autoComplete="off"  />
        <datalist id="perimeter-list">
          <option value="Monde" />
          <option value="Maroc" />
          <option value="Europe" />
          <option value="Asie" />
          <option value="Amérique" />
          <option value="Afrique" />
          <option value="International" />
          <option value="France" />
          <option value="Allemagne" />
          <option value="Italie" />
          <option value="Espagne" />
          <option value="Chine" />
          <option value="Japon" />
          <option value="États-Unis" />
        </datalist> */}

        <input  type="text"  name="perimeter"  list="perimeter-list" placeholder="Périmètre" value={formData.perimeter} 
        onChange={handleChange}  autoComplete="off" />
        <datalist id="perimeter-list">
          {PERIMETER_LIST.map((perimeter) => (
            <option key={perimeter} value={perimeter} />
          ))}
        </datalist>


        <button className="btn-primary full" onClick={handleSubmit} disabled={loading} >
          {loading
            ? "Recherche en cours..."
            : "Lancer la recherche fournisseurs"}
        </button>
      </div>
    </div>
  );
}
export default NewRequest;