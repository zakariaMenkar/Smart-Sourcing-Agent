import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import NewRequest from "./pages/NewRequest";
import ContactFournisseurs from "./pages/ContactFournisseurs";
import NoContactFournisseurs from "./pages/NoContactFournisseurs";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-request" element={<NewRequest />} />
        <Route path="/ContactFournisseurs" element={<ContactFournisseurs />} />
        <Route path="/no_contact_fournisseurs" element={<NoContactFournisseurs />} />
      </Routes>
    </BrowserRouter>
  );
  }

export default App;
