// Very lightweight NL parser turning user text into a MongoDB filter
function parsePromptToFilter(prompt) {
    const text = (prompt || '').toLowerCase();
    const filter = { VariantType: 'Normal' };
    let limit = 50;

    // Random selection intent: "random" or "random card"
    if (/\brandom(?:\s+card)?\b/.test(text)) {
        filter._random = true;
        limit = 1;
    }

    // Cost extraction: handle numerals and number words, and richer phrasing
    // Examples: "cost 2", "costs 2", "with cost 2", "cost of 2", "2 cost", "2-cost", "resource cost equal to one"
    const numberWords = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
    let costMatch = text.match(/\bcosts?\s*(?:of\s*)?(\d{1,2})\b/);
    if (!costMatch) costMatch = text.match(/\b(\d{1,2})\s*-?\s*cost\b/);
    if (!costMatch) costMatch = text.match(/\b(?:resource\s+)?cost\s*(?:is|=|equal\s+to|of|:)?\s*(\d{1,2})\b/);
    if (!costMatch) {
        const wordCost = text.match(/\b(?:resource\s+)?cost\s*(?:is|=|equal\s+to|of|:)?\s*(one|two|three|four|five|six|seven|eight|nine|ten)\b/);
        if (wordCost) {
            costMatch = [, String(numberWords[wordCost[1]])];
        }
    }
    if (costMatch) filter.Cost = String(costMatch[1]);

    // Single result intents: "one", "a", "an" (word boundaries), but only if no cost was parsed
    if (!filter.Cost && /\b(one|a|an)\b/.test(text)) {
        limit = 1;
    }

    // Aspects detection (normalize words to canonical aspects and avoid false positives)
    const knownAspects = ['aggression', 'villainy', 'heroism', 'cunning', 'command', 'vigilance'];
    // Single alias map includes misspellings, synonyms, and color-to-aspect mappings
    const aspectAliases = {
        'agression': 'aggression',
        'hero': 'heroism',
        'villain': 'villainy',
        'green': 'command',
        'white': 'heroism',
        'black': 'villainy',
        'blue': 'vigilance',
        'red': 'aggression',
        'yellow': 'cunning'
    };
    const words = text.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
    const aspects = new Set();
    for (let word of words) {
        if (aspectAliases[word]) word = aspectAliases[word];
        if (knownAspects.includes(word)) {
            aspects.add(word.charAt(0).toUpperCase() + word.slice(1));
        }
    }
    if (aspects.size > 0) {
        filter.Aspects = { $all: Array.from(aspects) };
    }

    // Support "only" qualifier for mono-aspect queries, including fillers like "the" and "aspect"
    // Detect patterns both before and after the aspect word/color/synonym
    const aspectTokens = [...knownAspects, ...Object.keys(aspectAliases)].join('|');
    const onlyPatternAfter = new RegExp(`\\b(${aspectTokens})(?:\\s+aspect[s]?)?\\s+only\\b`);
    const onlyPatternBefore = new RegExp(`\\bonly\\s+(?:the\\s+)?(${aspectTokens})(?:\\s+aspect[s]?)?\\b`);
    let onlyMatch = text.match(onlyPatternAfter) || text.match(onlyPatternBefore);
    if (!onlyMatch) {
        // Also recognize common shorthand like "mono villainy"
        const monoPattern = new RegExp(`\\bmono\\s+(${aspectTokens})\\b`);
        onlyMatch = text.match(monoPattern);
    }
    if (onlyMatch && onlyMatch[1]) {
        let onlyWord = onlyMatch[1];
        if (aspectAliases[onlyWord]) onlyWord = aspectAliases[onlyWord];
        if (knownAspects.includes(onlyWord)) {
            const onlyAspect = onlyWord.charAt(0).toUpperCase() + onlyWord.slice(1);
            // Ensure the filter requires exactly one aspect and that it matches the requested one
            filter.Aspects = { $all: [onlyAspect] };
            // Guard against documents missing Aspects by treating null as []
            filter.$expr = { $eq: [{ $size: { $ifNull: ["$Aspects", []] } }, 1] };
        }
    }

    // Ensure leaders are included when aspects imply them; otherwise we might miss leaders like Mon Mothma
    // Only set Type if user explicitly asked for one; we won't default Type to Unit

    // Rarity detection
    const rarities = ['common', 'uncommon', 'rare', 'legendary', 'special'];
    const rarity = rarities.find(r => text.includes(r));
    if (rarity) {
        filter.Rarity = rarity.charAt(0).toUpperCase() + rarity.slice(1);
    }

    // Type detection (Leader, Base, Unit, Event, Upgrade, etc.)
    const types = ['leader', 'base', 'unit', 'event', 'upgrade'];
    const type = types.find(t => text.includes(t));
    if (type) {
        filter.Type = type.charAt(0).toUpperCase() + type.slice(1);
    }

    // Set detection (LOF, JTL, SOR, etc.)
    const setMatch = text.match(/\b(lof|jtl|sor|twi|shd)\b/);
    if (setMatch) {
        filter.Set = setMatch[1].toUpperCase();
    }

    // If we extracted at least one non-default constraint besides VariantType, use it
    const keys = Object.keys(filter).filter(k => k !== 'VariantType');
    const hasMeaningful = keys.length > 0;
    return { filter, limit, hasMeaningful };
}

module.exports = { parsePromptToFilter };


