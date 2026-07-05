export default function WritingIllustration() {
  return (
    <svg
      viewBox="0 0 600 600"
      className="pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 opacity-[0.16] sm:opacity-[0.2]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="writing-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e879f9" />
          <stop offset="50%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>

      {/* Handwriting lines on the page */}
      <path d="M150 450 Q220 432 290 450 T 430 448" stroke="url(#writing-gradient)" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M155 492 Q215 476 275 494 T 400 490" stroke="url(#writing-gradient)" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.75" />
      <path d="M160 532 Q205 518 255 532 T 360 528" stroke="url(#writing-gradient)" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.55" />

      {/* Pen shaft, tip touching the top line */}
      <line x1="410" y1="150" x2="205" y2="440" stroke="url(#writing-gradient)" strokeWidth="20" strokeLinecap="round" />
      <path d="M205 440 L 232 418 L 190 470 Z" fill="url(#writing-gradient)" />

      {/* Fist gripping the pen shaft */}
      <rect x="207" y="283" width="140" height="110" rx="45" fill="url(#writing-gradient)" transform="rotate(-55 277 338)" />
      {/* Thumb wrapping over the near side */}
      <rect x="200" y="278" width="82" height="48" rx="24" fill="url(#writing-gradient)" transform="rotate(-80 241 302)" />
    </svg>
  );
}
