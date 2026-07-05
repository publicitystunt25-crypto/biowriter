export default function WritingIllustration() {
  return (
    <svg
      viewBox="0 0 900 700"
      className="pointer-events-none absolute -right-24 -top-10 h-[640px] w-[820px] opacity-[0.16] sm:opacity-[0.22]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="writing-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e879f9" />
          <stop offset="50%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>

      {/* Notebook page */}
      <g transform="rotate(-6 450 350)">
        <rect
          x="180"
          y="90"
          width="520"
          height="620"
          rx="24"
          fill="none"
          stroke="url(#writing-gradient)"
          strokeWidth="3"
        />
        <line x1="180" y1="190" x2="700" y2="190" stroke="url(#writing-gradient)" strokeWidth="1.5" opacity="0.5" />

        {/* Abstract handwriting lines */}
        <path
          d="M220 260 Q 300 240 360 260 T 500 260 T 640 258"
          stroke="url(#writing-gradient)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M220 320 Q 290 300 350 320 T 480 322 T 600 318"
          stroke="url(#writing-gradient)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M220 380 Q 310 360 380 382 T 520 380 T 660 378"
          stroke="url(#writing-gradient)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M220 440 Q 280 424 340 440 T 460 440 T 560 436"
          stroke="url(#writing-gradient)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          opacity="0.4"
        />
      </g>

      {/* Pen */}
      <g transform="rotate(38 560 470)">
        <rect x="540" y="330" width="26" height="230" rx="13" fill="url(#writing-gradient)" opacity="0.9" />
        <path d="M540 330 L566 330 L553 290 Z" fill="url(#writing-gradient)" opacity="0.9" />
      </g>
    </svg>
  );
}
