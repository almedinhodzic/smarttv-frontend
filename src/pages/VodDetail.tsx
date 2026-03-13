import { useEffect, useState, useCallback } from "preact/hooks";
import { route } from "preact-router";
import { useVodStore } from "@/stores/vodStore";
import { useSessionStore } from "@/stores/sessionStore";
import { isSpatialEnabled, triggerEdge } from "@/spatial";
import { ApiImage } from "@/components/ApiImage";
import { Loader } from "@/components/Loader";
import { resolveApiUrl } from "@/utils/resolveApiUrl";
import { formatCategoryLabel } from "@/utils/formatCategoryLabel";

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

type FocusItem = "favorite" | "play";

export function VodDetail({ id }: { id?: string; path?: string }) {
  const rows = useVodStore((s) => s.rows);
  const detailContent = useVodStore((s) => s.detailContent);
  const isLoadingDetail = useVodStore((s) => s.isLoadingDetail);
  const fetchContentById = useVodStore((s) => s.fetchContentById);
  const toggleFavorite = useVodStore((s) => s.toggleFavorite);
  const selectedProfile = useSessionStore((s) => s.selectedProfile);
  const user = useSessionStore((s) => s.user);
  const [focusedBtn, setFocusedBtn] = useState<FocusItem>("play");

  const profileId = selectedProfile?.idProfile
    ? String(selectedProfile.idProfile)
    : selectedProfile?.id || "";
  const regionId = user?.regionIds?.[0] || "";
  const language = selectedProfile?.language || "en";

  // Try rows cache first, otherwise fetch from API
  let rowContent = null as import("@/services/sdk/src/models/vod").VodContent | null;
  for (const row of rows) {
    const found = row.contents.find((c) => c.id === id);
    if (found) {
      rowContent = found;
      break;
    }
  }

  const content = rowContent || detailContent;

  useEffect(() => {
    if (!id || rowContent) return;
    if (profileId) {
      fetchContentById(profileId, id, regionId, language);
    }
  }, [id, profileId, regionId, language, !rowContent]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!isSpatialEnabled()) return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          e.stopImmediatePropagation();
          triggerEdge("up");
          break;

        case "ArrowLeft":
          if (focusedBtn === "play") {
            e.preventDefault();
            e.stopImmediatePropagation();
            setFocusedBtn("favorite");
          } else {
            // Already at leftmost → open sidebar
            e.preventDefault();
            e.stopImmediatePropagation();
            triggerEdge("left");
          }
          break;

        case "ArrowRight":
          e.preventDefault();
          e.stopImmediatePropagation();
          if (focusedBtn === "favorite") setFocusedBtn("play");
          break;

        case "Enter":
          e.preventDefault();
          e.stopImmediatePropagation();
          if (focusedBtn === "favorite" && content) {
            toggleFavorite(content.id);
          }
          break;

        case "Escape":
        case "Back":
        case "Backspace":
          e.preventDefault();
          e.stopImmediatePropagation();
          route("/vod");
          break;
      }
    },
    [focusedBtn, content, toggleFavorite],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey, true);
    return () => document.removeEventListener("keydown", handleKey, true);
  }, [handleKey]);

  if (isLoadingDetail && !content) {
    return (
      <div class="page page-vod-detail page-with-sidebar">
        <Loader message="Loading..." />
      </div>
    );
  }

  if (!content) {
    return (
      <div class="page page-vod-detail page-with-sidebar">
        <h1 class="page-title">Content not found</h1>
      </div>
    );
  }

  const posterUrl = resolveApiUrl(
    content.poster?.portrait || content.poster?.landscape,
  );

  const hasResumePlay = content.contentActions?.resumePlay?.length > 0;

  // Build meta parts
  const metaParts: string[] = [];
  if (content.genres?.length)
    metaParts.push(
      content.genres.slice(0, 2).map(formatCategoryLabel).join(", "),
    );
  if (content.runtimeInMinutes)
    metaParts.push(formatDuration(content.runtimeInMinutes));
  if (content.year) metaParts.push(String(content.year));
  if (content.ageRating) metaParts.push(`${content.ageRating}+`);

  return (
    <div class="page page-vod-detail page-with-sidebar">
      <h1 class="page-title">{content.title}</h1>

      {metaParts.length > 0 && (
        <div class="vod-detail-meta">{metaParts.join(" \u00B7 ")}</div>
      )}

      <div class="vod-detail-body">
        <div class="vod-detail-poster">
          {posterUrl && (
            <ApiImage src={posterUrl} class="vod-detail-poster-img" />
          )}
        </div>

        <div class="vod-detail-right">
          <div class="vod-detail-description-full">
            {content.description || content.summary || ""}
          </div>

          {content.cast?.length || content.directors?.length ? (
            <div class="vod-detail-credits">
              {content.directors && content.directors.length > 0 && (
                <div class="vod-detail-credit-row">
                  <span class="vod-detail-credit-label">Director</span>
                  <span class="vod-detail-credit-value">
                    {content.directors.join(", ")}
                  </span>
                </div>
              )}
              {content.cast && content.cast.length > 0 && (
                <div class="vod-detail-credit-row">
                  <span class="vod-detail-credit-label">Cast</span>
                  <span class="vod-detail-credit-value">
                    {content.cast.slice(0, 5).join(", ")}
                  </span>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      <div class="vod-detail-actions">
        <div
          class={`vod-detail-action-btn ${focusedBtn === "favorite" ? "focused" : ""}`}
        >
          <img
            src={
              content.isFavorite
                ? "/assets/unfavorite.png"
                : "/assets/heart_icon.png"
            }
            alt=""
            class="vod-detail-action-icon"
          />
          <span>
            {content.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </span>
        </div>
        <div
          class={`vod-detail-action-btn vod-detail-action-play ${focusedBtn === "play" ? "focused" : ""}`}
        >
          <img
            src={hasResumePlay ? "/assets/continue_playing.png" : "/assets/play-icon.png"}
            alt=""
            class="vod-detail-action-icon"
          />
          <span>{hasResumePlay ? "Continue Watching" : "Play"}</span>
        </div>
      </div>
    </div>
  );
}
