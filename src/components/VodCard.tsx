import type { VodContent } from "@/services/sdk/src/models/vod";
import { resolveApiUrl } from "@/utils/resolveApiUrl";
import { ApiImage } from "./ApiImage";

interface VodCardProps {
  content: VodContent;
  focused: boolean;
}

export function VodCard({ content, focused }: VodCardProps) {
  const posterUrl = resolveApiUrl(
    content.poster?.landscape || content.poster?.portrait,
  );
  const year = content.year ? String(content.year) : "";
  const genres = content.genres?.slice(0, 2).join(", ") || "";

  return (
    <div class={`vod-card ${focused ? "focused" : ""}`}>
      {posterUrl && <ApiImage src={posterUrl} class="vod-card-img" />}
      {content.isNew && <div class="vod-card-badge-new">NEW</div>}
      <div class="vod-card-overlay">
        <span class="vod-card-title">{content.title}</span>
        {/* {(year || genres) && (
          <span class="vod-card-meta">
            {year}{year && genres ? ' · ' : ''}{genres}
          </span>
        )} */}
      </div>
    </div>
  );
}
