import LeaderboardModal from "./LeaderboardModal.jsx";
import ModalShell from "./ModalShell.jsx";
import OptionsModal from "./OptionsModal.jsx";
import ShopModal from "./ShopModal.jsx";
import StockModal from "./StockModal.jsx";
import SummaryModal from "./SummaryModal.jsx";
import UpgradesModal from "./UpgradesModal.jsx";

export default function GameModals({ g }) {
  if (!g.modal) return null;
  return (
    <ModalShell onClose={g.closeModal}>
      {g.modal === "options" && <OptionsModal g={g} />}
      {g.modal === "shop" && <ShopModal g={g} />}
      {g.modal === "stock" && <StockModal g={g} />}
      {g.modal === "upgrades" && <UpgradesModal g={g} />}
      {g.modal === "summary" && <SummaryModal g={g} />}
      {g.modal === "leaderboard" && <LeaderboardModal player={g.player} />}
    </ModalShell>
  );
}
