import { v4 as uuid } from 'uuid';
import { useState, useRef } from 'react';

export default function useCreatePacks() {
    const [set, setSet] = useState('lof');
    const [leaderPacks, setLeaderPacks] = useState([]);
    const [cardPacks, setCardPacks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    let errorCount = 0;
    const commonIdsRef = useRef([]);
    const uncommonIdsRef = useRef([]);


    const fetchCard = async (rarity, seenIds = null) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${rarity}?set=${set}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || `Failed to fetch ${rarity} card`);
            }

            if (seenIds && data.cardData?._id) {
                const isDuplicate = seenIds.includes(data.cardData._id);
                if (isDuplicate) {
                    return fetchCard(rarity, seenIds);
                } else {
                    seenIds.push(data.cardData._id);
                }
            }

            return data;
        } catch (error) {
            errorCount++;
            console.error(`Error fetching ${rarity} card`, error);
            if (rarity === 'rare') {
                alert('Rare card failed to load');
            }
        }
    };

    async function generateCards(count, rarity, seenIds = null) {
        const cards = [];
        for (let i = 0; i < count; i++) {
            const card = await fetchCard(rarity, seenIds);
            if (card) {
                cards.push({ cardObj: card, id: uuid() });
            }
        }
        if (errorCount > 0) {
            alert(`${errorCount} ${rarity} card${errorCount > 1 ? 's' : ''} failed to load.`);
        }
        return cards;
    }

    async function generateLeaderPack(numLeaders = 3) {
        setIsLoading(true);
        const leaderPack = await generateCards(numLeaders, 'leader');
        if (leaderPack.length === numLeaders) {
            setLeaderPacks((prev) => [...prev, leaderPack]);
        }
    }

    async function generateCardPack() {
        setIsLoading(true);

        let rareUncommonRarity;
        let rareSlotCard;

        //Determine rarity of the rare slot
        const legendaryChance = Math.random() < 0.2;
        if (legendaryChance) {
            rareSlotCard = await generateCards(1, 'legendary');
        } else {
            rareSlotCard = await generateCards(1, 'rare');
        }

        //Determine rarity of the first uncommon (rareUncommon) slot
        const rareUncommonRarityNum = Math.random() < 0.1;
        if (rareUncommonRarityNum) {
            rareUncommonRarity = 'rare';
        } else {
            rareUncommonRarity = 'uncommon';
        }

        const rareSlot = rareSlotCard
        const rareUncommonSlot = await generateCards(1, rareUncommonRarity);
        const uncommonCards = await generateCards(2, 'uncommon', uncommonIdsRef.current);
        const commonCards = await generateCards(9, 'common', commonIdsRef.current);
        const foilSlot = await generateCards(1, 'foil');

        const cardPack = [...rareSlot, ...rareUncommonSlot, ...uncommonCards, ...commonCards, ...foilSlot];

        if (cardPack.length === 14) {
            setCardPacks((prev) => [...prev, cardPack]);
        }
    }

    function resetCardPacks() {
        setCardPacks([]);
    }

    function resetSeenIds() {
        commonIdsRef.current = [];
        uncommonIdsRef.current = [];
    }

    return {
        generateLeaderPack,
        generateCardPack,
        resetCardPacks,
        leaderPacks,
        setLeaderPacks,
        setCardPacks,
        cardPacks,
        isLoading,
        setIsLoading,
        resetSeenIds
    };
}
