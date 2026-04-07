import { LENGTHS } from "../../data/lengths.js";
import { CATS, PM, PROFILES } from "../../data/profiles.js";
import { listPriceRounded } from "../../game/pricing.js";
import { C, CAT_C } from "../../theme/colors.js";
import { tap } from "../../theme/ui.js";
import ProfileIcon from "../ProfileIcon.jsx";

export default function ShopModal({ g }) {
  const { disc, shopCat, setShopCat, shopProf, setShopProf, getPrice, money, bars, maxB, buyBar, rep, isProfileUnlocked } = g;
  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: 3, color: C.gold, marginBottom: 6, textAlign: "center" }}>
        MAGASIN {disc > 0 && <span style={{ fontSize: 12, color: C.purple }}>(-{disc}%)</span>}
      </div>
      <div style={{ fontSize: 11, color: C.dim, textAlign: "center", marginBottom: 8 }}>
        Profilés débloqués avec la réputation ★
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 8, overflowX: "auto" }}>
        {CATS.map((cat) => {
          const hasAny = PROFILES.some((p) => p.cat === cat && isProfileUnlocked(p.id, rep));
          return (
            <button
              key={cat}
              onClick={() => {
                setShopCat(cat);
                const firstOk = PROFILES.find((p) => p.cat === cat && isProfileUnlocked(p.id, rep));
                setShopProf(firstOk?.id || PROFILES.find((p) => p.cat === cat)?.id || shopProf);
              }}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 700,
                whiteSpace: "nowrap",
                background: shopCat === cat ? CAT_C[cat] + "20" : C.card,
                color: shopCat === cat ? CAT_C[cat] : hasAny ? C.dim : C.dim + "88",
                border: "1px solid " + (shopCat === cat ? CAT_C[cat] + "40" : C.border),
                cursor: "pointer",
                minHeight: 38,
                fontFamily: "'Chakra Petch',sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 5,
                opacity: hasAny ? 1 : 0.45,
                ...tap,
              }}
            >
              <ProfileIcon cat={cat} size={20} />
              {cat}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 10, flexWrap: "wrap" }}>
        {PROFILES.filter((p) => p.cat === shopCat).map((p) => {
          const ok = isProfileUnlocked(p.id, rep);
          return (
            <button
              key={p.id}
              onClick={() => ok && setShopProf(p.id)}
              disabled={!ok}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                background: shopProf === p.id ? p.color + "22" : C.card,
                color: ok ? (shopProf === p.id ? p.color : C.dim) : "#3a4a5a",
                border: shopProf === p.id ? "2px solid " + p.color : "1px solid " + C.border,
                cursor: ok ? "pointer" : "not-allowed",
                minHeight: 36,
                fontFamily: "'Fira Code',monospace",
                ...tap,
              }}
            >
              {p.label}
              {!ok && <span style={{ fontSize: 9, marginLeft: 4 }}>★{p.minRep}</span>}
            </button>
          );
        })}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
        {LENGTHS.map((l) => {
          const price = getPrice(shopProf, l.l);
          const full = listPriceRounded(shopProf, l.l);
          const profOk = isProfileUnlocked(shopProf, rep);
          const cant = !profOk || money < price || bars.length >= maxB;
          return (
            <button
              key={l.l}
              onClick={() => buyBar(shopProf, l.l)}
              disabled={cant}
              style={{
                padding: 12,
                borderRadius: 10,
                border: "1px solid " + C.border,
                background: cant ? "rgba(0,0,0,0.3)" : C.card,
                color: cant ? "#2a3a4a" : C.text,
                fontFamily: "'Chakra Petch',sans-serif",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                cursor: cant ? "not-allowed" : "pointer",
                minHeight: 72,
                ...tap,
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Fira Code',monospace" }}>{l.l}mm</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: cant ? "#2a3a4a" : money >= price ? C.green : C.red }}>{price}€</span>
              {disc > 0 && (
                <span style={{ fontSize: 9, color: C.dim, textDecoration: "line-through" }}>{full}€</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
