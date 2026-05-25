import moment from "moment";

export const USER_REVIEW_MEDIA_TYPE = {
  IMAGE: 1,
  VIDEO: 2,
} as const;

export const formatRate = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "-";
  }

  return value.toFixed(1);
};

export const getReviewScore = (review: {
  ratings?: { location?: number; cleanliness?: number; food?: number };
}) => {
  const location = Number(review.ratings?.location ?? 0);
  const cleanliness = Number(review.ratings?.cleanliness ?? 0);
  const food = Number(review.ratings?.food ?? 0);

  const average = (location + cleanliness + food) / 3;
  return Number.isFinite(average) ? average : 0;
};

export const publishDate = (
  date: string | Date,
  t: (key: string) => string | unknown
) => {
  if (!date) return "";

  const momentDate = moment(date);
  const longMonthName = momentDate.locale("en").format("MMMM").toLowerCase();
  const shortMonthName = String(t(`${longMonthName}Short`));
  return `${shortMonthName} ${momentDate.format("DD")}, ${momentDate.format(
    "YYYY"
  )}`;
};

export const getYoutubeVideoId = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace("www.", "");

    if (host === "youtu.be") {
      const id = parsedUrl.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsedUrl.pathname === "/watch") {
        return parsedUrl.searchParams.get("v");
      }

      if (parsedUrl.pathname.startsWith("/embed/")) {
        const id = parsedUrl.pathname.split("/embed/")[1];
        return id || null;
      }

      if (parsedUrl.pathname.startsWith("/shorts/")) {
        const id = parsedUrl.pathname.split("/shorts/")[1];
        return id || null;
      }
    }
  } catch {
    return null;
  }

  return null;
};

export const getReviewMediaPreviewUrl = (media: { url: string; mediaType: number }) => {
  if (media.mediaType !== USER_REVIEW_MEDIA_TYPE.VIDEO) {
    return media.url;
  }

  const youtubeId = getYoutubeVideoId(media.url);
  if (!youtubeId) return media.url;

  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
};

export const getYoutubeEmbedUrl = (url: string) => {
  const youtubeId = getYoutubeVideoId(url);
  if (!youtubeId) return null;

  return `https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0`;
};
