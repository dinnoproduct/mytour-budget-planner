export interface CyprusHotel {
  id: number
  name: string
  stars: number
  area: string
  city: string
  pricePerNight: number // AMD per person
  vibe: string[]
  image: string
  mytourSlug: string
}

// Unsplash hotel/resort images — reliable public URLs
const IMG = {
  resort1: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop&q=80',
  resort2: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop&q=80',
  pool1: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop&q=80',
  pool2: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop&q=80',
  beach1: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop&q=80',
  beach2: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&h=400&fit=crop&q=80',
  luxury1: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop&q=80',
  luxury2: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop&q=80',
  coastal1: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&h=400&fit=crop&q=80',
  coastal2: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=600&h=400&fit=crop&q=80',
  hotel1: 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=600&h=400&fit=crop&q=80',
  hotel2: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop&q=80',
  spa1: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&h=400&fit=crop&q=80',
  sea1: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=600&h=400&fit=crop&q=80',
  city1: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=400&fit=crop&q=80',
  family1: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&h=400&fit=crop&q=80',
}

export const CYPRUS_HOTELS: CyprusHotel[] = [
  {
    id: 220,
    name: 'NissiBlu Beach Resort',
    stars: 5,
    area: 'Nissi Beach',
    city: 'Ayia Napa',
    pricePerNight: 55_000,
    vibe: ['beach', 'party'],
    image: IMG.resort1,
    mytourSlug: 'nissiblu-beach-resort',
  },
  {
    id: 221,
    name: 'Gaia Sun N Blue',
    stars: 4,
    area: 'Makronissos',
    city: 'Ayia Napa',
    pricePerNight: 38_000,
    vibe: ['beach', 'chill'],
    image: IMG.pool1,
    mytourSlug: 'gaia-sun-n-blue',
  },
  {
    id: 222,
    name: 'San Remo Hotel',
    stars: 3,
    area: 'Larnaca Center',
    city: 'Larnaca',
    pricePerNight: 22_000,
    vibe: ['chill', 'beach'],
    image: IMG.hotel1,
    mytourSlug: 'san-remo-hotel',
  },
  {
    id: 223,
    name: 'Napa Jay Hotel',
    stars: 3,
    area: 'Ayia Napa Center',
    city: 'Ayia Napa',
    pricePerNight: 20_000,
    vibe: ['party', 'beach'],
    image: IMG.coastal1,
    mytourSlug: 'napa-jay-hotel',
  },
  {
    id: 224,
    name: 'Tasia Maris Oasis',
    stars: 4,
    area: 'Nissi Avenue',
    city: 'Ayia Napa',
    pricePerNight: 35_000,
    vibe: ['family', 'beach'],
    image: IMG.family1,
    mytourSlug: 'tasia-maris-oasis',
  },
  {
    id: 225,
    name: 'Tasia Maris Beach',
    stars: 4,
    area: 'Nissi Beach',
    city: 'Ayia Napa',
    pricePerNight: 40_000,
    vibe: ['beach', 'family'],
    image: IMG.beach1,
    mytourSlug: 'tasia-maris-beach',
  },
  {
    id: 226,
    name: 'Pavlo Napa Beach Hotel',
    stars: 4,
    area: 'Ayia Napa Center',
    city: 'Ayia Napa',
    pricePerNight: 42_000,
    vibe: ['beach', 'party'],
    image: IMG.resort2,
    mytourSlug: 'pavlo-napa-beach-hotel',
  },
  {
    id: 227,
    name: 'Napa Mermaid Hotel & Suites',
    stars: 3,
    area: 'Ayia Napa Center',
    city: 'Ayia Napa',
    pricePerNight: 25_000,
    vibe: ['chill', 'family'],
    image: IMG.pool2,
    mytourSlug: 'napa-mermaid-hotel-suites',
  },
  {
    id: 228,
    name: 'Chrysomare Beach Hotel',
    stars: 4,
    area: 'Protaras',
    city: 'Protaras',
    pricePerNight: 36_000,
    vibe: ['family', 'beach'],
    image: IMG.beach2,
    mytourSlug: 'chrysomare-beach-hotel',
  },
  {
    id: 229,
    name: 'Sunrise Pearl Hotel & Spa',
    stars: 5,
    area: 'Protaras',
    city: 'Protaras',
    pricePerNight: 50_000,
    vibe: ['chill', 'family'],
    image: IMG.spa1,
    mytourSlug: 'sunrise-pearl-hotel-spa',
  },
  {
    id: 230,
    name: 'Limanaki Beach Hotel',
    stars: 3,
    area: 'Ayia Napa Harbor',
    city: 'Ayia Napa',
    pricePerNight: 24_000,
    vibe: ['beach', 'chill'],
    image: IMG.sea1,
    mytourSlug: 'limanaki-beach-hotel',
  },
  {
    id: 231,
    name: 'Adams Beach Hotel',
    stars: 5,
    area: 'Nissi Beach',
    city: 'Ayia Napa',
    pricePerNight: 52_000,
    vibe: ['beach', 'family'],
    image: IMG.luxury1,
    mytourSlug: 'adams-beach-hotel',
  },
  {
    id: 232,
    name: 'Amavi Hotel',
    stars: 5,
    area: 'Paphos',
    city: 'Paphos',
    pricePerNight: 48_000,
    vibe: ['chill', 'family'],
    image: IMG.luxury2,
    mytourSlug: 'amavi-hotel',
  },
  {
    id: 233,
    name: 'Cavo Maris Beach Hotel',
    stars: 3,
    area: 'Protaras',
    city: 'Protaras',
    pricePerNight: 26_000,
    vibe: ['family', 'beach'],
    image: IMG.coastal2,
    mytourSlug: 'cavo-maris-beach-hotel',
  },
  {
    id: 287,
    name: 'Achilleos City Hotel',
    stars: 2,
    area: 'Larnaca Center',
    city: 'Larnaca',
    pricePerNight: 15_000,
    vibe: ['chill'],
    image: IMG.city1,
    mytourSlug: 'achilleos-city-hotel',
  },
  {
    id: 290,
    name: 'Lordos Beach Hotel & Spa',
    stars: 4,
    area: 'Larnaca Bay',
    city: 'Larnaca',
    pricePerNight: 32_000,
    vibe: ['beach', 'family'],
    image: IMG.hotel2,
    mytourSlug: 'lordos-beach-hotel',
  },
]

export interface FlightSchedule {
  month: string
  departureDay: number
  returnDayOffset: Record<number, number>
  pricePerPerson: number
}

export const FLIGHT_SCHEDULES: FlightSchedule[] = [
  { month: 'june', departureDay: 1, returnDayOffset: { 5: 5, 7: 7, 10: 10, 14: 14 }, pricePerPerson: 95_000 },
  { month: 'july', departureDay: 1, returnDayOffset: { 5: 5, 7: 7, 10: 10, 14: 14 }, pricePerPerson: 110_000 },
  { month: 'august', departureDay: 1, returnDayOffset: { 5: 5, 7: 7, 10: 10, 14: 14 }, pricePerPerson: 115_000 },
  { month: 'september', departureDay: 1, returnDayOffset: { 5: 5, 7: 7, 10: 10, 14: 14 }, pricePerPerson: 90_000 },
  { month: 'october', departureDay: 1, returnDayOffset: { 5: 5, 7: 7, 10: 10, 14: 14 }, pricePerPerson: 80_000 },
]

export const MONTH_DATES: Record<string, { year: number; monthIndex: number }> = {
  june: { year: 2025, monthIndex: 5 },
  july: { year: 2025, monthIndex: 6 },
  august: { year: 2025, monthIndex: 7 },
  september: { year: 2025, monthIndex: 8 },
  october: { year: 2025, monthIndex: 9 },
}

export const WIZZ_AIR_BOOKING_URL = 'https://wizzair.com/en-gb/flights/EVN/LCA'
