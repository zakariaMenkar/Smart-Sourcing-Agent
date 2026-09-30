import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import logo_app from "../assets/logo_app.png";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <img src={logo_app} alt="Smart Sourcing Agent" className="logo_app" width="42" height="auto"/>
        <span className="brand-name">Smart Sourcing Agent </span>
      </div>

      <nav className="nav">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
          end
        >
          Accueil
        </NavLink>

        <NavLink
          to="/new-request"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Nouvelle demande
        </NavLink>

        <NavLink
          to="/ContactFournisseurs"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Contact Fournisseurs
        </NavLink>

        <NavLink
          to="/no_contact_fournisseurs"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Fournisseurs sans contact
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;



// import { Link } from "react-router-dom";
// import logo from "../assets/logo.png";
// import "./Header.css";

// function Header() {
//   return (
//     <header className="header">
//       <div className="header-left">
//         <img src={logo} alt="Maroc Modis" className="logo" />
//         <span className="brand-name">Maroc-Modis</span>
//       </div>

//       <nav className="nav">
//         <Link to="/" className="active">Accueil</Link>
//         <Link to="/new-request">Nouvelle demande</Link>
//         <Link to="/ContactFournisseurs">Contact Fournisseurs</Link>
//         <Link to="/no_contact_fournisseurs">Fournisseurs sans contact</Link>
//       </nav>
//     </header>
//   );
// }

// export default Header;
