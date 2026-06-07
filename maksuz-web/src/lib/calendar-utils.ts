// Calendar utility functions for duration-based slot visualization

// Height of one hour cell in pixels (matches h-20 = 80px)
export const HOUR_HEIGHT_PX = 80;

/**
 * Convert time string "HH:MM" to total minutes since midnight
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Calculate slot height in pixels based on duration
 * 30 min = 40px (50% of hour), 60 min = 80px (1 box), 90 min = 120px (1.5 boxes)
 */
export function calculateSlotHeight(startTime: string, endTime: string): number {
  const durationMinutes = timeToMinutes(endTime) - timeToMinutes(startTime);
  return (durationMinutes / 60) * HOUR_HEIGHT_PX;
}

/**
 * Calculate top offset for slots that don't start on hour boundary
 * e.g., 09:30 → 40px offset from top of 09:00 row
 */
export function calculateSlotOffset(startTime: string): number {
  const minutes = parseInt(startTime.split(":")[1]);
  return (minutes / 60) * HOUR_HEIGHT_PX;
}

/**
 * Get the hour key (HH:00) that a slot belongs to based on start time
 * e.g., "09:30" → "09:00", "10:45" → "10:00"
 */
export function getHourKeyForSlot(startTime: string): string {
  const hour = parseInt(startTime.split(":")[0]);
  return `${hour.toString().padStart(2, "0")}:00`;
}

/**
 * Calculate slot duration in minutes
 */
export function getSlotDurationMinutes(startTime: string, endTime: string): number {
  return timeToMinutes(endTime) - timeToMinutes(startTime);
}

/**
 * Format duration as human-readable string
 * e.g., "30m", "1h", "1h 30m", "2h"
 */
export function formatDuration(startTime: string, endTime: string): string {
  const minutes = getSlotDurationMinutes(startTime, endTime);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
}

// ============================================
// Overlap Detection & Layout Functions
// ============================================

/**
 * Generic time slot interface for overlap detection
 */
interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

/**
 * Layout information for a single slot
 */
export interface SlotLayoutInfo {
  columnIndex: number; // 0-indexed column position
  totalColumns: number; // Total columns in overlap group
}

/**
 * Map of slot IDs to their layout information
 */
export type SlotLayoutMap = Map<string, SlotLayoutInfo>;

/**
 * Check if two time slots overlap
 * Overlap occurs when: A.start < B.end AND B.start < A.end
 */
export function slotsOverlap(slotA: TimeSlot, slotB: TimeSlot): boolean {
  const aStart = timeToMinutes(slotA.startTime);
  const aEnd = timeToMinutes(slotA.endTime);
  const bStart = timeToMinutes(slotB.startTime);
  const bEnd = timeToMinutes(slotB.endTime);

  return aStart < bEnd && bStart < aEnd;
}

/**
 * Find groups of transitively overlapping slots using BFS
 * Slots in the same group have at least one overlapping path
 */
export function findOverlapGroups<T extends TimeSlot>(slots: T[]): T[][] {
  if (slots.length === 0) return [];

  const visited = new Set<string>();
  const groups: T[][] = [];

  // Build adjacency map for overlapping slots
  const adjacency = new Map<string, Set<string>>();
  for (const slot of slots) {
    adjacency.set(slot.id, new Set());
  }

  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      if (slotsOverlap(slots[i], slots[j])) {
        adjacency.get(slots[i].id)!.add(slots[j].id);
        adjacency.get(slots[j].id)!.add(slots[i].id);
      }
    }
  }

  // BFS to find connected components
  const slotMap = new Map(slots.map((s) => [s.id, s]));

  for (const slot of slots) {
    if (visited.has(slot.id)) continue;

    const group: T[] = [];
    const queue = [slot.id];
    visited.add(slot.id);

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      group.push(slotMap.get(currentId)!);

      const neighbors = adjacency.get(currentId)!;
      neighbors.forEach((neighborId) => {
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          queue.push(neighborId);
        }
      });
    }

    groups.push(group);
  }

  return groups;
}

/**
 * Calculate layout for all slots using greedy column assignment
 * - Sorts slots by start time, then by duration (longer first)
 * - Assigns each slot to first available column
 */
export function calculateSlotLayout<T extends TimeSlot>(slots: T[]): SlotLayoutMap {
  const layoutMap: SlotLayoutMap = new Map();

  if (slots.length === 0) return layoutMap;

  // Find all overlap groups
  const groups = findOverlapGroups(slots);

  for (const group of groups) {
    if (group.length === 1) {
      // Single slot - full width
      layoutMap.set(group[0].id, { columnIndex: 0, totalColumns: 1 });
      continue;
    }

    // Sort group by start time, then by duration (longer first for stable assignment)
    const sortedGroup = [...group].sort((a, b) => {
      const startDiff = timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
      if (startDiff !== 0) return startDiff;
      // Longer slots first (gives more predictable layout)
      return getSlotDurationMinutes(b.startTime, b.endTime) - getSlotDurationMinutes(a.startTime, a.endTime);
    });

    // Track end times for each column
    const columnEndTimes: number[] = [];
    const slotColumns: Map<string, number> = new Map();

    for (const slot of sortedGroup) {
      const slotStart = timeToMinutes(slot.startTime);
      const slotEnd = timeToMinutes(slot.endTime);

      // Find first available column
      let assignedColumn = -1;
      for (let col = 0; col < columnEndTimes.length; col++) {
        if (columnEndTimes[col] <= slotStart) {
          assignedColumn = col;
          break;
        }
      }

      // Create new column if none available
      if (assignedColumn === -1) {
        assignedColumn = columnEndTimes.length;
        columnEndTimes.push(0);
      }

      // Assign slot to column and update end time
      slotColumns.set(slot.id, assignedColumn);
      columnEndTimes[assignedColumn] = slotEnd;
    }

    // Total columns for this group
    const totalColumns = columnEndTimes.length;

    // Store layout info for each slot in the group
    for (const slot of group) {
      layoutMap.set(slot.id, {
        columnIndex: slotColumns.get(slot.id)!,
        totalColumns,
      });
    }
  }

  return layoutMap;
}

/**
 * Convert layout info to CSS position values
 * Returns left and width as CSS strings with padding for gaps
 */
export function calculateSlotPosition(layout: SlotLayoutInfo): { left: string; width: string } {
  const gapPx = 4; // Gap between columns
  const paddingPx = 8; // Padding from cell edges

  if (layout.totalColumns === 1) {
    return {
      left: `${paddingPx}px`,
      width: `calc(100% - ${paddingPx * 2}px)`,
    };
  }

  // Calculate width percentage for each column
  const totalGaps = (layout.totalColumns - 1) * gapPx;
  const availableWidth = `calc(100% - ${paddingPx * 2}px - ${totalGaps}px)`;
  const columnWidth = `calc(${availableWidth} / ${layout.totalColumns})`;

  // Calculate left position
  const leftOffset = `calc(${paddingPx}px + (${columnWidth} + ${gapPx}px) * ${layout.columnIndex})`;

  return {
    left: leftOffset,
    width: columnWidth,
  };
}

// ============================================
// Overflow / Max Visible Slots Functions
// ============================================

/**
 * Maximum number of visible slots before showing overflow indicator
 */
export const MAX_VISIBLE_SLOTS = 2;

/**
 * Result of splitting slots into visible and overflow
 */
export interface VisibleSlotsResult<T> {
  visibleSlots: T[];
  overflowSlots: T[];
  overflowCount: number;
}

/**
 * Filter slots into visible and overflow based on max visible count.
 * Sorts by column index to show leftmost slots first.
 */
export function getVisibleSlotsAndOverflow<T extends { id: string }>(
  slots: T[],
  layoutMap: SlotLayoutMap,
  maxVisible: number = MAX_VISIBLE_SLOTS
): VisibleSlotsResult<T> {
  if (slots.length <= maxVisible) {
    return {
      visibleSlots: slots,
      overflowSlots: [],
      overflowCount: 0,
    };
  }

  // Sort slots by column index (leftmost first)
  const sortedSlots = [...slots].sort((a, b) => {
    const layoutA = layoutMap.get(a.id);
    const layoutB = layoutMap.get(b.id);
    const colA = layoutA?.columnIndex ?? 0;
    const colB = layoutB?.columnIndex ?? 0;
    return colA - colB;
  });

  return {
    visibleSlots: sortedSlots.slice(0, maxVisible),
    overflowSlots: sortedSlots.slice(maxVisible),
    overflowCount: sortedSlots.length - maxVisible,
  };
}

/**
 * Calculate position for slots when overflow badge exists.
 * Reserves space for the overflow badge on the right side.
 */
export function calculateSlotPositionWithOverflow(
  layout: SlotLayoutInfo,
  hasOverflow: boolean,
  maxVisible: number = MAX_VISIBLE_SLOTS
): { left: string; width: string } {
  const gapPx = 4; // Gap between columns
  const paddingPx = 8; // Padding from cell edges
  const badgeWidth = 32; // Width reserved for overflow badge (+N)

  if (!hasOverflow) {
    return calculateSlotPosition(layout);
  }

  // When overflow exists, we show maxVisible slots + badge
  // Total display columns = maxVisible + 1 (for badge)
  const displayColumns = maxVisible + 1;

  // Calculate width for each display column (including badge space)
  const totalGaps = (displayColumns - 1) * gapPx;
  const availableWidth = `calc(100% - ${paddingPx * 2}px - ${totalGaps}px - ${badgeWidth}px)`;
  const columnWidth = `calc(${availableWidth} / ${maxVisible})`;

  // Calculate left position based on visible column index (not original layout)
  const visibleColumnIndex = Math.min(layout.columnIndex, maxVisible - 1);
  const leftOffset = `calc(${paddingPx}px + (${columnWidth} + ${gapPx}px) * ${visibleColumnIndex})`;

  return {
    left: leftOffset,
    width: columnWidth,
  };
}

/**
 * Calculate position for the overflow badge (+N indicator).
 * Positioned after the last visible slot.
 */
export function calculateOverflowBadgePosition(
  maxVisible: number = MAX_VISIBLE_SLOTS
): { left: string; width: string } {
  const gapPx = 4; // Gap between columns
  const paddingPx = 8; // Padding from cell edges
  const badgeWidth = 32; // Fixed width for badge

  // Position badge after maxVisible columns
  const displayColumns = maxVisible + 1;
  const totalGaps = (displayColumns - 1) * gapPx;
  const availableWidthForSlots = `calc(100% - ${paddingPx * 2}px - ${totalGaps}px - ${badgeWidth}px)`;
  const columnWidth = `calc(${availableWidthForSlots} / ${maxVisible})`;

  // Left position is after all visible slots
  const leftOffset = `calc(${paddingPx}px + (${columnWidth} + ${gapPx}px) * ${maxVisible})`;

  return {
    left: leftOffset,
    width: `${badgeWidth}px`,
  };
}
