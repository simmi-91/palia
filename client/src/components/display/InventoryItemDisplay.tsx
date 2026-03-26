import React, { useState } from "react";

import missingImg from "../../assets/images/missing.png";
import { selectItemById } from "../../api/items";
import { type TradeDisplayItem } from "../../app/types/userTypes";

export type DisplayStyle = "card" | "compact" | "list";

type InventoryItemDisplayProps = {
    item: TradeDisplayItem;
    opacity?: number;
    offeringUsers: string[] | [];
    showAmount?: boolean;
    alwaysShowUsers?: boolean;
    displayStyle?: DisplayStyle;
    showCategory?: boolean;
};

const InventoryItemDisplay: React.FC<InventoryItemDisplayProps> = ({
    item,
    opacity,
    offeringUsers,
    showAmount = true,
    alwaysShowUsers = false,
    displayStyle = "card",
    showCategory = false,
}) => {
    const [open, setOpen] = useState(false);

    const { data: itemObject, isLoading: isItemLoading } = selectItemById(item.itemId);
    const amount = item.amount - 1;
    if (amount === 0) return;

    const numOpacity = opacity && opacity !== 1 ? opacity : 1;
    const objectName = itemObject?.name || "Unknown Item";
    const imgSrc = itemObject?.image || missingImg;
    const userCount = offeringUsers?.length ?? 0;
    const cardBackground =
        "linear-gradient(180deg,rgba(226, 229, 233, 1) 0%, rgba(226, 229, 233, 0.9) 40%, rgba(59, 59, 59, 0.4) 100%";

    // Always visible on large screens (md+)
    const userNamesLarge = !alwaysShowUsers && userCount > 0 && (
        <div className="d-none d-md-block bg-dark text-light px-1 small rounded text-center mb-1">
            {offeringUsers.join(", ")}
        </div>
    );

    // Badge + offcanvas on small screens
    const countBadge = !alwaysShowUsers && userCount > 0 && (
        <button
            className="d-md-none btn btn-sm btn-dark d-flex align-items-center gap-1 py-0 px-2 mt-1"
            style={{ fontSize: "0.75rem" }}
            onClick={() => setOpen(true)}>
            <i className="bi bi-people-fill" />
            <span>{userCount}</span>
        </button>
    );

    // For alwaysShowUsers (Ready to trade section) — always inline
    const userListInline = alwaysShowUsers && userCount > 0 && (
        <div className="bg-dark text-light px-1 small rounded text-center mb-1">
            {offeringUsers.join(", ")}
        </div>
    );

    const offcanvas = !alwaysShowUsers && open && (
        <>
            <div
                className="offcanvas-backdrop fade show"
                onClick={() => setOpen(false)}
            />
            <div
                className="offcanvas offcanvas-bottom show"
                style={{ height: "auto", maxHeight: "50vh" }}>
                <div className="offcanvas-header pb-2">
                    <h6 className="offcanvas-title mb-0">{objectName}</h6>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setOpen(false)}
                    />
                </div>
                <div className="offcanvas-body pt-0">
                    <p className="text-muted small mb-2">Offered by:</p>
                    {offeringUsers.map((u) => (
                        <div key={u} className="py-1 border-bottom">
                            {u}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );

    if (isItemLoading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: 80 }}>
                <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (displayStyle === "list") {
        return (
            <div style={{ opacity: numOpacity, height: "100%" }}>
                {offcanvas}
                <div
                    className="d-flex align-items-center gap-2 border-bottom py-1 h-100"
                    style={{ background: cardBackground }}>
                    <img
                        src={imgSrc}
                        className="mx-1"
                        style={{
                            height: "28px",
                            width: "28px",
                            objectFit: "contain",
                            flexShrink: 0,
                        }}
                    />
                    <span className="fw-bold">{objectName}</span>
                    {showCategory && (
                        <span className="text-muted small text-capitalize">{item.category}</span>
                    )}
                    {showAmount && <span className="text-muted small">×{amount}</span>}
                    {alwaysShowUsers && userCount > 0 && (
                        <span className="text-muted small ms-auto mx-1">{offeringUsers.join(", ")}</span>
                    )}
                    {userCount > 0 && !alwaysShowUsers && (
                        <>
                            <span className="d-none d-md-inline text-muted small ms-auto mx-1">
                                {offeringUsers.join(", ")}
                            </span>
                            <div className="d-md-none ms-auto mx-1">
                                {countBadge}
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }

    if (displayStyle === "compact") {
        return (
            <div style={{ opacity: numOpacity }}>
                {offcanvas}
                <div
                    className="d-flex flex-row align-items-center gap-2 rounded border border-dark h-100 p-1"
                    style={{ background: cardBackground }}>
                    <img
                        src={imgSrc}
                        style={{
                            height: "60px",
                            width: "60px",
                            objectFit: "contain",
                            flexShrink: 0,
                        }}
                    />
                    <div className="d-flex flex-column overflow-hidden flex-fill">
                        <b className="text-truncate">{objectName}</b>
                        {showCategory && (
                            <span className="small text-muted text-capitalize">
                                {item.category}
                            </span>
                        )}
                        {showAmount && (
                            <span className="small text-muted">For trade: {amount}</span>
                        )}
                        {userListInline}
                        {userNamesLarge}
                        {countBadge}
                    </div>
                </div>
            </div>
        );
    }

    // card (default)
    return (
        <div style={{ opacity: numOpacity }}>
            {offcanvas}
            <div
                className="rounded border border-dark d-flex justify-content-center h-100"
                style={{ background: cardBackground }}>
                <div className="d-flex flex-column px-1">
                    <div>
                        <b>{objectName}</b>
                        {showCategory && (
                            <div className="small text-muted text-capitalize">{item.category}</div>
                        )}
                    </div>
                    <div className="flex-fill">
                        <img src={imgSrc} style={{ maxHeight: "100px", maxWidth: "100%" }} />
                    </div>
                    {showAmount && <div>For trade: {amount}</div>}
                    {userListInline}
                    {userNamesLarge}
                    {countBadge}
                </div>
            </div>
        </div>
    );
};

export default InventoryItemDisplay;
