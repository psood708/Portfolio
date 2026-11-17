/**
 * One card shape for projects and lab entries, so the batch card, the pinned
 * track and the inventory grid all read the same fields. Pure: safe to call
 * from server components.
 */
import type { LabEntry, Project } from "./content";

export type CardData = {
  key: string;
  slug: string;
  kind: "batch" | "experiment";
  name: string;
  line: string;
  metric?: string;
  metricLabel?: string;
  stack?: string;
  year: string;
  href: string;
  badge: string;
  badgeTone: "crystal" | "sand";
  filters: string[];
  alt: string;
};

export function toCard(item: Project | LabEntry): CardData {
  if ("tags" in item) {
    return {
      key: `batch-${item.slug}`,
      slug: item.slug,
      kind: "batch",
      name: item.name,
      line: item.line,
      metric: item.metric,
      metricLabel: item.metricLabel,
      stack: item.stack,
      year: item.year,
      href: item.href,
      badge: item.tags[0] ?? "Systems",
      badgeTone: "crystal",
      filters: [...item.tags],
      alt: item.shot,
    };
  }
  return {
    key: `experiment-${item.slug}`,
    slug: item.slug,
    kind: "experiment",
    name: item.name,
    line: item.line,
    year: item.date,
    href: item.href,
    badge: item.status,
    badgeTone: "sand",
    filters: ["Experiments"],
    alt: item.shot,
  };
}

