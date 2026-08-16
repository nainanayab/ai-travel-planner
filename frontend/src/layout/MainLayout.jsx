import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AIAssistant from "../components/AIAssistant";

function MainLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">

      <Navbar />

      <main className="main-content flex-grow-1">
        <Outlet />
      </main>

      <Footer />

      <AIAssistant />

    </div>
  );
}

export default MainLayout;