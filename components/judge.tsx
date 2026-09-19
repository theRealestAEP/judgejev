/* oxlint-disable jsx-a11y/prefer-tag-over-role -- Inline SVG needs an image role for its accessible name. */
export function Judge({
  state = 'reading',
}: {
  state?: 'reading' | 'deliberating' | 'verdict';
}) {
  return (
    <svg
      className={`judge-art ${state}`}
      viewBox="0 0 500 495"
      role="img"
      aria-label="Judge Jev, a geometric judge with a circular wig, stern glasses, and a golden gavel"
    >
      <defs>
        <pattern
          id="halftone"
          width="9"
          height="9"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1.2" fill="#21192a" opacity=".14" />
        </pattern>
        <pattern
          id="bench-lines"
          width="40"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path d="M0 10V0" stroke="#21192a" opacity=".15" strokeWidth="2" />
        </pattern>
      </defs>
      <rect width="500" height="495" fill="#a9cbb6" />
      <circle
        cx="250"
        cy="216"
        r="178"
        fill="#dfe7b6"
        stroke="#21192a"
        strokeWidth="2"
      />
      <circle cx="250" cy="216" r="156" fill="url(#halftone)" />
      <g fill="#f9bd4b" stroke="#21192a" strokeWidth="2">
        <path d="m249 21 7 20 20 7-20 7-7 20-7-20-20-7 20-7Z" />
        <path d="m80 239 5 14 14 5-14 5-5 14-5-14-14-5 14-5Z" />
        <path d="m420 169 5 14 14 5-14 5-5 14-5-14-14-5 14-5Z" />
      </g>
      <path
        d="M0 0H90Q92 145 38 203L0 217Z"
        fill="#7c456b"
        stroke="#21192a"
        strokeWidth="3"
      />
      <path
        d="M500 0H410Q408 145 462 203L500 217Z"
        fill="#7c456b"
        stroke="#21192a"
        strokeWidth="3"
      />
      <path
        d="M22 0Q49 109 10 190M52 0Q76 117 31 187M448 0Q424 117 469 187M478 0Q451 109 490 190"
        fill="none"
        stroke="#a26a86"
        strokeWidth="10"
      />
      <path
        d="m0 183 46-9-3 21-43 13Zm500 0-46-9 3 21 43 13Z"
        fill="#fbbd49"
        stroke="#21192a"
        strokeWidth="3"
      />
      <g
        className="judge-breathe"
        stroke="#21192a"
        strokeWidth="3.5"
        strokeLinejoin="round"
      >
        <path
          d="M184 237 147 274 116 352H382L353 275 316 237Z"
          fill="#29243c"
        />
        <path
          d="m183 263-15 87M318 263l15 87"
          fill="none"
          stroke="#564862"
          strokeWidth="12"
        />
        <path d="m219 237 31 48 32-48-5 80h-56Z" fill="#fff3d7" />
        <path d="m250 279-13 36h26Z" fill="#dfd1b4" strokeWidth="2" />
        <rect x="226" y="210" width="49" height="47" rx="12" fill="#e5a16a" />
        <g className="wig-left" fill="#fff0d2">
          <circle cx="180" cy="132" r="26" />
          <circle cx="166" cy="170" r="24" />
          <circle cx="168" cy="209" r="25" />
          <circle cx="186" cy="237" r="23" />
        </g>
        <g className="wig-right" fill="#fff0d2">
          <circle cx="320" cy="132" r="26" />
          <circle cx="334" cy="170" r="24" />
          <circle cx="332" cy="209" r="25" />
          <circle cx="314" cy="237" r="23" />
        </g>
        <rect x="190" y="111" width="120" height="127" rx="43" fill="#f4ba7e" />
        <path
          d="M191 157q2-58 62-59 50 0 57 46l-18-16-30 8-27-8-23 23Z"
          fill="#fff0d2"
        />
        <g fill="#fff0d2">
          <circle cx="204" cy="113" r="22" />
          <circle cx="234" cy="99" r="24" />
          <circle cx="266" cy="99" r="24" />
          <circle cx="296" cy="113" r="22" />
        </g>
        <g className="judge-brows" fill="none" strokeWidth="7">
          <path d="m205 162 30 7M266 169l30-7" />
        </g>
        <g fill="#3b3151">
          <rect x="198" y="174" width="45" height="30" rx="8" />
          <rect x="257" y="174" width="45" height="30" rx="8" />
        </g>
        <path d="M243 183h14M191 180h7M302 180h8" fill="none" />
        <g className="judge-eyes" stroke="#fff0d2" strokeWidth="4">
          <path d="M220 183v10M279 183v10" />
        </g>
        <path d="m250 190-7 20h13" fill="#dd9364" strokeWidth="2" />
        <path
          d="M237 223h26"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect
          x="169"
          y="326"
          width="61"
          height="28"
          rx="13"
          fill="#f4ba7e"
          transform="rotate(-5 200 340)"
        />
        <path d="M190 329v14M201 328v14M212 327v14" strokeWidth="2" />
        <g className="gavel-arm">
          <path d="m333 282 31 22-6 28-39-8" fill="#29243c" />
          <rect
            x="340"
            y="292"
            width="33"
            height="35"
            rx="13"
            fill="#f4ba7e"
            transform="rotate(-30 356 309)"
          />
          <g transform="rotate(29 378 276)">
            <rect
              x="371"
              y="240"
              width="13"
              height="89"
              rx="4"
              fill="#d08c45"
            />
            <rect
              x="344"
              y="216"
              width="67"
              height="32"
              rx="5"
              fill="#fbbd49"
            />
            <path d="M354 217v30M401 217v30" fill="none" />
          </g>
        </g>
      </g>
      <rect
        x="18"
        y="351"
        width="464"
        height="131"
        rx="4"
        fill="#a85c45"
        stroke="#21192a"
        strokeWidth="4"
      />
      <rect x="18" y="351" width="464" height="131" fill="url(#bench-lines)" />
      <rect
        x="7"
        y="344"
        width="486"
        height="24"
        rx="4"
        fill="#d78659"
        stroke="#21192a"
        strokeWidth="4"
      />
      <rect
        x="169"
        y="395"
        width="164"
        height="57"
        rx="4"
        fill="#fbbd49"
        stroke="#21192a"
        strokeWidth="3"
      />
      <circle cx="181" cy="423" r="3" fill="#21192a" />
      <circle cx="321" cy="423" r="3" fill="#21192a" />
      <text
        x="251"
        y="433"
        textAnchor="middle"
        fontFamily="'Bricolage Grotesque', sans-serif"
        fontWeight="800"
        fontSize="33"
        fill="#21192a"
        letterSpacing="5"
      >
        JEV
      </text>
      <g
        className="court-defendant"
        stroke="#21192a"
        strokeWidth="3"
        strokeLinejoin="round"
      >
        <path d="m427 353 39 79h-78Z" fill="#a69bdd" />
        <path d="m428 366 7 21" stroke="#c5baf2" strokeWidth="4" />
        <path d="M416 404v7m18-7v7" strokeWidth="4" strokeLinecap="round" />
        <path d="M421 420h9" />
        <path d="m402 430-4 23m49-23 4 23" />
        <path d="m393 453h10m43 0h10" strokeWidth="5" />
      </g>
      <rect
        x="363"
        y="458"
        width="123"
        height="37"
        fill="#5f476b"
        stroke="#21192a"
        strokeWidth="3"
      />
      <text
        x="426"
        y="482"
        textAnchor="middle"
        fontFamily="'Space Mono', monospace"
        fontSize="13"
        fill="#fff0d2"
      >
        YOU, ALLEGEDLY
      </text>
    </svg>
  );
}
