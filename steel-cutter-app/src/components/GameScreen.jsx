import { C } from "../theme/colors.js";
import ActionBar from "./ActionBar.jsx";
import BarsPanel from "./BarsPanel.jsx";
import FontsLink from "./FontsLink.jsx";
import HudBar from "./HudBar.jsx";
import CuttingMiniGame from "./modals/CuttingMiniGame.jsx";
import GameModals from "./modals/GameModals.jsx";
import OrdersPanel from "./OrdersPanel.jsx";
import ToastAndDragOverlay from "./ToastAndDragOverlay.jsx";

export default function GameScreen({ g }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100dvh",
        background: C.bg,
        fontFamily: "'Chakra Petch',sans-serif",
        color: C.text,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <FontsLink />
      <HudBar
        day={g.day}
        money={g.money}
        rep={g.rep}
        cutsToday={g.cutsToday}
        sawLv={g.sawLv}
        gameVersion={g.gameVersion}
      />
      <ActionBar
        pendingCount={g.pendingOrders.length}
        onIncoming={() => g.setModal("incoming")}
        onShop={() => g.setModal("shop")}
        onStock={() => g.setModal("stock")}
        onUpgrades={() => g.setModal("upgrades")}
        onOptions={() => g.setModal("options")}
        onEndDay={g.endDay}
      />
      <ToastAndDragOverlay
        toast={g.toast}
        isDragging={g.isDragging}
        drag={g.drag}
        dragPos={g.dragPos}
        hasMovedRef={g.hasMoved}
      />
      <OrdersPanel
        activeOrders={g.activeOrders}
        clientH={g.clientH}
        getFulP={g.getFulP}
        getFulD={g.getFulD}
        isReady={g.isReady}
        isPlanned={g.isPlanned}
        isDragging={g.isDragging}
        drag={g.drag}
        handlePD={g.handlePD}
        shipOrder={g.shipOrder}
        now={g.now}
      />
      <BarsPanel
        bars={g.bars}
        maxB={g.maxB}
        barFilter={g.barFilter}
        setBarFilter={g.setBarFilter}
        barSort={g.barSort}
        setBarSort={g.setBarSort}
        grouped={g.grouped}
        collapsed={g.collapsed}
        setCollapsed={g.setCollapsed}
        asgn={g.asgn}
        sw={g.sw}
        sawLv={g.sawLv}
        stoLv={g.stoLv}
        dropTarget={g.dropTarget}
        drag={g.drag}
        dragProfId={g.dragProfId}
        regBar={g.regBar}
        debitBar={g.debitBar}
        scrapBar={g.scrapBar}
        removeAssign={g.removeAssign}
        getScrapVal={g.getScrapVal}
      />
      <GameModals g={g} />
      {g.miniGame && (
        <CuttingMiniGame
          miniGame={g.miniGame}
          sawLv={g.sawLv}
          onComplete={g.executeCut}
        />
      )}
    </div>
  );
}
