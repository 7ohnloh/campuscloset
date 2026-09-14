// Simple tinted garment silhouettes stand in for product photos (see /notes).

type Shape = { d: string; details?: string[] };

const LONG_SLEEVE = "M37 16 L24 20 L15 31 L8 80 L19 82 L27 46 L27 90 L73 90 L73 46 L81 82 L92 80 L85 31 L76 20 L63 16 Q50 24 37 16 Z";
const PANTS = "M28 10 L72 10 L77 94 L56 94 L50 38 L44 94 L23 94 Z";

const SHAPES: Record<string, Shape> = {
  tee: { d: "M36 16 L22 21 L8 36 L19 47 L27 41 L27 88 L73 88 L73 41 L81 47 L92 36 L78 21 L64 16 Q50 29 36 16 Z" },
  shirt: {
    d: "M36 14 L24 19 L15 30 L7 78 L18 80 L27 45 L27 90 L73 90 L73 45 L82 80 L93 78 L85 30 L76 19 L64 14 L50 26 Z",
    details: ["M50 26 L50 90", "M36 14 L44 30 L50 26 L56 30 L64 14"],
  },
  hoodie: {
    d: "M34 20 L23 24 L14 34 L7 80 L18 82 L27 48 L27 90 L73 90 L73 48 L82 82 L93 80 L86 34 L77 24 L66 20 Q66 6 50 6 Q34 6 34 20 Z",
    details: ["M38 22 Q50 34 62 22", "M36 66 L64 66 L60 80 L40 80 Z", "M46 32 L46 42", "M54 32 L54 42"],
  },
  sweater: { d: LONG_SLEEVE, details: ["M27 84 L73 84", "M9 74 L19 76", "M91 74 L81 76"] },
  jacket: { d: LONG_SLEEVE, details: ["M50 22 L50 90", "M34 58 L42 58", "M58 58 L66 58"] },
  blazer: { d: LONG_SLEEVE, details: ["M38 17 L44 40 L50 56", "M62 17 L56 40 L50 56", "M50 56 L50 90"] },
  puffer: { d: LONG_SLEEVE, details: ["M27 40 L73 40", "M27 54 L73 54", "M27 68 L73 68", "M27 82 L73 82", "M50 20 L50 90"] },
  coat: {
    d: "M37 8 L24 12 L15 24 L9 74 L20 76 L27 40 L25 96 L75 96 L73 40 L80 76 L91 74 L85 24 L76 12 L63 8 Q50 16 37 8 Z",
    details: ["M38 9 L50 44 L62 9", "M50 44 L50 96", "M34 60 L42 60", "M58 60 L66 60"],
  },
  jeans: { d: PANTS, details: ["M28 18 L72 18", "M34 18 Q36 28 44 26", "M66 18 Q64 28 56 26", "M50 18 L50 38"] },
  trousers: { d: PANTS, details: ["M28 18 L72 18", "M50 18 L50 38", "M38 24 L37 90", "M62 24 L63 90"] },
  shorts: { d: "M26 20 L74 20 L80 70 L56 72 L50 44 L44 72 L20 70 Z", details: ["M26 28 L74 28"] },
  skirt: { d: "M34 18 L66 18 L82 84 L18 84 Z", details: ["M34 26 L66 26", "M44 26 L36 84", "M50 26 L50 84", "M56 26 L64 84"] },
  dress: {
    d: "M39 8 L43 8 L45 20 Q50 25 55 20 L57 8 L61 8 L63 30 L58 42 L80 94 L20 94 L42 42 L37 30 Z",
    details: ["M42 42 L58 42"],
  },
  sneakers: {
    d: "M10 64 L12 44 Q14 38 22 40 L38 46 Q50 50 60 54 L80 58 Q92 60 92 70 L92 74 L10 74 Z",
    details: ["M10 66 L92 66", "M34 46 L42 54", "M42 48 L50 56"],
  },
  sandals: { d: "M12 72 Q12 60 30 60 L78 60 Q92 60 92 70 L92 76 L12 76 Z", details: ["M36 60 Q46 40 58 60", "M60 60 Q68 44 76 60"] },
  heels: { d: "M12 70 L22 46 Q26 40 32 46 L52 62 L82 62 Q92 64 90 70 L70 70 L66 86 L61 86 L63 70 Z" },
  boots: { d: "M30 10 L54 10 L54 56 L80 62 Q92 64 92 76 L92 82 L30 82 Z", details: ["M30 74 L92 74", "M38 10 L38 50"] },
  "formal shoes": {
    d: "M10 66 Q10 48 26 48 L50 50 Q60 52 70 56 L84 60 Q94 62 92 72 L92 76 L10 76 Z",
    details: ["M10 68 L92 68", "M40 50 L54 58"],
  },
  bag: { d: "M18 40 L82 40 L86 90 L14 90 Z", details: ["M34 40 Q34 14 50 14 Q66 14 66 40", "M18 52 L82 52"] },
  cap: { d: "M18 64 Q18 24 50 24 Q82 24 82 64 Z", details: ["M12 64 L88 64 L88 72 L12 72 Z"] },
  scarf: {
    d: "M32 8 L54 8 L54 64 L62 92 L44 94 L34 66 Z",
    details: ["M54 12 L74 12 L74 46 L54 56", "M46 94 L46 98", "M52 93 L53 98"],
  },
  tie: { d: "M44 8 L56 8 L58 18 L54 22 L64 76 L50 92 L36 76 L46 22 L42 18 Z", details: ["M46 22 L54 22"] },
};

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/** Soft background: the garment colour mixed heavily with warm paper. */
export function tintedBackground(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  const paper = [243, 237, 228];
  const mix = (c: number, p: number) => Math.round(c * 0.16 + p * 0.84);
  return `rgb(${mix(r, paper[0])}, ${mix(g, paper[1])}, ${mix(b, paper[2])})`;
}

export function GarmentArt({
  garment,
  hex,
  label,
  className,
}: {
  garment: string;
  hex: string;
  label: string;
  className?: string;
}) {
  const shape = SHAPES[garment] ?? SHAPES.tee;
  const stroke = luminance(hex) < 0.3 ? "rgba(255,255,255,0.45)" : "rgba(40,30,20,0.35)";
  return (
    <div className={`flex items-center justify-center ${className ?? ""}`} style={{ background: tintedBackground(hex) }}>
      <svg viewBox="0 0 100 100" role="img" aria-label={label} className="h-3/4 w-3/4 drop-shadow-sm">
        <path d={shape.d} fill={hex} stroke={stroke} strokeWidth={1.4} strokeLinejoin="round" />
        {shape.details?.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={stroke} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        ))}
      </svg>
    </div>
  );
}
