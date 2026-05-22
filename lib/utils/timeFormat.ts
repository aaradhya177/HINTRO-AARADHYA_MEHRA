export function formatDuration(seconds: number | null | undefined) {
  const parsedSeconds = Number(seconds ?? 0);
  const totalSeconds = Number.isFinite(parsedSeconds)
    ? Math.max(0, Math.floor(parsedSeconds))
    : 0;

  if (totalSeconds === 0) {
    return "0";
  }

  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }

  if (totalSeconds < 3600) {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    return `${minutes}m ${remainingSeconds}sec`;
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return `${hours}h ${minutes}m`;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatRelativeDate(dateValue: string | Date | null | undefined) {
  if (!dateValue) {
    return "\u2014";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "\u2014";
  }

  const today = startOfDay(new Date());
  const target = startOfDay(date);
  const diffDays = Math.round(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) {
    return "Today";
  }

  if (diffDays === 1) {
    return "Yesterday";
  }

  return `${Math.max(0, diffDays)} days ago`;
}

export function formatTime(dateValue: string | Date | null | undefined) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
}

function getOrdinalSuffix(day: number) {
  if (day >= 11 && day <= 13) {
    return "th";
  }

  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export function formatDateHeader(dateValue: string | Date | null | undefined) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.getDate();

  return `${month} ${day}${getOrdinalSuffix(day)}`;
}
