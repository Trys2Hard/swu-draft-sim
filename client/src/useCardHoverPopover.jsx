import { useState, useRef } from 'react';

export function useCardHoverPopover() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const hoverTimeoutRef = useRef(null);

    const handlePopoverOpen = (event, card) => {
        const target = event.currentTarget;
        if (!target) return;

        hoverTimeoutRef.current = setTimeout(() => {
            setAnchorEl(target);
            setHoveredCard(card);
        }, 400);
    };

    const handlePopoverClose = () => {
        clearTimeout(hoverTimeoutRef.current);
        setAnchorEl(null);
        setHoveredCard(null);
    };

    return { anchorEl, hoveredCard, handlePopoverOpen, handlePopoverClose };
}
