/**
 * The work page's data: projects and experiments as one list of cards with
 * one set of filters. Pure, so the page can build it on the server and the
 * grid can filter it on the client.
 */
import { toCard, type CardData } from "./cards";
import type { LabEntry, Project } from "./content";

export const INVENTORY_FILTERS = ["All", "Agents", "RAG", "Evals", "Systems", "Experiments"] as const;
export type InventoryFilter = (typeof INVENTORY_FILTERS)[number];

export function buildInventory(projects: readonly Project[], lab: readonly LabEntry[]): CardData[] {
  return [...projects.map(toCard), ...lab.map(toCard)];
}

export function filterInventory<T extends CardData>(cards: T[], filter: InventoryFilter): T[] {
  if (filter === "All") return cards;
  return cards.filter((c) => c.filters.includes(filter));
}

/** `#experiments` preselects the experiments filter; anything else is All. */
export function filterFromHash(hash: string): InventoryFilter {
  return hash.replace(/^#/, "").toLowerCase() === "experiments" ? "Experiments" : "All";
}
