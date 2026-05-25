# Hotel amenities — guide for Product (MyTour)

**Prepared for:** Product / PM review  
**Date:** May 2026  
**Source:** Hotel search API (54 packages, Sharm El Sheikh)  
**Facility labels:** Official `FacilityDictionary` (English)

---

## Summary (TL;DR)

- Each hotel has one API field: `hotel.facilities` (e.g. `401250`).
- It is **not a count** — it is a **packed list of amenities** (*bitmask*).
- The website shows only amenities whose bit is ON, using labels from the dictionary below.
- This document lists **all 54 hotels** with decoded amenity names.

---

## 1. Official facility dictionary

| ID (bit) | Amenity name |
|----------|--------------|
| 0 | None |
| 1 | Cribs (upon request) |
| 2 | Water park |
| 4 | Water sports facilities on site |
| 8 | Evening entertainment |
| 16 | Kids' club |
| 32 | Game room |
| 64 | Garden |
| 128 | Spa |
| 256 | Non-smoking rooms |
| 512 | Beachfront |
| 1024 | Private beach area |
| 2048 | Beach chairs/Loungers |
| 4096 | Family rooms |
| 8192 | Children's playground |
| 16384 | Gym |
| 32768 | Anti shark net |
| 65536 | Free Wi-Fi in all areas |
| 131072 | Free private parking |
| 262144 | Daily housekeeping |

**How decoding works:** For each row above (except `0 = None`), the hotel has that amenity if `(hotel.facilities & ID) === ID`.

**Example — `hotel.facilities = 401250`:**
- Water park
- Game room
- Garden
- Non-smoking rooms
- Beachfront
- Private beach area
- Beach chairs/Loungers
- Family rooms
- Free private parking
- Daily housekeeping

---

## 2. All hotels and their amenities

| # | Hotel name | Offer ID | API number | Count | Amenities |
|---|------------|----------|------------|-------|-----------|
| 1 | Sharming Inn Hotels | 438917 | 7679 | 12 | Cribs (upon request), Water park, Water sports facilities on site, Evening entertainment, Kids' club, Game room, Garden, Spa, Non-smoking rooms, Private beach area, Beach chairs/Loungers, Family rooms |
| 2 | Turquoise Beach Hotel | 669159 | 19784 | 6 | Evening entertainment, Garden, Non-smoking rooms, Private beach area, Beach chairs/Loungers, Gym |
| 3 | Faraana Heights | 915877 | 89946 | 11 | Water park, Evening entertainment, Kids' club, Garden, Non-smoking rooms, Beachfront, Private beach area, Beach chairs/Loungers, Family rooms, Gym, Free Wi-Fi in all areas |
| 4 | Panorama Naama Heights | 740925 | 8192 | 1 | Children's playground |
| 5 | Rehana Sharm Resort  Aqua Park and Spa | 887342 | 30042 | 9 | Water park, Evening entertainment, Kids' club, Garden, Non-smoking rooms, Private beach area, Family rooms, Children's playground, Gym |
| 6 | Ghazala Gardens | 197894 | 11608 | 7 | Evening entertainment, Kids' club, Garden, Non-smoking rooms, Private beach area, Beach chairs/Loungers, Children's playground |
| 7 | Ghazala Beach | 324856 | 20445 | 11 | Cribs (upon request), Water sports facilities on site, Evening entertainment, Kids' club, Garden, Spa, Non-smoking rooms, Beachfront, Private beach area, Beach chairs/Loungers, Gym |
| 8 | Ivy Cyrene Sharm - Adults Only | 149796 | 19784 | 6 | Evening entertainment, Garden, Non-smoking rooms, Private beach area, Beach chairs/Loungers, Gym |
| 9 | Cataract Layalina Naama Bay | 262936 | 3784 | 6 | Evening entertainment, Garden, Spa, Beachfront, Private beach area, Beach chairs/Loungers |
| 10 | Ivy Cyrene Island Aqua Park Resort | 463133 | 11611 | 9 | Cribs (upon request), Water park, Evening entertainment, Kids' club, Garden, Non-smoking rooms, Private beach area, Beach chairs/Loungers, Children's playground |
| 11 | Seti Sharm | 430848 | 31614 | 12 | Water park, Water sports facilities on site, Evening entertainment, Kids' club, Game room, Garden, Non-smoking rooms, Beachfront, Beach chairs/Loungers, Family rooms, Children's playground, Gym |
| 12 | Rehana Royal Beach Resort Aqua Park and Spa | 575570 | 32763 | 14 | Cribs (upon request), Water park, Evening entertainment, Kids' club, Game room, Garden, Spa, Non-smoking rooms, Beachfront, Private beach area, Beach chairs/Loungers, Family rooms, Children's playground, Gym |
| 13 | Amwaj Oyoun Hotel and Resort | 240107 | 16350 | 12 | Water park, Water sports facilities on site, Evening entertainment, Kids' club, Garden, Spa, Non-smoking rooms, Beachfront, Private beach area, Beach chairs/Loungers, Family rooms, Children's playground |
| 14 | Gafy Resort | 718950 | 32587 | 11 | Cribs (upon request), Water park, Evening entertainment, Garden, Non-smoking rooms, Beachfront, Private beach area, Beach chairs/Loungers, Family rooms, Children's playground, Gym |
| 15 | Parrotel Beach Resort | 995758 | 26490 | 10 | Water park, Evening entertainment, Kids' club, Game room, Garden, Non-smoking rooms, Beachfront, Private beach area, Children's playground, Gym |
| 16 | Dreams Beach Resort | 235040 | 32606 | 12 | Water park, Water sports facilities on site, Evening entertainment, Kids' club, Garden, Non-smoking rooms, Beachfront, Private beach area, Beach chairs/Loungers, Family rooms, Children's playground, Gym |
| 17 | Continental Plaza Beach Resort | 477000 | 32635 | 13 | Cribs (upon request), Water park, Evening entertainment, Kids' club, Game room, Garden, Non-smoking rooms, Beachfront, Private beach area, Beach chairs/Loungers, Family rooms, Children's playground, Gym |
| 18 | Sharm Grand Plaza Resort | 531216 | 22393 | 10 | Cribs (upon request), Evening entertainment, Kids' club, Game room, Garden, Non-smoking rooms, Beachfront, Private beach area, Family rooms, Gym |
| 19 | Aurora Oriental | 984493 | 18297 | 9 | Cribs (upon request), Evening entertainment, Kids' club, Game room, Garden, Non-smoking rooms, Beachfront, Private beach area, Gym |
| 20 | Amphoras Beach | 487443 | 32760 | 12 | Evening entertainment, Kids' club, Game room, Garden, Spa, Non-smoking rooms, Beachfront, Private beach area, Beach chairs/Loungers, Family rooms, Children's playground, Gym |
| 21 | Marina Sharm Hotel | 841534 | 10220 | 9 | Water sports facilities on site, Evening entertainment, Game room, Garden, Spa, Non-smoking rooms, Beachfront, Private beach area, Children's playground |
| 22 | Royal Regency Club | 186679 | 32347 | 11 | Cribs (upon request), Water park, Evening entertainment, Kids' club, Garden, Beachfront, Private beach area, Beach chairs/Loungers, Family rooms, Children's playground, Gym |
| 23 | Xperience Kiroseiz Premier | 581523 | 32698 | 12 | Water park, Evening entertainment, Kids' club, Game room, Spa, Non-smoking rooms, Beachfront, Private beach area, Beach chairs/Loungers, Family rooms, Children's playground, Gym |
| 24 | Jaz Mirabel Beach | 208218 | 14232 | 8 | Evening entertainment, Kids' club, Spa, Non-smoking rooms, Beachfront, Private beach area, Family rooms, Children's playground |
| 25 | Barcelo Tiran | 669501 | 32664 | 10 | Evening entertainment, Kids' club, Spa, Non-smoking rooms, Beachfront, Private beach area, Beach chairs/Loungers, Family rooms, Children's playground, Gym |
| 26 | Naama Bay Hotel | 831971 | 13635 | 7 | Cribs (upon request), Water park, Garden, Non-smoking rooms, Private beach area, Family rooms, Children's playground |
| 27 | Concorde El Salam Front Area | 212615 | 30586 | 11 | Water park, Evening entertainment, Kids' club, Game room, Garden, Non-smoking rooms, Beachfront, Private beach area, Family rooms, Children's playground, Gym |
| 28 | Reef Oasis Blue Bay Resort | 885944 | 1166 | 5 | Water park, Water sports facilities on site, Evening entertainment, Spa, Private beach area |
| 29 | Jaz Sharm Dreams Resort | 508201 | 19930 | 9 | Water park, Evening entertainment, Kids' club, Garden, Spa, Non-smoking rooms, Private beach area, Beach chairs/Loungers, Gym |
| 30 | Reef Oasis Beach Resort | 993877 | 22170 | 8 | Water park, Evening entertainment, Kids' club, Spa, Beachfront, Private beach area, Family rooms, Gym |
| 31 | V Hotel (ex. Pyramisa Beach Resort) | 567491 | 30554 | 10 | Water park, Evening entertainment, Kids' club, Garden, Non-smoking rooms, Beachfront, Private beach area, Family rooms, Children's playground, Gym |
| 32 | Albatros Laguna Club Resort | 888189 | 19784 | 6 | Evening entertainment, Garden, Non-smoking rooms, Private beach area, Beach chairs/Loungers, Gym |
| 33 | Novotel Palm Resort | 281934 | 32088 | 9 | Evening entertainment, Kids' club, Garden, Non-smoking rooms, Private beach area, Beach chairs/Loungers, Family rooms, Children's playground, Gym |
| 34 | Charmillion Club Resort | 759500 | 28633 | 11 | Cribs (upon request), Evening entertainment, Kids' club, Garden, Spa, Non-smoking rooms, Beachfront, Private beach area, Beach chairs/Loungers, Children's playground, Gym |
| 35 | Jaz Belvedere Resort | 503327 | 13976 | 7 | Evening entertainment, Kids' club, Spa, Beachfront, Private beach area, Family rooms, Children's playground |
| 36 | Movenpick Resort Sharm El Sheikh | 106044 | 32760 | 12 | Evening entertainment, Kids' club, Game room, Garden, Spa, Non-smoking rooms, Beachfront, Private beach area, Beach chairs/Loungers, Family rooms, Children's playground, Gym |
| 37 | Sentido Reef Oasis | 605847 | 32222 | 12 | Water park, Water sports facilities on site, Evening entertainment, Kids' club, Garden, Spa, Non-smoking rooms, Private beach area, Beach chairs/Loungers, Family rooms, Children's playground, Gym |
| 38 | Jaz Fayrouz Resort | 673679 | 5968 | 6 | Kids' club, Garden, Non-smoking rooms, Beachfront, Private beach area, Family rooms |
| 39 | Albatros Royal Grand - Adult Only +16 | 682178 | 20328 | 8 | Evening entertainment, Game room, Garden, Non-smoking rooms, Beachfront, Private beach area, Beach chairs/Loungers, Gym |
| 40 | Jaz Fanara Resort | 292659 | 22360 | 8 | Evening entertainment, Kids' club, Garden, Non-smoking rooms, Beachfront, Private beach area, Family rooms, Gym |
| 41 | Novotel Beach Resort | 879551 | 16280 | 9 | Evening entertainment, Kids' club, Spa, Non-smoking rooms, Beachfront, Private beach area, Beach chairs/Loungers, Family rooms, Children's playground |
| 42 | Pickalbatros Laguna Vista Beach Resort | 744460 | 6016 | 5 | Spa, Non-smoking rooms, Beachfront, Private beach area, Family rooms |
| 43 | Cleopatra Luxury Resort | 498283 | 32698 | 12 | Water park, Evening entertainment, Kids' club, Game room, Spa, Non-smoking rooms, Beachfront, Private beach area, Beach chairs/Loungers, Family rooms, Children's playground, Gym |
| 44 | Albatros Aqua Park Sharm | 564693 | 30042 | 9 | Water park, Evening entertainment, Kids' club, Garden, Non-smoking rooms, Private beach area, Family rooms, Children's playground, Gym |
| 45 | Maritim Jolie Ville Resort and Casino | 213903 | 28536 | 10 | Evening entertainment, Kids' club, Game room, Garden, Non-smoking rooms, Beachfront, Private beach area, Beach chairs/Loungers, Children's playground, Gym |
| 46 | Monte Carlo Sharm El Sheikh Resort | 982375 | 20314 | 9 | Water park, Evening entertainment, Kids' club, Garden, Non-smoking rooms, Beachfront, Private beach area, Beach chairs/Loungers, Gym |
| 47 | Pick Albatros Palace Sharm | 705952 | 13954 | 6 | Water park, Spa, Beachfront, Private beach area, Family rooms, Children's playground |
| 48 | Iberotel Palace - Adult Only +16 | 320162 | 20296 | 7 | Evening entertainment, Garden, Non-smoking rooms, Beachfront, Private beach area, Beach chairs/Loungers, Gym |
| 49 | Coral Sea Sensatori | 732922 | 32714 | 11 | Water park, Evening entertainment, Garden, Spa, Non-smoking rooms, Beachfront, Private beach area, Beach chairs/Loungers, Family rooms, Children's playground, Gym |
| 50 | Sunrise Grand Select Diamond Resort | 638212 | 32762 | 13 | Water park, Evening entertainment, Kids' club, Game room, Garden, Spa, Non-smoking rooms, Beachfront, Private beach area, Beach chairs/Loungers, Family rooms, Children's playground, Gym |
| 51 | Baron Palms Resort - Adult only +16 | 135229 | 17736 | 5 | Evening entertainment, Garden, Non-smoking rooms, Private beach area, Gym |
| 52 | Steigenberger Alcazar | 311610 | 32764 | 13 | Water sports facilities on site, Evening entertainment, Kids' club, Game room, Garden, Spa, Non-smoking rooms, Beachfront, Private beach area, Beach chairs/Loungers, Family rooms, Children's playground, Gym |
| 53 | Rixos Radamis Sharm El Sheikh | 466814 | 24440 | 10 | Evening entertainment, Kids' club, Game room, Garden, Non-smoking rooms, Beachfront, Private beach area, Beach chairs/Loungers, Family rooms, Gym |
| 54 | Rixos Sharm Hotel - Adult Only +18 | 192933 | 32584 | 9 | Evening entertainment, Garden, Non-smoking rooms, Beachfront, Private beach area, Beach chairs/Loungers, Family rooms, Children's playground, Gym |

---

## 3. Prompt for Claude (copy-paste)

```
You are helping decode MyTour hotel amenities.

hotel.facilities is a bitmask. Each amenity has a fixed bit ID.
Include amenity X only if (hotel.facilities & X) === X.

Official FacilityDictionary (English):
0 None
1 Cribs (upon request)
2 Water park
4 Water sports facilities on site
8 Evening entertainment
16 Kids' club
32 Game room
64 Garden
128 Spa
256 Non-smoking rooms
512 Beachfront
1024 Private beach area
2048 Beach chairs/Loungers
4096 Family rooms
8192 Children's playground
16384 Gym
32768 Anti shark net
65536 Free Wi-Fi in all areas
131072 Free private parking
262144 Daily housekeeping

Decode hotel.facilities = [PASTE NUMBER HERE].
Return: (1) amenity names, (2) matched bit IDs.
```

---

## 4. Technical reference

- **UI:** Hotel detail → Amenities (`HotelPackageDetails`)
- **Logic:** `facilities.filter(({ key }) => hotel.facilities & key)`
- **Dictionary API:** `FacilityDictionary`

---

## 5. Related document

Per-hotel detail with bit keys: `docs/hotel-facilities-by-hotel.md`
