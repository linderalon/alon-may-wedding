export type Lang = "en" | "he";

export const translations = {
  en: {
    // nav
    ourStory:       "Our Story",
    polyWedding:    "Poly-Wedding",
    confessionWall: "Confession Wall",

    // hero
    saveTheDate:    "Save the Date",
    names:          "Alon & May",
    subtitle:       "We're getting married",
    dateLabel:      "Date",
    dateValue:      "October 14th, 2026",
    venueLabel:     "Venue",
    venueValue:     "Tzel HaHoresh, Beit Berel",
    scroll:         "Scroll",

    // timeline slides
    whereWeFirstMet: "Where We First Met",
    ourFirstDate:    "Our First Date",
  },
  he: {
    // nav
    ourStory:       "הסיפור שלנו",
    polyWedding:    "הימורי חתונה",
    confessionWall: "קיר הוידויים",

    // hero
    saveTheDate:    "שמרו את התאריך",
    names:          "מאי & אלון",
    subtitle:       "!אנחנו מתחתנים",
    dateLabel:      "תאריך",
    dateValue:      "14 באוקטובר 2026",
    venueLabel:     "מיקום",
    venueValue:     "צל החורש, בית ברל",
    scroll:         "גללו למטה",

    // timeline slides
    whereWeFirstMet: "איך הכרנו",
    ourFirstDate:    "הדייט הראשון שלנו",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
