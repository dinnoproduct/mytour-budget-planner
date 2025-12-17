import * as fs from 'node:fs'

const packagesList = []

const generatedUrls = packagesList.map(packageItem => {
  const city = packageItem.city.id
  const departureFlightId = packageItem.destinationFlight.id
  const returnFlightId = packageItem.returnFlight.id
  const hotelId = packageItem.hotel.id
  const roomId = packageItem.roomType

  const url = `/package?city=${city}&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=${departureFlightId}&returnFlightId=${returnFlightId}&hotelId=${hotelId}&roomId=${roomId}`

  return { url, changefreq: 'daily', priority: 0.9 }
})

// write in file
fs.writeFileSync('packageUrls.json', JSON.stringify(generatedUrls, null, 2))
