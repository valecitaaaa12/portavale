/**
 * Fondo de líneas psicodelicas negras.
 * Curvas fluidas que se dibujan solas (stroke-dashoffset) y respiran suavemente.
 */
export default function PsychedelicLines({ variant = "hero" }) {
  const paths =
    variant === "hero"
      ? [
          "M-40 180 C 160 40, 340 320, 540 180 S 900 40, 1120 200",
          "M-40 260 C 180 120, 360 400, 560 260 S 920 120, 1140 280",
          "M-40 340 C 200 200, 380 480, 580 340 S 940 200, 1160 360",
          "M-40 100 C 140 -20, 320 240, 520 100 S 880 -20, 1100 120",
          "M-40 420 C 220 280, 400 560, 600 420 S 960 280, 1180 440"
        ]
      : [
          "M0 60 C 120 0, 240 120, 360 60 S 600 0, 720 60 S 960 120, 1080 60",
          "M0 120 C 120 60, 240 180, 360 120 S 600 60, 720 120 S 960 180, 1080 120",
          "M0 180 C 120 120, 240 240, 360 180 S 600 120, 720 180 S 960 240, 1080 180"
        ];

  return (
    <svg
      className={`psychedelic psychedelic--${variant}`}
      viewBox="0 0 1120 520"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="#141414" strokeLinecap="round">
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            strokeWidth={i % 2 === 0 ? 1.1 : 0.6}
            opacity={0.1 + i * 0.035}
            style={{ animationDelay: `${i * 0.45}s` }}
            className="psychedelic__path"
          />
        ))}
      </g>
    </svg>
  );
}
