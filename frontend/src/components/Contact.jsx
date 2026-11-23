import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "/api";

export default function Contact({ profile }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  function validate() {
    const next = {};
    if (form.name.trim().length < 2) {
      next.name = "Ingresa tu nombre (mínimo 2 caracteres).";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      next.email = "Ingresa un correo electrónico válido.";
    }
    if (form.message.trim().length < 10) {
      next.message = "El mensaje debe tener al menos 10 caracteres.";
    }
    return next;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus(null);
      return;
    }

    setStatus({ type: "loading", text: "Enviando..." });

    try {
      const res = await fetch(`${API}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (res.ok) {
        setStatus({
          type: "success",
          text: "¡Gracias! Tu mensaje fue enviado correctamente."
        });
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus({
          type: "error",
          text: (data.errors || ["Error al enviar el mensaje."]).join(" ")
        });
      }
    } catch {
      setStatus({
        type: "error",
        text: "No se pudo conectar con el servidor. Intenta de nuevo."
      });
    }
  }

  const whatsappLink = `https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`;

  return (
    <section id="contacto" className="section">
      <header className="section__head">
        <span className="section__num">04</span>
        <h2 className="section__title">Contacto</h2>
      </header>

      <div className="contact">
        <div className="contact__info">
          <p className="contact__quote">
            ¿Tienes un proyecto o idea? <em>¡Escríbeme!</em>
          </p>

          <ul className="contact__channels">
            <li>
              <span className="contact__label">Email</span>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </li>
            <li>
              <span className="contact__label">WhatsApp</span>
              <a href={whatsappLink} target="_blank" rel="noreferrer">
                {profile.whatsapp}
              </a>
            </li>
            <li>
              <span className="contact__label">GitHub</span>
              <a href={profile.github} target="_blank" rel="noreferrer">
                {profile.githubUser}
              </a>
            </li>
          </ul>
        </div>

        <form className="contact__form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Nombre</span>
            <input
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Tu nombre"
            />
            {errors.name && <em className="field-error">{errors.name}</em>}
          </label>

          <label className="field">
            <span>Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="tu@email.com"
            />
            {errors.email && <em className="field-error">{errors.email}</em>}
          </label>

          <label className="field">
            <span>Mensaje</span>
            <textarea
              name="message"
              rows="5"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Cuéntame sobre tu proyecto..."
            />
            {errors.message && (
              <em className="field-error">{errors.message}</em>
            )}
          </label>

          <button
            className="btn btn--solid"
            type="submit"
            disabled={status?.type === "loading"}
          >
            {status?.type === "loading" ? "Enviando..." : "Enviar mensaje"}
          </button>

          {status && status.type !== "loading" && (
            <p
              className={`form-status form-status--${status.type}`}
              role="status"
            >
              {status.text}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
