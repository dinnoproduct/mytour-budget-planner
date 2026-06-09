const VENUE = {
  name: "Boris Paichadze Dinamo Arena",
  address: "2 Akaki Tsereteli Ave, Tbilisi",
  lat: 41.7205,
  lon: 44.7872,
};

const MYTOUR = {
  name: "Mytour Collection Point",
  lat: 41.7212,
  lon: 44.7886,
  detail: "Ticket distribution and group meet-up on Akaki Tsereteli Ave, next to the arena.",
};

const PICKUP = {
  name: "Mytour Coach Park",
  lat: 41.7186,
  lon: 44.7948,
  walk: "~7 min walk east of the arena, on the Mtkvari embankment",
  detail: "Shared staging area for Groups 2-5. Coaches can split north to Tbilisi Sea, across the bridges to Avlabari/Ortachala, or south to the centre.",
};

const GROUPS = [
  {
    id: 1,
    color: "#0b69ff",
    hotel: "Holiday Inn Tbilisi",
    addr: "1, 26 May Square / Pekini Avenue 1, 0171",
    lat: 41.7250,
    lon: 44.7915,
    dist: "~0.8 km",
    drive: "4 min drive or 10 min walk",
    area: "Heroes Square / 26 May Square, closest hotel",
    route: "Use Tamar Mepe Ave and Akaki Tsereteli Ave. Walking is likely faster pre-show.",
    pickup: null,
    check: "Address confirmed by IHG and Yandex, which lists Pekini Avenue 1 for the same hotel.",
  },
  {
    id: 2,
    color: "#319795",
    hotel: "Radisson Blu Iveria Hotel",
    addr: "1 First Republic Square, 0108",
    lat: 41.7064,
    lon: 44.7906,
    dist: "~1.8 km",
    drive: "7 min",
    area: "Rose Revolution Square / city centre",
    route: "Use Akaki Tsereteli Ave / Tamar Mepe Ave toward the arena; reverse toward Rose Revolution Square.",
    pickup: "shared",
    check: "Address confirmed by Radisson, Booking, and Yandex.",
  },
  {
    id: 3,
    color: "#ff8f27",
    hotel: "Ramada by Wyndham Tbilisi Old City",
    addr: "14 Aleksandre Tsurtsumia St, 0103",
    lat: 41.692385,
    lon: 44.822977,
    dist: "~5 km",
    drive: "12-15 min",
    area: "Avlabari / Old City, across the river southeast",
    route: "Use the Mtkvari embankment, Saarbrucken or Baratashvili Bridge, then Avlabari.",
    pickup: "shared",
    check: "Address and coordinates confirmed by Yandex and hotel aggregators.",
  },
  {
    id: 4,
    color: "#805ad5",
    hotel: "Biography Design Tbilisi",
    addr: "15 Bezhan Kalandadze St, 0114",
    lat: 41.680579,
    lon: 44.818854,
    dist: "~6 km",
    drive: "14-17 min",
    area: "Ortachala / Krtsanisi, far south",
    route: "Use the river embankment south, then Gorgasali / Ortachala toward Bezhan Kalandadze.",
    pickup: "shared",
    check: "Official hotel listings show No. 15. Yandex has a conflicting Biography Tbilisi listing at 12A, so confirm the driver entrance.",
  },
  {
    id: 5,
    color: "#d53f8c",
    hotel: "Gino Seaside Tbilisi",
    addr: "20 Beshenova St, 0162",
    lat: 41.7448,
    lon: 44.8316,
    dist: "~7 km",
    drive: "15-18 min",
    area: "Tbilisi Sea, far north",
    route: "Use Akaki Tsereteli Ave north, then the main arteries toward Tbilisi Sea / Beshenova St.",
    pickup: "shared",
    check: "Address confirmed by Yandex and local listings.",
  },
];

const map = L.map("map", { scrollWheelZoom: true }).setView([41.715, 44.805], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap",
}).addTo(map);

function googleRouteLink(origin, destination) {
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
}

function yandexRouteLink(origin, destination) {
  return `https://yandex.com/maps/?rtext=${origin}~${destination}&rtt=auto`;
}

function yandexPointLink(point) {
  return `https://yandex.com/maps/?ll=${point.lon}%2C${point.lat}&z=17&pt=${point.lon}%2C${point.lat}`;
}

function pointString(point) {
  return `${point.lat},${point.lon}`;
}

function marker(lat, lon, color, label) {
  return L.circleMarker([lat, lon], {
    radius: 9,
    color: "#fff",
    weight: 2,
    fillColor: color,
    fillOpacity: 1,
  }).bindTooltip(label, { direction: "top" });
}

const venueIcon = L.divIcon({
  className: "",
  html: '<div style="width:20px;height:20px;background:#e50b32;border:3px solid #fff;border-radius:5px;box-shadow:0 0 0 1px #00000022"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

L.marker([VENUE.lat, VENUE.lon], { icon: venueIcon })
  .addTo(map)
  .bindPopup(`<div class="popup-title">${VENUE.name}</div>${VENUE.address}`);

const mytourIcon = L.divIcon({
  className: "",
  html: '<div style="width:22px;height:22px;background:#05ca6c;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 1px #00000022;color:#fff;font-size:13px;font-weight:900;text-align:center;line-height:17px">T</div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

L.marker([MYTOUR.lat, MYTOUR.lon], { icon: mytourIcon })
  .addTo(map)
  .bindPopup(`<div class="popup-title" style="color:#00ae4e">${MYTOUR.name}</div>${MYTOUR.detail}`);

const parkIcon = L.divIcon({
  className: "",
  html: '<div style="width:18px;height:18px;background:#ff8f27;border:3px solid #fff;transform:rotate(45deg);box-shadow:0 0 0 1px #00000022"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

L.marker([PICKUP.lat, PICKUP.lon], { icon: parkIcon })
  .addTo(map)
  .bindPopup(`<div class="popup-title" style="color:#cc5c00">${PICKUP.name}</div>${PICKUP.walk}<br><span style="color:#718096">${PICKUP.detail}</span>`);

L.polyline([[VENUE.lat, VENUE.lon], [PICKUP.lat, PICKUP.lon]], {
  color: "#cc5c00",
  weight: 2.5,
  opacity: .6,
  dashArray: "4,5",
}).addTo(map);

const bounds = [
  [VENUE.lat, VENUE.lon],
  [MYTOUR.lat, MYTOUR.lon],
  [PICKUP.lat, PICKUP.lon],
];

const cards = document.getElementById("cards");
const legend = document.getElementById("legend");

legend.innerHTML = `
  <b>Groups</b>
  ${GROUPS.map((g) => `<div><i style="background:${g.color}"></i>${g.id} - ${g.hotel.replace(" Tbilisi", "")}</div>`).join("")}
  <div style="margin-top:5px"><i style="background:#e50b32;border-radius:3px"></i>Dinamo Arena</div>
  <div><i style="background:#05ca6c"></i>Mytour collection point</div>
  <div><i style="background:#ff8f27;border-radius:2px"></i>Shared coach park</div>
`;

GROUPS.forEach((group) => {
  bounds.push([group.lat, group.lon]);

  marker(group.lat, group.lon, group.color, `G${group.id} - ${group.hotel}`)
    .addTo(map)
    .bindPopup(`<div class="popup-title" style="color:${group.color}">Group ${group.id} - ${group.hotel}</div>${group.addr}<br><b>${group.dist}</b> to arena, ${group.drive}`);

  L.polyline([[group.lat, group.lon], [VENUE.lat, VENUE.lon]], {
    color: group.color,
    weight: 3,
    opacity: .7,
  }).addTo(map);

  const hotelPoint = pointString(group);
  const venuePoint = pointString(VENUE);
  const pickupPoint = pointString(PICKUP);
  const toArenaGoogle = googleRouteLink(hotelPoint, venuePoint);
  const toArenaYandex = yandexRouteLink(hotelPoint, venuePoint);

  let pickupHtml = "";
  if (group.pickup === null) {
    pickupHtml = `
      <div class="pickup walk">
        <div class="pickup-title">Post-event</div>
        <div style="margin-top:4px;color:#1a202c"><b>No coach pickup. Walk back.</b></div>
        <div style="margin-top:3px">The hotel is around 0.8 km from the arena, usually faster on foot than waiting for the egress to clear.</div>
      </div>
    `;
  } else {
    pickupHtml = `
      <div class="pickup">
        <div class="pickup-title">Post-event pickup</div>
        <div style="margin-top:4px;color:#1a202c"><b>${PICKUP.name}</b>, ${PICKUP.walk}</div>
        <div style="margin-top:3px">All Groups 2-5 coaches park here; this group's coach then heads to its hotel.</div>
        <div class="links">
          <a class="primary" target="_blank" rel="noreferrer" href="${yandexRouteLink(pickupPoint, hotelPoint)}">Yandex pickup to hotel</a>
          <a target="_blank" rel="noreferrer" href="${googleRouteLink(pickupPoint, hotelPoint)}">Google pickup to hotel</a>
          <a target="_blank" rel="noreferrer" href="${yandexPointLink(PICKUP)}">Coach park pin</a>
        </div>
      </div>
    `;
  }

  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <div class="card-top">
      <span class="dot" style="background:${group.color}"></span>
      <div>
        <div class="group-title">Group ${group.id} - ${group.hotel}</div>
        <div class="group-area">${group.area}</div>
      </div>
      <span class="pill" style="background:${group.color}">${group.dist}</span>
    </div>
    <div class="card-body">
      <div class="row"><span class="row-label">Address</span><div>${group.addr}</div></div>
      <div class="row"><span class="row-label">To arena</span><div><b>${group.drive}</b>. ${group.route}</div></div>
      <div class="row"><span class="row-label">Tickets</span><div>Collect tickets at the <b>Mytour Collection Point</b> next to the arena before entry.</div></div>
      <div class="row"><span class="row-label">Check</span><div>${group.check}</div></div>
      <div class="links">
        <a class="primary" target="_blank" rel="noreferrer" href="${toArenaYandex}">Yandex hotel to arena</a>
        <a target="_blank" rel="noreferrer" href="${toArenaGoogle}">Google hotel to arena</a>
      </div>
      ${pickupHtml}
    </div>
  `;

  card.querySelector(".card-top").addEventListener("click", () => {
    card.classList.toggle("open");
  });

  cards.appendChild(card);
});

if (cards.firstElementChild) {
  cards.firstElementChild.classList.add("open");
}

map.fitBounds(bounds, { padding: [60, 60] });
