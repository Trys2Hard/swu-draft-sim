import { useMemo } from 'react';

/**
 * Normalize values used for card matching.
 *
 * Handles:
 * - null / undefined
 * - whitespace
 * - capitalization
 * - MongoDB-style values such as { S: 'Common' }
 */
const normalizeMatchValue = (value) => {
  if (value == null) {
    return '';
  }

  // Handle MongoDB/DynamoDB-style string objects.
  if (
    typeof value === 'object' &&
    value !== null &&
    Object.prototype.hasOwnProperty.call(value, 'S')
  ) {
    return String(value.S).trim().toLowerCase();
  }

  return String(value).trim().toLowerCase();
};

/**
 * Convert a card number to the export format:
 *
 * 46  -> 046
 * "46" -> 046
 * "046" -> 046
 */
const formatCardNumber = (value) => {
  if (value == null || value === '') {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  return number.toString().padStart(3, '0');
};

/**
 * Primary matching key:
 *
 * Set
 * Name
 * Type
 * Rarity
 *
 * Example:
 *
 * SOR + Consular Security Force + Unit + Common
 *
 * This allows:
 *
 * SOR_312 Hyperspace
 *
 * to match:
 *
 * SOR_046 Normal
 */
const getPrimaryMatchKey = (card) => {
  const data = card?.cardData;

  if (!data) {
    return null;
  }

  const set = normalizeMatchValue(data.Set);
  const name = normalizeMatchValue(data.Name);
  const type = normalizeMatchValue(data.Type);
  const rarity = normalizeMatchValue(data.Rarity);

  if (!set || !name || !type || !rarity) {
    return null;
  }

  return JSON.stringify([set, name, type, rarity]);
};

/**
 * FrontText is used only when multiple Normal cards
 * have the same Set + Name + Type + Rarity.
 */
const getFrontTextKey = (card) =>
  normalizeMatchValue(card?.cardData?.FrontText);

/**
 * Create a readable description for debugging.
 */
const describeCard = (card) => {
  const data = card?.cardData;

  if (!data) {
    return null;
  }

  return {
    set: data.Set,
    number: data.Number,
    name: data.Name,
    type: data.Type,
    rarity: data.Rarity,
    variantType: data.VariantType,
    frontText: data.FrontText,
  };
};

export function useCopyJson({
  deckLeaders,
  sortedDeckCards,
  sideboardCards,
  sealedPoolRemainingCards,
  leaderPacks,
  sortedCardPacks,
  base,
  normalCards,
}) {
  console.log(
    'NORMAL CARDS:',
    normalCards?.filter(
      (card) => card?.cardData?.Name === 'Consular Security Force',
    ),
  );
  /**
   * Build a lookup Map containing Normal cards.
   *
   * Each key can have multiple Normal cards because
   * Set + Name + Type + Rarity may not always uniquely
   * identify a card.
   */
  const normalCardMap = useMemo(() => {
    const map = new Map();

    for (const card of normalCards || []) {
      const data = card?.cardData;

      if (!data) {
        continue;
      }

      if (normalizeMatchValue(data.VariantType) !== 'normal') {
        continue;
      }

      const key = getPrimaryMatchKey(card);

      if (!key) {
        continue;
      }

      const existingCards = map.get(key);

      if (existingCards) {
        existingCards.push(card);
      } else {
        map.set(key, [card]);
      }
    }

    return map;
  }, [normalCards]);

  /**
   * Convert a card to the Set_Number format used by
   * the deck import/export format.
   */
  const cardToId = (card) => {
    const data = card?.cardData;

    if (!data) {
      console.warn('Card is missing cardData:', card);
      return null;
    }

    const set = normalizeMatchValue(data.Set);
    const variantType = normalizeMatchValue(data.VariantType);
    const rawNumber = data.Number;

    if (!set) {
      console.warn('Card is missing a Set:', describeCard(card));
      return null;
    }

    /**
     * NORMAL CARDS
     *
     * Normal cards use their own number.
     *
     * Example:
     *
     * SOR 046 Normal
     *
     * becomes:
     *
     * SOR_046
     */
    if (variantType === 'normal') {
      const number = formatCardNumber(rawNumber);

      if (!number) {
        console.warn(
          'Normal card has an invalid or missing card number:',
          describeCard(card),
        );

        return null;
      }

      return `${set.toUpperCase()}_${number}`;
    }

    /**
     * NON-NORMAL CARDS
     *
     * Never use the variant's own card number.
     *
     * Example:
     *
     * SOR 312 Hyperspace
     *
     * needs to become:
     *
     * SOR_046
     *
     * by finding the corresponding Normal card.
     */

    const primaryKey = getPrimaryMatchKey(card);

    if (!primaryKey) {
      console.warn(
        'Could not create a primary matching key for card:',
        describeCard(card),
      );

      return null;
    }

    const matchingNormalCards = normalCardMap.get(primaryKey) || [];

    /**
     * No Normal cards matched.
     */
    if (matchingNormalCards.length === 0) {
      console.warn('NO NORMAL MATCH FOUND', {
        variantCard: describeCard(card),
        primaryKey,
      });

      return null;
    }

    let normalCard;

    /**
     * Exactly one Normal card matched.
     *
     * This is the expected case for:
     *
     * SOR 312 Hyperspace
     * ->
     * SOR 046 Normal
     */
    if (matchingNormalCards.length === 1) {
      normalCard = matchingNormalCards[0];
    } else {
      /**
       * Multiple Normal cards have the same:
       *
       * Set + Name + Type + Rarity
       *
       * Try FrontText.
       */
      const variantFrontText = getFrontTextKey(card);

      const frontTextMatches = matchingNormalCards.filter(
        (candidate) => getFrontTextKey(candidate) === variantFrontText,
      );

      /**
       * Exactly one FrontText match.
       */
      if (frontTextMatches.length === 1) {
        normalCard = frontTextMatches[0];
      } else {
        /**
         * Don't guess if FrontText doesn't uniquely
         * identify the Normal card.
         */
        console.warn('AMBIGUOUS NORMAL MATCH', {
          variantCard: describeCard(card),
          variantFrontText,
          allNormalCandidates: matchingNormalCards.map(describeCard),
          frontTextMatches: frontTextMatches.map(describeCard),
        });

        return null;
      }
    }

    /**
     * Get the Normal card's number.
     */
    const normalNumber = formatCardNumber(normalCard?.cardData?.Number);

    if (!normalNumber) {
      console.warn(
        'Matched Normal card has an invalid or missing card number:',
        describeCard(normalCard),
      );

      return null;
    }

    /**
     * Always use the NORMAL card's number.
     *
     * Example:
     *
     * SOR 312 Hyperspace
     * ->
     * SOR 046 Normal
     * ->
     * SOR_046
     */
    return `${set.toUpperCase()}_${normalNumber}`;
  };

  /**
   * Convert cards into:
   *
   * [
   *   { id: 'SOR_046', count: 2 },
   *   { id: 'SOR_123', count: 1 }
   * ]
   */
  const countCards = (cards) => {
    const countMap = new Map();
    const failedCards = [];

    for (const card of cards || []) {
      const id = cardToId(card);

      if (!id) {
        failedCards.push(card);
        continue;
      }

      countMap.set(id, (countMap.get(id) || 0) + 1);
    }

    return {
      cards: Array.from(countMap, ([id, count]) => ({
        id,
        count,
      })).sort((a, b) => {
        const numberA = Number(a.id.split('_')[1]);
        const numberB = Number(b.id.split('_')[1]);

        return numberA - numberB;
      }),
      failedCards,
    };
  };

  const handleCopyJson = async () => {
    /**
     * Use sortedDeckCards when populated.
     *
     * Otherwise use sortedCardPacks.
     */
    const deckSource =
      sortedDeckCards?.length > 0 ? sortedDeckCards : sortedCardPacks || [];

    const deckResult = countCards(deckSource);

    /**
     * For sealed pools, remaining cards become
     * the sideboard.
     */
    const sideboardSource =
      sealedPoolRemainingCards?.length > 0
        ? sealedPoolRemainingCards.flat()
        : sideboardCards || [];

    const sideboardResult = countCards(sideboardSource);

    /**
     * Find the leader.
     */
    let firstLeader = null;

    if (leaderPacks?.length > 0) {
      firstLeader = leaderPacks.flat()?.[0];
    } else if (deckLeaders?.length > 0) {
      firstLeader = deckLeaders[0];
    }

    const leaderId = cardToId(firstLeader) || 'undefined_undefined';

    /**
     * Build JSON.
     */
    const jsonCardData = {
      metadata: {
        name:
          leaderPacks?.length > 0
            ? 'SWUDraftSim Sealed Pool'
            : 'SWUDraftSim Deck',
        author: 'Unknown',
      },

      leader: {
        id: leaderId,
        count: 1,
      },

      base: {
        id: base,
        count: 1,
      },

      deck: deckResult.cards,

      sideboard: sideboardResult.cards,
    };

    /**
     * Copy JSON to clipboard.
     */
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(jsonCardData, null, 2),
      );
    } catch (error) {
      console.error('Failed to copy JSON to clipboard:', error);

      return {
        text: 'Failed to Copy JSON to Clipboard',
        status: 'error',
      };
    }

    /**
     * Missing leader.
     */
    if (
      !jsonCardData.leader?.id ||
      jsonCardData.leader.id === 'undefined_undefined'
    ) {
      return {
        text: 'Copied JSON to Clipboard (No Leader Selected)',
        status: 'warning',
      };
    }

    /**
     * Missing base.
     */
    if (!jsonCardData.base?.id) {
      return {
        text: 'Copied JSON to Clipboard (No Base Selected)',
        status: 'warning',
      };
    }

    /**
     * Report cards that couldn't be matched.
     */
    const failedCount =
      deckResult.failedCards.length + sideboardResult.failedCards.length;

    if (failedCount > 0) {
      console.warn(`${failedCount} card(s) could not be converted.`, {
        deckFailedCards: deckResult.failedCards.map(describeCard),

        sideboardFailedCards: sideboardResult.failedCards.map(describeCard),
      });

      return {
        text: `Copied JSON to Clipboard (${failedCount} Card${
          failedCount === 1 ? '' : 's'
        } Could Not Be Matched)`,
        status: 'warning',
      };
    }

    return {
      text: 'Copied JSON to Clipboard',
      status: 'success',
    };
  };

  return {
    handleCopyJson,
    cardToId,
  };
}
