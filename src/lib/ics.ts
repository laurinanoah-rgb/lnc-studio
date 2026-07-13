function formatIcsDate(date: Date): string {
  return `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

export function buildIcsContent({
  uid,
  title,
  description,
  location,
  startDate,
  endDate,
  url,
}: {
  uid: string;
  title: string;
  description: string;
  location?: string | null;
  startDate: Date;
  endDate?: Date | null;
  url: string;
}): string {
  const stamp = formatIcsDate(new Date());
  const dtStart = formatIcsDate(startDate);
  const dtEnd = formatIcsDate(endDate ?? new Date(startDate.getTime() + 2 * 60 * 60 * 1000));
  const plainDescription = description
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//LNC//Veranstaltungen//DE",
    "BEGIN:VEVENT",
    `UID:${uid}@lnc`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${title.replace(/\n/g, " ")}`,
    location ? `LOCATION:${location.replace(/\n/g, " ")}` : "",
    `DESCRIPTION:${plainDescription}`,
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}
