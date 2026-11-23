import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { profile } from "./data/portfolio";

export default function App() {
  const [tab, setTab] = useState("inicio");

  return (
    <div className="app">
      <Navbar active={tab} onSelect={setTab} />

      <main className="page" key={tab}>
        {tab === "inicio" && <Hero profile={profile} onNavigate={setTab} />}
        {tab === "sobre-mi" && <About profile={profile} />}
        {tab === "skills" && (
          <Skills skills={profile.skills} note={profile.skillsNote} />
        )}
        {tab === "proyectos" && <Projects projects={profile.projects} />}
        {tab === "contacto" && <Contact profile={profile} />}
      </main>

      <Footer profile={profile} />
    </div>
  );
}
