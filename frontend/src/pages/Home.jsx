import { useNavigate } from "react-router-dom";
import illustration from "../assets/illustration.png";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-card">

        <div className="hero">
          <div className="hero-left">
            <h1>Bienvenue sur la plateforme de sourcing !</h1>
            <p>
              Centralisez vos demandes de pièces de rechange
              et laissez l’IA identifier les meilleurs fournisseurs.
            </p>

            <div className="hero-actions">
              <button className="btn-primary" onClick={() => navigate("/new-request")} >
                + Nouvelle demande de sourcing
              </button>

              <button className="btn-secondary" onClick={() => navigate("/ContactFournisseurs")}>
                Historique des demandes
              </button>
            </div>
          </div>

          <div className="hero-right">
            <img
              src={illustration}
              alt="Illustration sourcing"
              className="hero-image"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
