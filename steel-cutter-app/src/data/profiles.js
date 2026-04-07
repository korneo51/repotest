/**
 * minDay : jour de jeu (1 = premier jour) à partir duquel le profilé est disponible
 * (achat magasin + commandes clients).
 *
 * Déblocage des familles : Tube rond j1, Tube carré j6 (+5), Fer plat j11 (+10 vs j1),
 * UPN j15 (+5), IPN j18 (+3 pour enchaîner les 4 IPN sans trop tarder).
 * Dans chaque famille : une section de plus par jour (Ø20 j1, Ø40 j2, …).
 */
export const PROFILES = [
  { id: "rond-20", cat: "Tube rond", label: "Ø20", pm: 1.0, color: "#38bdf8", kgm: 0.92, minDay: 1, buyEurKg: 32.61 },
  { id: "rond-40", cat: "Tube rond", label: "Ø40", pm: 1.4, color: "#38bdf8", kgm: 2.41, minDay: 2, buyEurKg: 17.43 },
  { id: "rond-60", cat: "Tube rond", label: "Ø60", pm: 1.9, color: "#5cc8f8", kgm: 4.37, minDay: 3, buyEurKg: 13.04 },
  { id: "rond-80", cat: "Tube rond", label: "Ø80", pm: 2.5, color: "#5cc8f8", kgm: 6.76, minDay: 4, buyEurKg: 11.09 },
  { id: "rond-100", cat: "Tube rond", label: "Ø100", pm: 3.2, color: "#7dd8ff", kgm: 9.62, minDay: 5, buyEurKg: 9.98 },

  { id: "carre-20", cat: "Tube carré", label: "20×20", pm: 1.1, color: "#a78bfa", kgm: 1.15, minDay: 6, buyEurKg: 28.7 },
  { id: "carre-40", cat: "Tube carré", label: "40×40", pm: 1.6, color: "#a78bfa", kgm: 3.04, minDay: 7, buyEurKg: 15.79 },
  { id: "carre-60", cat: "Tube carré", label: "60×60", pm: 2.2, color: "#b89eff", kgm: 5.56, minDay: 8, buyEurKg: 11.87 },
  { id: "carre-80", cat: "Tube carré", label: "80×80", pm: 2.8, color: "#b89eff", kgm: 8.59, minDay: 9, buyEurKg: 9.78 },
  { id: "carre-100", cat: "Tube carré", label: "100×100", pm: 3.5, color: "#c9b0ff", kgm: 12.2, minDay: 10, buyEurKg: 8.61 },

  { id: "plat-30x4", cat: "Fer plat", label: "30×4", pm: 0.6, color: "#34d399", kgm: 0.94, minDay: 11, buyEurKg: 19.15 },
  { id: "plat-40x5", cat: "Fer plat", label: "40×5", pm: 0.8, color: "#34d399", kgm: 1.57, minDay: 12, buyEurKg: 15.29 },
  { id: "plat-60x8", cat: "Fer plat", label: "60×8", pm: 1.2, color: "#4ee8aa", kgm: 3.77, minDay: 13, buyEurKg: 9.55 },
  { id: "plat-80x10", cat: "Fer plat", label: "80×10", pm: 1.7, color: "#4ee8aa", kgm: 6.28, minDay: 14, buyEurKg: 8.12 },

  { id: "upn-80", cat: "UPN", label: "UPN 80", pm: 1.8, color: "#f97316", kgm: 8.64, minDay: 15, buyEurKg: 6.25 },
  { id: "upn-100", cat: "UPN", label: "UPN 100", pm: 2.3, color: "#f97316", kgm: 10.6, minDay: 16, buyEurKg: 6.51 },
  { id: "upn-140", cat: "UPN", label: "UPN 140", pm: 3.0, color: "#ffaa44", kgm: 16.0, minDay: 17, buyEurKg: 5.63 },

  { id: "ipn-80", cat: "IPN", label: "IPN 80", pm: 2.0, color: "#fb7185", kgm: 5.94, minDay: 18, buyEurKg: 10.1 },
  { id: "ipn-100", cat: "IPN", label: "IPN 100", pm: 2.6, color: "#fb7185", kgm: 8.1, minDay: 19, buyEurKg: 9.63 },
  { id: "ipn-140", cat: "IPN", label: "IPN 140", pm: 3.4, color: "#ff8fa0", kgm: 12.3, minDay: 20, buyEurKg: 8.29 },
  { id: "ipn-200", cat: "IPN", label: "IPN 200", pm: 4.5, color: "#ff8fa0", kgm: 21.0, minDay: 21, buyEurKg: 6.43 },
];

export const PM = Object.fromEntries(PROFILES.map((p) => [p.id, p]));
export const CATS = [...new Set(PROFILES.map((p) => p.cat))];
