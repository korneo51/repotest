export const PROFILES = [
  { id: "rond-20", cat: "Tube rond", label: "Ø20", pm: 1.0, color: "#38bdf8", kgm: 0.92 },
  { id: "rond-40", cat: "Tube rond", label: "Ø40", pm: 1.4, color: "#38bdf8", kgm: 2.41 },
  { id: "rond-60", cat: "Tube rond", label: "Ø60", pm: 1.9, color: "#5cc8f8", kgm: 4.37 },
  { id: "rond-80", cat: "Tube rond", label: "Ø80", pm: 2.5, color: "#5cc8f8", kgm: 6.76 },
  { id: "rond-100", cat: "Tube rond", label: "Ø100", pm: 3.2, color: "#7dd8ff", kgm: 9.62 },
  { id: "carre-20", cat: "Tube carré", label: "20×20", pm: 1.1, color: "#a78bfa", kgm: 1.15 },
  { id: "carre-40", cat: "Tube carré", label: "40×40", pm: 1.6, color: "#a78bfa", kgm: 3.04 },
  { id: "carre-60", cat: "Tube carré", label: "60×60", pm: 2.2, color: "#b89eff", kgm: 5.56 },
  { id: "carre-80", cat: "Tube carré", label: "80×80", pm: 2.8, color: "#b89eff", kgm: 8.59 },
  { id: "carre-100", cat: "Tube carré", label: "100×100", pm: 3.5, color: "#c9b0ff", kgm: 12.2 },
  { id: "ipn-80", cat: "IPN", label: "IPN 80", pm: 2.0, color: "#fb7185", kgm: 5.94 },
  { id: "ipn-100", cat: "IPN", label: "IPN 100", pm: 2.6, color: "#fb7185", kgm: 8.1 },
  { id: "ipn-140", cat: "IPN", label: "IPN 140", pm: 3.4, color: "#ff8fa0", kgm: 12.3 },
  { id: "ipn-200", cat: "IPN", label: "IPN 200", pm: 4.5, color: "#ff8fa0", kgm: 21.0 },
  { id: "upn-80", cat: "UPN", label: "UPN 80", pm: 1.8, color: "#f97316", kgm: 8.64 },
  { id: "upn-100", cat: "UPN", label: "UPN 100", pm: 2.3, color: "#f97316", kgm: 10.6 },
  { id: "upn-140", cat: "UPN", label: "UPN 140", pm: 3.0, color: "#ffaa44", kgm: 16.0 },
  { id: "plat-30x4", cat: "Fer plat", label: "30×4", pm: 0.6, color: "#34d399", kgm: 0.94 },
  { id: "plat-40x5", cat: "Fer plat", label: "40×5", pm: 0.8, color: "#34d399", kgm: 1.57 },
  { id: "plat-60x8", cat: "Fer plat", label: "60×8", pm: 1.2, color: "#4ee8aa", kgm: 3.77 },
  { id: "plat-80x10", cat: "Fer plat", label: "80×10", pm: 1.7, color: "#4ee8aa", kgm: 6.28 },
];

export const PM = Object.fromEntries(PROFILES.map((p) => [p.id, p]));
export const CATS = [...new Set(PROFILES.map((p) => p.cat))];
