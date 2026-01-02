import { useState, useRef } from 'react';

export function useCardHoverPopover() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const hoverTimeoutRef = useRef(null);
  const currentTargetRef = useRef(null); // Track current hover target

  const handlePopoverOpen = (event, card) => {
    const target = event.currentTarget;
    if (!target) return;

    currentTargetRef.current = target; // Store the target

    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = setTimeout(() => {
      // Only show if we're still hovering the same element
      if (currentTargetRef.current === target) {
        setAnchorEl(target);
        setHoveredCard(card);
      }
    }, 400);
  };

  const handlePopoverClose = () => {
    // Clear the timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Clear the current target reference
    currentTargetRef.current = null;

    // Close the popover
    setAnchorEl(null);
    setHoveredCard(null);
  };

  return { anchorEl, hoveredCard, handlePopoverOpen, handlePopoverClose };
}
