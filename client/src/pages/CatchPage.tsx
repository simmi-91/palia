import { useState, useEffect } from "react";
import type { GoogleProfile } from "../app/types/userTypes";
import {
  LoadingState,
  ErrorState,
  EmptyCategoryState,
} from "../components/CommonStates";

import {
  clockColorMap,
  getCurrentPhase,
  getNextPhase,
  getLaterPhases,
} from "../utils/clockPhases";
import PhaseCountdown from "../components/display/PhaseCountdown";

import RarityTag from "../components/display/RarityTag";

import { type UseQueryResult } from "@tanstack/react-query";
import type { FavoriteItem } from "../app/types/userTypes";
import type { CatchableEntry, MultilistEntry } from "../app/types/wikiTypes";
import { selectAllBugs } from "../features/slices/BugsSlice";
import { selectAllFish } from "../features/slices/FishSlice";
import { selectAllFavorites } from "../features/slices/FavoritesSlice";
import { useRemoveFavorite } from "../hooks/useFavoriteMutations";

type ItemSelector = () => UseQueryResult<CatchableEntry[] | undefined, Error>;
const selectorMap: { [key: string]: ItemSelector } = {
  bugs: selectAllBugs,
  fish: selectAllFish,
};

type fullFavoriteEntry = CatchableEntry & FavoriteItem;

const itemTimeIncludesPhase = (itemTime: string, phase: string): boolean => {
  if (!itemTime || itemTime.toLowerCase().includes("any time")) {
    return true;
  }
  return itemTime.toLowerCase().includes(phase.toLowerCase());
};

const CatchPage = ({ profile }: { profile: GoogleProfile }) => {
  const profileId = profile ? profile.id : "";

  const computeVirtualHours = (): number => {
    const now = new Date();
    const startOfHour = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours()
    );
    const millisecondsPassed = now.getTime() - startOfHour.getTime();
    return (millisecondsPassed / 3600000) * 24;
  };

  const initialPhaseText = getCurrentPhase(computeVirtualHours()).text;
  const [currentPhaseText, setCurrentPhaseText] = useState(initialPhaseText);
  const nextPhase = getNextPhase(currentPhaseText);
  const laterPhases = getLaterPhases(currentPhaseText, nextPhase);

  const { remove: removeFavoriteMutate, isPending: removingId } =
    useRemoveFavorite(profileId);

  const categoryData = Object.entries(selectorMap).map(
    ([category, selector]) => {
      const { data, isLoading, isError } = selector();
      return {
        category,
        data,
        isLoading,
        isError,
      };
    }
  );

  const {
    data: favoritesData,
    isLoading: favLoad,
    isError: favIsErr,
    error: favErr,
  } = selectAllFavorites(profileId);

  useEffect(() => {
    const tick = () => {
      const vh = computeVirtualHours();
      const newPhaseText = getCurrentPhase(vh).text;
      setCurrentPhaseText((prev) =>
        prev === newPhaseText ? prev : newPhaseText
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!profile) return;

  if (favLoad) {
    return <LoadingState color="dark" />;
  }
  if (favIsErr) {
    return <ErrorState error={favErr} />;
  }
  if (!favoritesData || !categoryData) {
    return <EmptyCategoryState />;
  }

  const fullFavoriteItems: fullFavoriteEntry[] = categoryData
    .filter(
      (categoryInfo) =>
        !categoryInfo.isLoading && !categoryInfo.isError && categoryInfo.data
    )
    .sort((a, b) => a.category.localeCompare(b.category))
    .flatMap((categoryInfo) => {
      const categoryFavorites = favoritesData.filter(
        (fav) => fav.category === categoryInfo.category
      );
      return categoryFavorites.flatMap((favorite) => {
        const itemData = categoryInfo.data?.find(
          (item) => item.id === favorite.itemId
        );
        return itemData
          ? [
              {
                ...itemData,
                favoriteId: favorite.favoriteId,
                category: categoryInfo.category,
              } as fullFavoriteEntry,
            ]
          : [];
      });
    });

  const nowItems = fullFavoriteItems.filter((item) => {
    if (!item) return false;
    if (item.time.toLowerCase().includes("any time")) return true;
    return itemTimeIncludesPhase(item.time, currentPhaseText);
  });

  const nextItems = fullFavoriteItems.filter((item) => {
    if (!item) return false;
    if (item.time.toLowerCase().includes("any time")) return false;
    return itemTimeIncludesPhase(item.time, nextPhase);
  });

  const laterItems = fullFavoriteItems.filter((item) => {
    if (!item) return false;
    if (item.time.toLowerCase().includes("any time")) return false;
    return laterPhases.some((phase) => itemTimeIncludesPhase(item.time, phase));
  });

  const handleFavorite = (favoriteId: number, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from favorites?`))
      return;
    removeFavoriteMutate({ favoriteId });
  };

  const generateInfotext = (item: fullFavoriteEntry) => {
    let infoText = [];
    infoText.push(item.time.replace(/\s*\([^)]*\)\s*$/, ""));

    if ("bait" in item && Array.isArray(item.bait) && item.bait.length > 0) {
      infoText.push(item.bait.map((b: MultilistEntry) => b.title).join(", "));
    }

    if (Array.isArray(item.location) && item.location.length > 0) {
      infoText.push(
        item.location.map((loc: MultilistEntry) => loc.title).join(", ")
      );
    }

    return infoText;
  };

  const renderItemBlock = (
    items: fullFavoriteEntry[],
    title: string,
    phase: string
  ) => {
    return (
      <div
        className={`mb-4 ${title === "Now" ? "border-top border-dark col-12" : "col-md-6 p-md-4"}`}
      >
        {/* header */}
        <div
          className={`row py-1 ${title === "Now" ? "" : "rounded"}`}
          style={{
            backgroundColor: clockColorMap[phase]
              ? clockColorMap[phase].bg
              : "#a7a7a7",
            color: clockColorMap[phase]?.text,
          }}
        >
          <div className="col-12">
            <div className="container">
              <h5 className="mb-0 text-center">
                {title === "Now" ? (
                  <span>Favorites that are catchable now</span>
                ) : (
                  title
                )}
              </h5>
            </div>
          </div>
        </div>

        {/* body */}
        <div className="row">
          <div className="col">
            <div className="container">
              {items.length === 0 ? (
                <p className="text-muted">No items available</p>
              ) : (
                <div className="row d-flex">
                  {items.map((item, index) => (
                    <div
                      key={`${item.favoriteId}-${index}`}
                      className={`d-flex ${title === "Now" ? "col-12 col-md-6 col-lg-4" : "col-12 col-lg-6"} `}
                    >
                      <div className="m-1 p-1 flex-fill d-flex border rounded border-dark text-center">
                        <div className="col flex-grow-0 align-content-center">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                width: "40px",
                                height: "40px",
                              }}
                            />
                          )}
                        </div>
                        <div className="col flex-grow-1">
                          <div className="row">
                            <a
                              href={item.url}
                              target="wiki"
                              className="mb-0 fw-bold text-black text-decoration-none link-primary"
                            >
                              {item.name}
                            </a>
                          </div>

                          <div className="m-0">
                            <RarityTag number={item.rarity} />
                          </div>

                          <div className="row">
                            <small className="text-muted">
                              {generateInfotext(item).map((line, idx) => {
                                return (
                                  <span key={idx}>
                                    {idx > 0 && <i className="bi bi-dot"></i>}
                                    {line}
                                  </span>
                                );
                              })}
                            </small>
                          </div>
                        </div>
                        <div className="col flex-grow-0 align-content-center">
                          <button
                            onClick={() =>
                              handleFavorite(item.favoriteId, item.name)
                            }
                            className="btn btn-outline-dark rounded-circle p-0 m-0"
                            disabled={removingId}
                            style={{
                              width: 25,
                              height: 25,
                            }}
                          >
                            <i className="bi bi-star-fill"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="row p-0 m-0">
        {renderItemBlock(nowItems, "Now", currentPhaseText)}
      </div>
      <div className="row p-0 m-0">
        {renderItemBlock(nextItems, "Next", nextPhase)}
        {renderItemBlock(laterItems, "Later", laterPhases.join(", "))}
      </div>
    </>
  );
};
export default CatchPage;
