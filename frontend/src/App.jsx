import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Actors from "./pages/Actors";
import ActorForm from "./pages/ActorForm";
import RunStatus from "./pages/RunStatus";
import { ApiContextProvider } from "./context/ApiContext";
import Navigation from "./components/Navigation";

export default function App() {
  return (
    <ApiContextProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/actors" element={<Actors />} />
            <Route path="/actors/:id" element={<ActorForm />} />
            <Route path="/runs/:runId" element={<RunStatus />} />
          </Routes>
        </div>
      </div>
    </ApiContextProvider>
  );
}
