import React from "react";
import { Link } from "react-router-dom";

/*
  EduBridge owl mascot

  Exports
  - OwlAvatar (named): just the owl. Use it inside the chatbot (message
    avatar, header, typing indicator).
  - OwlMascot (default): floating "Ask a Question" launcher built on OwlAvatar.

  States: idle | listening | thinking | speaking | happy | error | sleeping

  Theme: #CBB1EF (lavender) and #DAF6C0 (mint) are used for the glow,
  bubble and thought cloud. Animations are self-contained (no Tailwind
  config needed) and switch off for prefers-reduced-motion.
*/

export const OWL_STATES = [
  "idle",
  "listening",
  "thinking",
  "speaking",
  "happy",
  "error",
  "sleeping",
];

const DEFAULT_LABELS = {
  idle: "Ask a Question",
  listening: "I'm listening…",
  thinking: "Thinking…",
  speaking: "Answering…",
  happy: "Happy to help!",
  error: "Something went wrong",
  sleeping: "Tap to wake me",
};

const INK = "#2F3B52";
const ACCENT = "#8B6FD0";

const OWL_CSS = `
.owl-root{transform-origin:50% 90%;display:inline-block;line-height:0}
.owl--idle{animation:owl-float 3.2s ease-in-out infinite}
.owl--listening{animation:owl-lean 2.4s ease-in-out infinite}
.owl--thinking{animation:owl-sway 3s ease-in-out infinite}
.owl--speaking{animation:owl-bob .7s ease-in-out infinite}
.owl--happy{animation:owl-hop 1.1s ease-in-out infinite}
.owl--error{animation:owl-shake 1.8s ease-in-out infinite}
.owl--sleeping{animation:owl-breathe 4s ease-in-out infinite}

.owl-wing-l,.owl-wing-r{transform-box:fill-box}
.owl-wing-l{transform-origin:100% 0%}
.owl-wing-r{transform-origin:0% 0%}
.owl--happy .owl-wing-l{animation:owl-flap-l .5s ease-in-out infinite}
.owl--happy .owl-wing-r{animation:owl-flap-r .5s ease-in-out infinite}

.owl-beak{transform-box:fill-box;transform-origin:50% 0%}
.owl--speaking .owl-beak{animation:owl-talk .32s ease-in-out infinite}

.owl-pupil{transform-box:fill-box;transform-origin:center;animation:owl-blink 4.5s infinite}
.owl-look{animation:owl-look 3.2s ease-in-out infinite}
.owl-dot{animation:owl-dot 1.2s ease-in-out infinite}
.owl-wave{animation:owl-wave 1.2s ease-in-out infinite}
.owl-z{animation:owl-z 2.6s ease-in infinite}
.owl-spark{transform-box:fill-box;transform-origin:center;animation:owl-twinkle 1.1s ease-in-out infinite}
.owl-sweat{animation:owl-drip 1.8s ease-in infinite}

@keyframes owl-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes owl-lean{0%,100%{transform:rotate(0)}50%{transform:rotate(4deg)}}
@keyframes owl-sway{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(3deg)}}
@keyframes owl-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes owl-hop{0%,55%,100%{transform:translateY(0)}28%{transform:translateY(-10px)}65%{transform:translateY(-3px)}75%{transform:translateY(0)}}
@keyframes owl-shake{0%,55%,100%{transform:translateX(0)}8%{transform:translateX(-4px)}16%{transform:translateX(4px)}24%{transform:translateX(-3px)}32%{transform:translateX(3px)}40%{transform:translateX(-1px)}}
@keyframes owl-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.035)}}
@keyframes owl-flap-l{0%,100%{transform:rotate(0)}50%{transform:rotate(16deg)}}
@keyframes owl-flap-r{0%,100%{transform:rotate(0)}50%{transform:rotate(-16deg)}}
@keyframes owl-talk{0%,100%{transform:scale(1,1)}50%{transform:scale(.9,1.5)}}
@keyframes owl-blink{0%,92%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
@keyframes owl-look{0%,100%{transform:translate(5px,-6px)}50%{transform:translate(-4px,-6px)}}
@keyframes owl-dot{0%,80%,100%{opacity:.25}40%{opacity:1}}
@keyframes owl-wave{0%,100%{opacity:.15}50%{opacity:1}}
@keyframes owl-z{0%{opacity:0;transform:translate(0,6px)}30%{opacity:1}100%{opacity:0;transform:translate(6px,-10px)}}
@keyframes owl-twinkle{0%,100%{opacity:.4;transform:scale(.6)}50%{opacity:1;transform:scale(1.1)}}
@keyframes owl-drip{0%{opacity:0;transform:translateY(-4px)}25%{opacity:1}100%{opacity:0;transform:translateY(10px)}}

@media (prefers-reduced-motion:reduce){
  .owl-root,.owl-root *{animation:none !important}
}
`;

const Pupil = ({ cx, cy, r }) => (
  <g className="owl-pupil">
    <circle cx={cx} cy={cy} r={r} fill={INK} />
    <circle cx={cx + r * 0.3} cy={cy - r * 0.3} r={Math.max(r * 0.3, 1.2)} fill="#fff" />
  </g>
);

const Sparkle = ({ x, y, delay = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <path
      className="owl-spark"
      d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2Z"
      fill="#F5B82E"
      style={{ animationDelay: `${delay}s` }}
    />
  </g>
);

const renderEyes = (state) => {
  switch (state) {
    case "listening":
      return (
        <>
          <Pupil cx={77} cy={100} r={8} />
          <Pupil cx={123} cy={100} r={8} />
        </>
      );
    case "thinking":
      return (
        <g className="owl-look">
          <Pupil cx={77} cy={98} r={7} />
          <Pupil cx={123} cy={98} r={7} />
        </g>
      );
    case "error":
      return (
        <>
          <Pupil cx={77} cy={101} r={4.5} />
          <Pupil cx={123} cy={101} r={4.5} />
          <path d="M65 78 L89 73" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M111 73 L135 78" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
        </>
      );
    case "sleeping":
      return (
        <>
          <path d="M67 96 Q77 106 87 96" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M113 96 Q123 106 133 96" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </>
      );
    default: // idle, speaking, happy: happy closed eyes from the reference
      return (
        <>
          <path d="M67 100 Q77 88 87 100" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M113 100 Q123 88 133 100" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </>
      );
  }
};

const renderExtras = (state) => {
  switch (state) {
    case "thinking":
      return (
        <g>
          <circle cx="166" cy="62" r="2.5" fill="#DAF6C0" stroke={ACCENT} strokeWidth="1.2" />
          <circle cx="173" cy="50" r="3.6" fill="#DAF6C0" stroke={ACCENT} strokeWidth="1.2" />
          <ellipse cx="186" cy="28" rx="15" ry="12" fill="#DAF6C0" stroke={ACCENT} strokeWidth="1.5" />
          {[0, 0.2, 0.4].map((d, i) => (
            <circle
              key={i}
              className="owl-dot"
              cx={178 + i * 8}
              cy="28"
              r="2.2"
              fill="#5B3FA6"
              style={{ animationDelay: `${d}s` }}
            />
          ))}
        </g>
      );
    case "listening":
      return (
        <g fill="none" stroke={ACCENT} strokeWidth="3" strokeLinecap="round">
          <path className="owl-wave" d="M180 102 Q187 112 180 122" />
          <path
            className="owl-wave"
            d="M188 94 Q199 112 188 130"
            style={{ animationDelay: "0.3s" }}
          />
        </g>
      );
    case "sleeping":
      return (
        <g fill={ACCENT} fontWeight="700" fontFamily="system-ui, sans-serif">
          <g transform="translate(170 46)">
            <text className="owl-z" fontSize="16">Z</text>
          </g>
          <g transform="translate(182 28)">
            <text className="owl-z" fontSize="12" style={{ animationDelay: "0.8s" }}>Z</text>
          </g>
          <g transform="translate(191 14)">
            <text className="owl-z" fontSize="9" style={{ animationDelay: "1.6s" }}>Z</text>
          </g>
        </g>
      );
    case "happy":
      return (
        <>
          <ellipse cx="64" cy="114" rx="7" ry="4.5" fill="#F9A8C0" opacity="0.6" />
          <ellipse cx="136" cy="114" rx="7" ry="4.5" fill="#F9A8C0" opacity="0.6" />
          <Sparkle x={30} y={74} />
          <Sparkle x={176} y={58} delay={0.5} />
        </>
      );
    case "error":
      return (
        <path
          className="owl-sweat"
          d="M52 70 Q45 82 52 87 Q59 82 52 70Z"
          fill="#7CC4F5"
        />
      );
    default:
      return null;
  }
};

/* Just the owl. Use this in the chatbot UI. */
export const OwlAvatar = ({
  state = "idle",
  size = 80,
  glow = false,
  className = "",
}) => {
  const safeState = OWL_STATES.includes(state) ? state : "idle";

  return (
    <span className={`relative inline-block ${className}`}>
      <style>{OWL_CSS}</style>

      {glow && (
        <span
          aria-hidden="true"
          className="absolute inset-x-[8%] top-[22%] bottom-[4%] rounded-full
            bg-gradient-to-br from-[#CBB1EF] to-[#DAF6C0] opacity-70 blur-xl"
        />
      )}

      <span className={`owl-root owl--${safeState} relative`}>
        <svg
          viewBox="0 0 200 210"
          width={size}
          height={size * 1.05}
          role="img"
          aria-label={`EduBridge owl, ${safeState}`}
          style={{ overflow: "visible" }}
        >
          {/* Wings (behind body) */}
          <path
            className="owl-wing-l"
            d="M60 112 Q34 108 28 118 Q26 148 44 166 Q58 160 62 140 Z"
            fill="#4B596F"
          />
          <path
            className="owl-wing-r"
            d="M140 112 Q166 108 172 118 Q174 148 156 166 Q142 160 138 140 Z"
            fill="#4B596F"
          />

          {/* Feet */}
          <ellipse cx="84" cy="193" rx="12" ry="6" fill="#F5A623" />
          <ellipse cx="116" cy="193" rx="12" ry="6" fill="#F5A623" />

          {/* Body */}
          <ellipse cx="100" cy="124" rx="54" ry="68" fill="#5F6E8A" />

          {/* Belly */}
          <ellipse cx="100" cy="152" rx="38" ry="40" fill="#F5F7FB" />
          <path
            d="M85 140 Q92.5 147 100 140 Q107.5 147 115 140"
            stroke="#C3CEE2"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Glasses */}
          <line x1="96" y1="98" x2="104" y2="98" stroke={INK} strokeWidth="4" strokeLinecap="round" />
          <circle cx="77" cy="98" r="19" fill="#FFFFFF" stroke={INK} strokeWidth="5" />
          <circle cx="123" cy="98" r="19" fill="#FFFFFF" stroke={INK} strokeWidth="5" />

          {/* Eyes (depend on state) */}
          {renderEyes(safeState)}

          {/* Beak */}
          <path
            className="owl-beak"
            d="M94 112 L106 112 L100 125 Z"
            fill="#F5A623"
            stroke="#F5A623"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Graduation cap */}
          <g transform="rotate(-5 100 42)">
            <path d="M70 46 L70 62 Q100 76 130 62 L130 46 L100 58 Z" fill="#1B2640" />
            <polygon points="42,40 100,20 158,40 100,60" fill="#26334F" />
            <path
              d="M116 31 Q152 30 160 62"
              stroke="#F5B82E"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* Small gold dot */}
          <circle cx="22" cy="198" r="3.5" fill="#F5B82E" />

          {/* State extras: thought cloud, Zzz, sound waves, sparkles, sweat */}
          {renderExtras(safeState)}
        </svg>
      </span>
    </span>
  );
};

/* Floating launcher: owl + "Ask a Question" bubble. */
const OwlMascot = ({
  to = "/student-dashboard/advisor",
  state = "idle",
  size = 84,
  label,
  showBubble = true,
  floating = true,
  onClick,
  className = "",
}) => {
  const text = label ?? DEFAULT_LABELS[state] ?? DEFAULT_LABELS.idle;

  const base = `${floating ? "fixed bottom-6 right-6 z-[9999] " : ""}flex
    flex-col items-end cursor-pointer select-none no-underline group ${className}`;

  const content = (
    <>
      {showBubble && text && (
        <span
          className="relative mb-1 mr-1 -rotate-3 whitespace-nowrap
            rounded-xl bg-[#CBB1EF] px-3 py-1.5 font-sans text-xs
            font-bold text-[#2E1F4D] shadow-md transition-colors
            duration-300 group-hover:bg-[#DAF6C0]"
        >
          {text}
          <span
            aria-hidden="true"
            className="absolute -bottom-1 left-4 h-2.5 w-2.5 rotate-45
              rounded-[2px] bg-[#CBB1EF] transition-colors duration-300
              group-hover:bg-[#DAF6C0]"
          />
        </span>
      )}

      <span className="transition-transform duration-300 ease-out group-hover:scale-110">
        <OwlAvatar state={state} size={size} glow />
      </span>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className={base}
        aria-label="Chat with EduBridge AI Advisor"
        title={text}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} border-0 bg-transparent p-0`}
      aria-label="Chat with EduBridge AI Advisor"
      title={text}
    >
      {content}
    </button>
  );
};

export default OwlMascot;