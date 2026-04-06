import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GAME_VERSION,
  SCRAP_PRICE,
  SCRAP_REMNANT_MULT,
  URGENT_REP_LOSS_ACCEPTED,
  URGENT_REP_LOSS_PENDING,
  WELD_LOSS,
} from "../data/constants.js";
import { LENGTHS } from "../data/lengths.js";
import { PM } from "../data/profiles.js";
import { SAWS } from "../data/saws.js";
import { STOS } from "../data/storage.js";
import { SUP_LV } from "../data/supplier.js";
import { canFitPiece, getUsed, getUsedForAdd } from "./barMath.js";
import { genOrders } from "./genOrders.js";
import { uid } from "./ids.js";
import { isProfileUnlocked } from "./progression.js";

export function useSteelGame() {
  const [scr, setScr] = useState("menu");
  const [day, setDay] = useState(1);
  const [money, setMoney] = useState(800);
  const [rep, setRep] = useState(0);
  const [sawLv, setSawLv] = useState(0);
  const [stoLv, setStoLv] = useState(0);
  const [supLv, setSupLv] = useState(0);
  const [hasWelder, setHasWelder] = useState(false);
  const [orders, setOrders] = useState([]);
  const [bars, setBars] = useState([]);
  const [asgn, setAsgn] = useState({});
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [dayLog, setDayLog] = useState([]);
  const [shopCat, setShopCat] = useState("Tube rond");
  const [shopProf, setShopProf] = useState("rond-20");
  const [clientH, setClientH] = useState({});
  const [cutsToday, setCutsToday] = useState(0);
  const [drag, setDrag] = useState(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dropTarget, setDropTarget] = useState(null);
  const [barSort, setBarSort] = useState("profile");
  const [barFilter, setBarFilter] = useState("all");
  const [collapsed, setCollapsed] = useState({});
  const [weldSel, setWeldSel] = useState([]);
  const [cheatAmt, setCheatAmt] = useState("");
  const [now, setNow] = useState(() => Date.now());

  const barElRefs = useRef({});
  const ordersRef = useRef([]);
  const tRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  ordersRef.current = orders;

  const sw = SAWS[sawLv].w;
  const maxB = STOS[stoLv].m;
  const disc = SUP_LV[supLv].d;
  const activeOrders = orders.filter((o) => o.accepted);
  const pendingOrders = orders.filter((o) => !o.accepted);

  const notify = useCallback((msg, type = "info") => {
    clearTimeout(tRef.current);
    setToast({ msg, type });
    tRef.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const startGame = useCallback(() => {
    setDay(1);
    setMoney(800);
    setRep(0);
    setSawLv(0);
    setStoLv(0);
    setSupLv(0);
    setHasWelder(false);
    setBars([]);
    setAsgn({});
    setDayLog([]);
    setClientH({});
    setCutsToday(0);
    setOrders(genOrders(1, 0, {}));
    setScr("play");
    setModal(null);
    setCollapsed({});
    setWeldSel([]);
  }, []);

  const getFulD = useCallback(
    (order) => {
      const all = Object.values(asgn)
        .flat()
        .filter((a) => a.orderId === order.id && a.debited);
      return order.pieces.map((p, i) => ({
        needed: p.qty,
        done: all.filter((a) => a.pieceIdx === i).length,
      }));
    },
    [asgn],
  );

  const getFulP = useCallback(
    (order) => {
      const all = Object.values(asgn)
        .flat()
        .filter((a) => a.orderId === order.id);
      return order.pieces.map((p, i) => ({
        needed: p.qty,
        done: all.filter((a) => a.pieceIdx === i).length,
      }));
    },
    [asgn],
  );

  const isReady = useCallback((order) => getFulD(order).every((f) => f.done >= f.needed), [getFulD]);
  const isPlanned = useCallback((order) => getFulP(order).every((f) => f.done >= f.needed), [getFulP]);

  const getPrice = useCallback(
    (profId, len) => {
      const prof = PM[profId];
      const base = LENGTHS.find((l) => l.l === len);
      if (!prof || !base) return 999;
      return Math.round(base.bp * prof.pm * (1 - disc / 100));
    },
    [disc],
  );

  const getScrapVal = useCallback((bar) => {
    const prof = PM[bar.profileId];
    if (!prof) return 0;
    const mult = bar.isRemnant ? SCRAP_REMNANT_MULT : 1;
    return Math.round(prof.kgm * (bar.remaining / 1000) * SCRAP_PRICE * mult * 100) / 100;
  }, []);

  const buyBar = useCallback(
    (profId, len) => {
      if (!isProfileUnlocked(profId, rep)) return notify("Profilé verrouillé — gagnez des ★", "error");
      const price = getPrice(profId, len);
      if (money < price) return notify("Pas assez d'argent !", "error");
      if (bars.length >= maxB) return notify("Stockage plein !", "error");
      const b = { id: uid(), remaining: len, originalLength: len, profileId: profId, isRemnant: false };
      setBars((p) => [...p, b]);
      setAsgn((p) => ({ ...p, [b.id]: [] }));
      setMoney((m) => m - price);
      notify(PM[profId].label + " " + len + "mm — " + price + "€");
    },
    [money, bars.length, maxB, rep, getPrice, notify],
  );

  const scrapBar = useCallback(
    (barId) => {
      const bar = bars.find((b) => b.id === barId);
      if (!bar) return;
      if ((asgn[barId] || []).length > 0) return notify("Retirez les pièces !", "error");
      const val = Math.round(getScrapVal(bar));
      setBars((p) => p.filter((b) => b.id !== barId));
      setAsgn((p) => {
        const n = { ...p };
        delete n[barId];
        return n;
      });
      setMoney((m) => m + val);
      notify("♻ Ferraille " + val + "€");
    },
    [bars, asgn, getScrapVal, notify],
  );

  const acceptOrder = useCallback(
    (id) => {
      setOrders((oo) => oo.map((o) => (o.id === id ? { ...o, accepted: true } : o)));
      notify("Acceptée !");
      setModal(null);
    },
    [notify],
  );

  const declineOrder = useCallback(
    (id) => {
      setOrders((oo) => oo.filter((o) => o.id !== id));
      setRep((r) => Math.max(0, r - 1));
      notify("Refusée", "error");
    },
    [notify],
  );

  const doAssign = useCallback(
    (barId, orderId, pieceIdx) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order?.accepted) return false;
      const piece = order.pieces[pieceIdx];
      if (!piece) return false;
      const bar = bars.find((b) => b.id === barId);
      if (!bar) return false;
      if (bar.profileId !== piece.profileId) {
        notify("Profil incompatible !", "error");
        return false;
      }
      const ba = asgn[barId] || [];
      if (!canFitPiece(ba, piece.length, bar.remaining, sw)) {
        notify("Pas assez de place !", "error");
        return false;
      }
      const already = Object.values(asgn)
        .flat()
        .filter((a) => a.orderId === orderId && a.pieceIdx === pieceIdx).length;
      if (already >= piece.qty) {
        notify("Toutes placées !", "error");
        return false;
      }
      setAsgn((p) => ({
        ...p,
        [barId]: [
          ...(p[barId] || []),
          {
            id: uid(),
            orderId,
            pieceIdx,
            length: piece.length,
            color: order.color,
            client: order.client,
            profileId: piece.profileId,
            debited: false,
          },
        ],
      }));
      return true;
    },
    [orders, bars, asgn, sw, notify],
  );

  const removeAssign = useCallback((barId, aId) => {
    setAsgn((p) => {
      const arr = p[barId] || [];
      const a = arr.find((x) => x.id === aId);
      if (a && a.debited) return p;
      return { ...p, [barId]: arr.filter((x) => x.id !== aId) };
    });
  }, []);

  const debitBar = useCallback(
    (barId) => {
      const bar = bars.find((b) => b.id === barId);
      if (!bar) return;
      const ba = asgn[barId] || [];
      const uncut = ba.filter((a) => !a.debited);
      if (uncut.length === 0) return;
      if (cutsToday + uncut.length > SAWS[sawLv].maxCuts) {
        notify("Capacité scie dépassée !", "error");
        return;
      }
      const fee = Math.round(uncut.length * SAWS[sawLv].cutCost);
      setAsgn((p) => ({ ...p, [barId]: ba.map((a) => ({ ...a, debited: true })) }));
      setCutsToday((c) => c + uncut.length);
      if (fee > 0) setMoney((m) => m - fee);
      notify("✂ " + uncut.length + " débitée(s)" + (fee > 0 ? " -" + fee + "€" : ""), "success");
    },
    [bars, asgn, cutsToday, sawLv, notify],
  );

  const shipOrder = useCallback(
    (orderId) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order || !isReady(order)) return;
      const fid = new Set([orderId]);
      const newBars = [];
      const newAsgn = {};
      const seen = new Set();
      bars.forEach((bar) => {
        if (seen.has(bar.id)) return;
        seen.add(bar.id);
        const ba = asgn[bar.id] || [];
        const fulA = ba.filter((a) => fid.has(a.orderId));
        const remA = ba.filter((a) => !fid.has(a.orderId));
        if (fulA.length > 0) {
          const used = getUsed(fulA, bar.remaining, sw);
          const newRem = bar.remaining - used;
          if (remA.length > 0) {
            newBars.push({ ...bar, remaining: newRem, isRemnant: true });
            newAsgn[bar.id] = remA;
          } else if (newRem > sw * 2) {
            newBars.push({ ...bar, remaining: newRem, isRemnant: true });
            newAsgn[bar.id] = [];
          }
        } else {
          newBars.push(bar);
          newAsgn[bar.id] = ba;
        }
      });
      setClientH((prev) => ({ ...prev, [order.client]: (prev[order.client] || 0) + 1 }));
      setMoney((m) => m + order.reward);
      setRep((r) => r + 1);
      setBars(newBars);
      setAsgn(newAsgn);
      setOrders((oo) => oo.filter((o) => o.id !== orderId));
      notify("📦 " + order.client + " +" + order.reward + "€", "success");
    },
    [orders, bars, asgn, sw, isReady, notify],
  );

  const doWeld = useCallback(() => {
    if (weldSel.length !== 2 || !hasWelder) return;
    const [b1, b2] = weldSel.map((id) => bars.find((b) => b.id === id));
    if (!b1 || !b2 || b1.profileId !== b2.profileId) return;
    if ((asgn[b1.id] || []).length > 0 || (asgn[b2.id] || []).length > 0) {
      notify("Videz d'abord !", "error");
      return;
    }
    const newLen = b1.remaining + b2.remaining - WELD_LOSS;
    if (newLen <= 0) {
      notify("Trop court !", "error");
      return;
    }
    const nb = { id: uid(), remaining: newLen, originalLength: newLen, profileId: b1.profileId, isRemnant: true };
    setBars((p) => [...p.filter((b) => b.id !== b1.id && b.id !== b2.id), nb]);
    setAsgn((p) => {
      const n = { ...p };
      delete n[b1.id];
      delete n[b2.id];
      n[nb.id] = [];
      return n;
    });
    setWeldSel([]);
    notify("🔥 Soudure = " + newLen + "mm", "success");
  }, [weldSel, hasWelder, bars, asgn, notify]);

  const endDay = useCallback(() => {
    const log = [];
    const na = { ...asgn };
    let repHit = 0;

    const pendingUrgent = orders.filter((o) => !o.accepted && o.isUrgent);
    if (pendingUrgent.length > 0) {
      repHit += pendingUrgent.length * URGENT_REP_LOSS_PENDING;
      log.push({
        t: "⏱ Urgentes non acceptées (fin de journée) : -" + pendingUrgent.length * URGENT_REP_LOSS_PENDING + "★",
        ty: "warn",
      });
    }

    const maint = SAWS[sawLv].daily + STOS[stoLv].daily;
    if (maint > 0) {
      log.push({ t: "🔧 Maintenance : -" + maint + "€", ty: "warn" });
      setMoney((m) => m - maint);
    }
    const remaining = orders
      .filter((o) => {
        if (!o.accepted) return false;
        if (o.isUrgent) return true;
        if (o.daysLeft <= 1) {
          log.push({ t: "✗ " + o.client + " expirée !", ty: "error" });
          repHit += 3;
          Object.keys(na).forEach((bId) => {
            na[bId] = (na[bId] || []).filter((a) => a.orderId !== o.id);
          });
          return false;
        }
        return true;
      })
      .map((o) => (o.isUrgent ? o : { ...o, daysLeft: o.daysLeft - 1 }));

    if (repHit > 0) setRep((r) => Math.max(0, r - repHit));

    setAsgn(na);
    setCutsToday(0);
    const nd = day + 1;
    setOrders([...remaining, ...genOrders(nd, rep, clientH)]);
    setDay(nd);
    setDayLog(log);
    if (log.length > 0) setModal("summary");
  }, [asgn, orders, sawLv, stoLv, day, rep, clientH]);

  useEffect(() => {
    if (scr !== "play") return;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      const prev = ordersRef.current;
      const expired = prev.filter((o) => o.isUrgent && o.expiresAt != null && t > o.expiresAt);
      if (expired.length === 0) return;
      const idSet = new Set(expired.map((o) => o.id));
      const loss = expired.reduce(
        (s, o) => s + (o.accepted ? URGENT_REP_LOSS_ACCEPTED : URGENT_REP_LOSS_PENDING),
        0,
      );
      setRep((r) => Math.max(0, r - loss));
      setAsgn((na) => {
        const n = { ...na };
        for (const oid of idSet) {
          for (const bId of Object.keys(n)) {
            n[bId] = (n[bId] || []).filter((a) => a.orderId !== oid);
          }
        }
        return n;
      });
      setOrders((o) => o.filter((x) => !idSet.has(x.id)));
      notify(
        expired.length === 1
          ? `⏱ Urgent expirée (-${expired[0].accepted ? URGENT_REP_LOSS_ACCEPTED : URGENT_REP_LOSS_PENDING}★)`
          : `⏱ ${expired.length} urgentes expirées (-${loss}★)`,
        "error",
      );
    }, 1000);
    return () => clearInterval(id);
  }, [scr, notify]);

  const handlePD = useCallback((e, oId, pIdx, piece, oCol) => {
    e.preventDefault();
    const pt = e.touches ? e.touches[0] : e;
    dragStart.current = { x: pt.clientX, y: pt.clientY };
    hasMoved.current = false;
    setDrag({ orderId: oId, pieceIdx: pIdx, piece, orderColor: oCol });
    setDragPos({ x: pt.clientX, y: pt.clientY });
    setIsDragging(true);
    setDropTarget(null);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const onM = (e) => {
      e.preventDefault();
      const pt = e.touches ? e.touches[0] : e;
      if (Math.abs(pt.clientX - dragStart.current.x) > 5 || Math.abs(pt.clientY - dragStart.current.y) > 5)
        hasMoved.current = true;
      setDragPos({ x: pt.clientX, y: pt.clientY });
      let f = null;
      Object.entries(barElRefs.current).forEach(([bid, el]) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (pt.clientX >= r.left && pt.clientX <= r.right && pt.clientY >= r.top && pt.clientY <= r.bottom) f = bid;
      });
      setDropTarget(f);
    };
    const onU = () => {
      if (drag && dropTarget) doAssign(dropTarget, drag.orderId, drag.pieceIdx);
      setIsDragging(false);
      setDrag(null);
      setDropTarget(null);
    };
    document.addEventListener("touchmove", onM, { passive: false });
    document.addEventListener("mousemove", onM);
    document.addEventListener("touchend", onU);
    document.addEventListener("mouseup", onU);
    return () => {
      document.removeEventListener("touchmove", onM);
      document.removeEventListener("mousemove", onM);
      document.removeEventListener("touchend", onU);
      document.removeEventListener("mouseup", onU);
    };
  }, [isDragging, drag, dropTarget, doAssign]);

  const regBar = useCallback((barId, el) => {
    barElRefs.current[barId] = el;
  }, []);

  const dragProfId = drag ? drag.piece.profileId : null;

  const grouped = useMemo(() => {
    let b = [...bars];
    if (barFilter !== "all") b = b.filter((x) => PM[x.profileId]?.cat === barFilter);
    if (barSort === "length") b.sort((a, c) => c.remaining - a.remaining);
    else if (barSort === "diameter") b.sort((a, c) => (PM[a.profileId]?.pm || 0) - (PM[c.profileId]?.pm || 0));
    else
      b.sort((a, c) => {
        const pa = PM[a.profileId],
          pc = PM[c.profileId];
        if (pa?.cat !== pc?.cat) return (pa?.cat || "").localeCompare(pc?.cat || "");
        return (pa?.pm || 0) - (pc?.pm || 0);
      });
    const g = {};
    b.forEach((bar) => {
      const pid = bar.profileId;
      if (!g[pid]) g[pid] = [];
      g[pid].push(bar);
    });
    Object.values(g).forEach((arr) =>
      arr.sort((a, b) => (a.isRemnant === b.isRemnant ? b.remaining - a.remaining : a.isRemnant ? -1 : 1)),
    );
    return g;
  }, [bars, barSort, barFilter]);

  const closeModal = useCallback(() => {
    setModal(null);
    setWeldSel([]);
  }, []);

  return {
    scr,
    gameVersion: GAME_VERSION,
    now,
    isProfileUnlocked,
    day,
    money,
    rep,
    sawLv,
    stoLv,
    supLv,
    hasWelder,
    orders,
    bars,
    asgn,
    toast,
    modal,
    dayLog,
    shopCat,
    shopProf,
    clientH,
    cutsToday,
    drag,
    dragPos,
    isDragging,
    dropTarget,
    barSort,
    barFilter,
    collapsed,
    weldSel,
    setWeldSel,
    cheatAmt,
    setShopCat,
    setShopProf,
    setModal,
    setBarSort,
    setBarFilter,
    setCollapsed,
    setCheatAmt,
    setMoney,
    setHasWelder,
    setSupLv,
    setSawLv,
    setStoLv,
    hasMoved,
    sw,
    maxB,
    disc,
    activeOrders,
    pendingOrders,
    notify,
    startGame,
    getFulD,
    getFulP,
    isReady,
    isPlanned,
    getPrice,
    getScrapVal,
    buyBar,
    scrapBar,
    acceptOrder,
    declineOrder,
    removeAssign,
    debitBar,
    shipOrder,
    doWeld,
    endDay,
    handlePD,
    regBar,
    dragProfId,
    grouped,
    closeModal,
  };
}
