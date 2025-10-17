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
  getCountdownToNextPhase,
} from "../utils/clockPhases";

import RarityTag from "../components/display/RarityTag";

import { type UseQueryResult } from "@tanstack/react-query";
import type { CatchableEntry } from "../app/types/wikiTypes";
import { selectAllBugs } from "../features/slices/BugsSlice";
import { selectAllFish } from "../features/slices/FishSlice";
import { selectAllFavorites } from "../features/slices/FavoritesSlice";
import { useRemoveFavorite } from "../hooks/useFavoriteMutations";

type ItemSelector = () => UseQueryResult<CatchableEntry[] | undefined, Error>;
const selectorMap: { [key: string]: ItemSelector } = {
  bugs: selectAllBugs,
  fish: selectAllFish,
};

const itemTimeIncludesPhase = (itemTime: string, phase: string): boolean => {
  if (!itemTime || itemTime.toLowerCase().includes("any time")) {
    return true;
  }
  return itemTime.toLowerCase().includes(phase.toLowerCase());
};

const HuntPage = ({ profile }: { profile: GoogleProfile }) => {
  const profileId = profile ? profile.id : "";

  const [currentTime, setCurrentTime] = useState(0);
  const currentPhase = getCurrentPhase(currentTime);
  const nextPhase = getNextPhase(currentPhase.text);
  const laterPhases = getLaterPhases(currentPhase.text, nextPhase);
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

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
    const interval = setInterval(() => {
      const now = new Date();
      const startOfHour = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours()
      );
      const millisecondsPassed = now.getTime() - startOfHour.getTime();
      const virtualHours = ((millisecondsPassed - 1000) / 3600000) * 24;
      setCurrentTime(virtualHours);

      const currentPhase = getCurrentPhase(virtualHours);
      const countdownData = getCountdownToNextPhase(
        virtualHours,
        currentPhase.text
      );
      setCountdown(countdownData);
    }, 100);

    return () => clearInterval(interval);
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

  const fullFavoriteItems = categoryData
    .filter(
      (categoryInfo) =>
        !categoryInfo.isLoading && !categoryInfo.isError && categoryInfo.data
    )
    .sort((a, b) => a.category.localeCompare(b.category))
    .flatMap((categoryInfo) => {
      const categoryFavorites = favoritesData.filter(
        (fav) => fav.category === categoryInfo.category
      );
      return categoryFavorites
        .map((favorite) => {
          const itemData = categoryInfo.data?.find(
            (item) => item.id === favorite.itemId
          );
          return itemData
            ? {
                ...itemData,
                favoriteId: favorite.favoriteId,
                category: categoryInfo.category,
              }
            : null;
        })
        .filter(Boolean);
    });

  const nowItems = fullFavoriteItems.filter((item) => {
    if (!item) return false;
    if (item.time.toLowerCase().includes("any time")) return true;
    return itemTimeIncludesPhase(item.time, currentPhase.text);
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

  const renderItemBlock = (items: any[], title: string, phase: string) => (
    <div className={`mb-4 ${title === "Now" ? "col-12" : "col-md-6"}`}>
      <div className="card h-100">
        <div
          className="card-header"
          style={{
            backgroundColor: clockColorMap[phase]?.bg,
            color: clockColorMap[phase]?.text,
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="card-title mb-0">
                {title} - {phase}
              </h5>
            </div>
            {title === "Now" && (
              <div className="text-end">
                <div className="badge bg-warning text-dark fs-6">
                  {countdown.hours.toString().padStart(2, "0")}:
                  {countdown.minutes.toString().padStart(2, "0")}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card-body">
          {items.length === 0 ? (
            <p className="text-muted">No items available</p>
          ) : (
            <div className="row">
              {items.map((item, index) => (
                <div
                  key={`${item.favoriteId}-${index}`}
                  className={`${title === "Now" ? "col-12 col-md-6 col-lg-4" : "col-12 col-lg-6"} `}
                >
                  <div className="d-flex align-items-center border rounded px-2 mb-1">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="me-2"
                        style={{
                          width: "40px",
                          height: "40px",
                        }}
                      />
                    )}
                    <div className="flex-fill">
                      <h6 className="mb-1 me-1 flex-fill">{item.name}</h6>
                      <div className="d-flex flex-wrap">
                        <div className="flex-grow-1">
                          <RarityTag number={item.rarity} />
                        </div>
                        <div className="">
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

                      <small className="text-muted">
                        {item.time.replace(/\s*\([^)]*\)\s*$/, "")}
                        <i className="bi bi-dot"></i>
                        {Array.isArray(item.location) &&
                        item.location.length > 0
                          ? item.location
                              .map((loc: any) => loc.title)
                              .join(", ")
                          : item.category}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-12 text-center">
          <h2 className="mt-2">Favorite items that can be found now</h2>
        </div>
      </div>

      <div className="row">
        {renderItemBlock(nowItems, "Now", currentPhase.text)}
        {renderItemBlock(nextItems, "Next", nextPhase)}
        {renderItemBlock(laterItems, "Later", laterPhases.join(", "))}
      </div>
    </div>
  );
};
export default HuntPage;
