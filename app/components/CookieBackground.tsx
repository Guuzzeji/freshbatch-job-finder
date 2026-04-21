"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type LayerMotion = {
  x: number;
  y: number;
  rotate: number;
};

type CookieSpec = {
  key: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
  chips: Array<{
    x: number;
    y: number;
    rx: number;
    ry: number;
    rotate: number;
    fill: string;
    opacity: number;
  }>;
};

const cookieLayers: Array<{
  key: string;
  motionScale: number;
  verticalDrift: number;
  cookies: CookieSpec[];
}> = [
  {
    key: "back",
    motionScale: 14,
    verticalDrift: 12,
    cookies: [
      {
        key: "tl",
        x: 120,
        y: 106,
        size: 76,
        rotation: -10,
        opacity: 0.5,
        chips: [
          { x: -16, y: -12, rx: 8, ry: 5, rotate: -24, fill: "#3D1F0A", opacity: 0.78 },
          { x: 20, y: -16, rx: 7, ry: 4, rotate: 22, fill: "#3D1F0A", opacity: 0.74 },
          { x: -12, y: 18, rx: 6, ry: 4, rotate: -6, fill: "#C8720A", opacity: 0.72 },
          { x: 17, y: 14, rx: 5, ry: 3, rotate: 14, fill: "#7A3B10", opacity: 0.62 },
        ],
      },
      {
        key: "tr",
        x: 1098,
        y: 120,
        size: 108,
        rotation: 14,
        opacity: 0.46,
        chips: [
          { x: -18, y: -18, rx: 9, ry: 5, rotate: -12, fill: "#3D1F0A", opacity: 0.75 },
          { x: 24, y: -10, rx: 8, ry: 5, rotate: 18, fill: "#3D1F0A", opacity: 0.7 },
          { x: -8, y: 20, rx: 8, ry: 4, rotate: -18, fill: "#7A3B10", opacity: 0.7 },
          { x: 20, y: 18, rx: 6, ry: 4, rotate: 9, fill: "#C8720A", opacity: 0.72 },
        ],
      },
    ],
  },
  {
    key: "mid",
    motionScale: 24,
    verticalDrift: 18,
    cookies: [
      {
        key: "bl",
        x: 178,
        y: 470,
        size: 96,
        rotation: 9,
        opacity: 0.42,
        chips: [
          { x: -18, y: -10, rx: 8, ry: 4, rotate: -18, fill: "#3D1F0A", opacity: 0.74 },
          { x: 18, y: -12, rx: 7, ry: 4, rotate: 14, fill: "#3D1F0A", opacity: 0.68 },
          { x: -10, y: 20, rx: 8, ry: 4, rotate: 4, fill: "#7A3B10", opacity: 0.64 },
          { x: 20, y: 21, rx: 6, ry: 3, rotate: -8, fill: "#C8720A", opacity: 0.66 },
        ],
      },
      {
        key: "br",
        x: 1028,
        y: 494,
        size: 84,
        rotation: -11,
        opacity: 0.38,
        chips: [
          { x: -13, y: -12, rx: 7, ry: 4, rotate: -16, fill: "#3D1F0A", opacity: 0.7 },
          { x: 16, y: -10, rx: 6, ry: 4, rotate: 14, fill: "#3D1F0A", opacity: 0.65 },
          { x: -8, y: 16, rx: 6, ry: 3, rotate: -5, fill: "#7A3B10", opacity: 0.62 },
          { x: 15, y: 16, rx: 5, ry: 3, rotate: 12, fill: "#C8720A", opacity: 0.66 },
        ],
      },
      {
        key: "top-mid",
        x: 620,
        y: 54,
        size: 64,
        rotation: -5,
        opacity: 0.33,
        chips: [
          { x: -12, y: -10, rx: 5, ry: 3, rotate: -14, fill: "#3D1F0A", opacity: 0.66 },
          { x: 10, y: -12, rx: 4, ry: 3, rotate: 10, fill: "#3D1F0A", opacity: 0.62 },
          { x: -8, y: 12, rx: 5, ry: 3, rotate: -6, fill: "#C8720A", opacity: 0.62 },
        ],
      },
    ],
  },
  {
    key: "front",
    motionScale: 38,
    verticalDrift: 24,
    cookies: [
      {
        key: "bottom-mid",
        x: 330,
        y: 540,
        size: 58,
        rotation: -16,
        opacity: 0.3,
        chips: [
          { x: -8, y: -8, rx: 4, ry: 2.4, rotate: -12, fill: "#3D1F0A", opacity: 0.6 },
          { x: 9, y: -7, rx: 3, ry: 2.2, rotate: 8, fill: "#3D1F0A", opacity: 0.58 },
          { x: -6, y: 10, rx: 4, ry: 2.2, rotate: -4, fill: "#C8720A", opacity: 0.58 },
        ],
      },
      {
        key: "top-right",
        x: 892,
        y: 74,
        size: 50,
        rotation: 18,
        opacity: 0.28,
        chips: [
          { x: -8, y: -6, rx: 3.5, ry: 2.2, rotate: -16, fill: "#3D1F0A", opacity: 0.56 },
          { x: 7, y: -7, rx: 3, ry: 2, rotate: 8, fill: "#3D1F0A", opacity: 0.54 },
          { x: -5, y: 8, rx: 3.5, ry: 2.1, rotate: -8, fill: "#C8720A", opacity: 0.55 },
        ],
      },
    ],
  },
];

const crumbs = [
  { x: 146, y: 204, r: 5, fill: "#7A3B10", opacity: 0.2 },
  { x: 1050, y: 290, r: 4, fill: "#3D1F0A", opacity: 0.18 },
  { x: 270, y: 360, r: 4, fill: "#C8720A", opacity: 0.18 },
  { x: 980, y: 450, r: 5, fill: "#7A3B10", opacity: 0.16 },
  { x: 760, y: 512, r: 4, fill: "#C8720A", opacity: 0.18 },
  { x: 86, y: 332, r: 3, fill: "#C8720A", opacity: 0.18 },
  { x: 1126, y: 418, r: 3, fill: "#3D1F0A", opacity: 0.16 },
  { x: 452, y: 532, r: 3, fill: "#3D1F0A", opacity: 0.16 },
];

function Cookie({
  x,
  y,
  size,
  rotation,
  opacity,
  chips,
}: Omit<CookieSpec, "key">) {
  const innerSize = size * 0.72;
  const ringSize = size * 0.92;

  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotation})`}
      opacity={opacity}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      <ellipse cx="0" cy={size * 0.88} rx={size * 0.74} ry={size * 0.18} fill="#C8720A" opacity="0.12" />
      <circle cx="0" cy="0" r={size} fill="url(#cookieGlow)" opacity="0.22" />
      <circle cx="0" cy="0" r={size} fill="url(#cookieRim)" />
      <circle cx="0" cy="0" r={ringSize} fill="url(#cookieBody)" />
      <circle cx={size * -0.18} cy={size * -0.22} r={size * 0.4} fill="#FFF4DA" opacity="0.24" />
      <path
        d={`M ${size * -0.78} ${size * 0.08} Q 0 ${size * 0.58} ${size * 0.75} ${size * 0.12}`}
        stroke="#A85B11"
        strokeWidth={size * 0.08}
        strokeLinecap="round"
        opacity="0.14"
        fill="none"
      />
      <circle cx={size * 0.2} cy={size * 0.14} r={innerSize * 0.15} fill="#A85B11" opacity="0.12" />
      {chips.map((chip, index) => (
        <ellipse
          key={index}
          cx={chip.x}
          cy={chip.y}
          rx={chip.rx}
          ry={chip.ry}
          fill={chip.fill}
          opacity={chip.opacity}
          transform={`rotate(${chip.rotate} ${chip.x} ${chip.y})`}
        />
      ))}
      <circle cx={size * -0.3} cy={size * 0.04} r={size * 0.07} fill="#3D1F0A" opacity="0.36" />
      <circle cx={size * 0.28} cy={size * -0.08} r={size * 0.05} fill="#F7D08A" opacity="0.18" />
    </g>
  );
}

export default function CookieBackground() {
  const [motion, setMotion] = useState<LayerMotion>({ x: 0, y: 0, rotate: 0 });
  const frameRef = useRef<number | null>(null);
  const targetRef = useRef<LayerMotion>({ x: 0, y: 0, rotate: 0 });
  const currentRef = useRef<LayerMotion>({ x: 0, y: 0, rotate: 0 });

  useEffect(() => {
    const animate = () => {
      const next = {
        x: currentRef.current.x + (targetRef.current.x - currentRef.current.x) * 0.09,
        y: currentRef.current.y + (targetRef.current.y - currentRef.current.y) * 0.09,
        rotate:
          currentRef.current.rotate +
          (targetRef.current.rotate - currentRef.current.rotate) * 0.08,
      };

      currentRef.current = next;
      setMotion(next);
      frameRef.current = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;

      targetRef.current = {
        x: x * 2,
        y: y * 2,
        rotate: x * 7,
      };
    };

    const handlePointerLeave = () => {
      targetRef.current = { x: 0, y: 0, rotate: 0 };
    };

    frameRef.current = window.requestAnimationFrame(animate);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  const layerTransforms = useMemo(
    () =>
      cookieLayers.map((layer) => ({
        key: layer.key,
        transform: `translate(${(motion.x * layer.motionScale).toFixed(2)}px, ${(motion.y * layer.verticalDrift).toFixed(2)}px) rotate(${(motion.rotate * (layer.motionScale / 42)).toFixed(2)}deg)`,
      })),
    [motion],
  );

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      style={{
        background:
          "radial-gradient(circle at 18% 18%, rgba(255,255,255,0.7), transparent 30%), radial-gradient(circle at 82% 22%, rgba(245,166,35,0.14), transparent 24%), linear-gradient(180deg, rgba(253,246,236,0.96) 0%, rgba(248,235,210,0.9) 58%, rgba(253,246,236,1) 100%)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${(motion.x * -10).toFixed(2)}px, ${(motion.y * -8).toFixed(2)}px)`,
        }}
      >
        <div className="absolute left-[-8%] top-[-22%] h-[300px] w-[300px] rounded-full bg-white/35 blur-3xl" />
        <div className="absolute right-[-10%] top-[4%] h-[260px] w-[260px] rounded-full bg-[rgba(200,114,10,0.12)] blur-3xl" />
        <div className="absolute left-[22%] bottom-[-20%] h-[280px] w-[280px] rounded-full bg-[rgba(232,200,138,0.22)] blur-3xl" />
      </div>

      <svg
        className="cookie-canvas absolute inset-0 h-full w-full"
        viewBox="0 0 1200 580"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="cookieBody" cx="36%" cy="28%" r="72%">
            <stop offset="0%" stopColor="#F4D59A" />
            <stop offset="65%" stopColor="#DBA95B" />
            <stop offset="100%" stopColor="#C27A1D" />
          </radialGradient>
          <radialGradient id="cookieRim" cx="50%" cy="50%" r="70%">
            <stop offset="55%" stopColor="#E2B567" stopOpacity="0" />
            <stop offset="100%" stopColor="#8A470C" stopOpacity="0.38" />
          </radialGradient>
          <radialGradient id="cookieGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#FFF3D7" />
            <stop offset="100%" stopColor="#FFF3D7" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="fadeBottom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDF6EC" stopOpacity="0" />
            <stop offset="100%" stopColor="#FDF6EC" stopOpacity="1" />
          </linearGradient>
        </defs>

        <g style={{ transform: layerTransforms[0]?.transform }}>
          <g className="cookie-layer cookie-layer-back">
            {cookieLayers[0].cookies.map((cookie) => (
              <Cookie {...cookie} />
            ))}
          </g>
        </g>

        <g style={{ transform: layerTransforms[1]?.transform }}>
          <g className="cookie-layer cookie-layer-mid">
            {cookieLayers[1].cookies.map((cookie) => (
              <Cookie {...cookie} />
            ))}
          </g>
        </g>

        <g style={{ transform: layerTransforms[2]?.transform }}>
          <g className="cookie-layer cookie-layer-front">
            {cookieLayers[2].cookies.map((cookie) => (
              <Cookie {...cookie} />
            ))}
          </g>
        </g>

        <g
          style={{
            transform: `translate(${(motion.x * 18).toFixed(2)}px, ${(motion.y * 14).toFixed(2)}px)`,
          }}
          opacity="0.95"
        >
          {crumbs.map((crumb, index) => (
            <circle
              key={index}
              cx={crumb.x}
              cy={crumb.y}
              r={crumb.r}
              fill={crumb.fill}
              opacity={crumb.opacity}
            />
          ))}
          <path
            d="M 30 256 Q 46 236 68 258 Q 84 274 104 256"
            stroke="#D4A96A"
            strokeWidth="1.6"
            fill="none"
            opacity="0.24"
            strokeDasharray="4 5"
          />
          <path
            d="M 1092 350 Q 1110 324 1138 346 Q 1160 364 1180 344"
            stroke="#D4A96A"
            strokeWidth="1.5"
            fill="none"
            opacity="0.22"
            strokeDasharray="3 5"
          />
        </g>

        <rect x="0" y="418" width="1200" height="162" fill="url(#fadeBottom)" opacity="0.44" />
      </svg>
    </div>
  );
}
