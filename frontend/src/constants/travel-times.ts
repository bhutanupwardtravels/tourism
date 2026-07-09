export const TRAVEL_TIMES: Record<string, Record<string, number>> = {
    // Duration in hours
    "thimphu": {
        "paro": 1.5,
        "punakha": 2.5,
        "wangdue": 2.5,
        "gangtey": 4.5,
        "bumthang": 9,
        "trongsa": 6,
        "hkaa": 4
    },
    "paro": {
        "thimphu": 1.5,
        "punakha": 3.5,
        "wangdue": 3.5,
        "hkaa": 2.5,
        "gangtey": 5.5
    },
    "punakha": {
        "thimphu": 2.5,
        "paro": 3.5,
        "wangdue": 0.5,
        "gangtey": 2.5,
        "trongsa": 4.5,
        "bumthang": 7.5
    },
    "wangdue": {
        "thimphu": 2.5,
        "paro": 3.5,
        "punakha": 0.5,
        "gangtey": 2,
        "trongsa": 4,
        "bumthang": 7
    },
    "gangtey": {
        "thimphu": 4.5,
        "paro": 5.5,
        "punakha": 2.5,
        "wangdue": 2,
        "trongsa": 2.5,
        "bumthang": 5.5
    },
    "trongsa": {
        "thimphu": 6,
        "punakha": 4.5,
        "wangdue": 4,
        "gangtey": 2.5,
        "bumthang": 2.5
    },
    "bumthang": {
        "thimphu": 9,
        "punakha": 7.5,
        "wangdue": 7,
        "gangtey": 5.5,
        "trongsa": 2.5,
        "mongar": 6
    },
    "hkaa": {
        "paro": 2.5,
        "thimphu": 4
    }
};

export function getTravelTime(from: string, to: string): number {
    if (!from || !to) return 0;

    const fromKey = from.toLowerCase();
    const toKey = to.toLowerCase();

    // Direct lookup
    if (TRAVEL_TIMES[fromKey]?.[toKey]) {
        return TRAVEL_TIMES[fromKey][toKey];
    }

    // Reverse lookup
    if (TRAVEL_TIMES[toKey]?.[fromKey]) {
        return TRAVEL_TIMES[toKey][fromKey];
    }

    return 0; // Default if not found
}
