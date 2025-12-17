import { createWriteStream } from 'fs'
import { SitemapStream, streamToPromise } from 'sitemap'
import { resolve } from 'path'

const sitemap = new SitemapStream({ hostname: 'https://packages.mytour.am' })

const routes = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/packages', changefreq: 'weekly', priority: 0.4 },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=85&roomId=94',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=83&roomId=94',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=84&roomId=94',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=81&roomId=93',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=77&roomId=0',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=82&roomId=94',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=97&roomId=92',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=74&roomId=94',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=13&roomId=94',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=78&roomId=92',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=92&roomId=104',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=93&roomId=94',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=79&roomId=92',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=3&roomId=92',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=80&roomId=92',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=75&roomId=19',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=91&roomId=94',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=7&roomId=101',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=76&roomId=101',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=73&roomId=94',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=28&roomId=115',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=30&roomId=13',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=19&roomId=78',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=24&roomId=127',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=5&roomId=101',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=8&roomId=1',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=72&roomId=101',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=6&roomId=1',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=4&roomId=13',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=10&roomId=92',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=29&roomId=101',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=2&roomId=92',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=1&roomId=92',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=95&roomId=90',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=11&roomId=101',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=27&roomId=3',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=22&roomId=101',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=26&roomId=100',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=23&roomId=247',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=14&roomId=94',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=9&roomId=101',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=17&roomId=94',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=18&roomId=104',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=16&roomId=101',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=21&roomId=12',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/package?city=1&adultsCount=2&childrenCount=0&childrenAges=&departureFlightId=1261&returnFlightId=1261&hotelId=12&roomId=105',
    changefreq: 'daily',
    priority: 0.9
  }
]

routes.forEach(route => sitemap.write(route))
sitemap.end()

streamToPromise(sitemap)
  .then(data => {
    const path = resolve('public', 'sitemap.xml')
    const writeStream = createWriteStream(path)
    writeStream.write(data.toString())
    console.log('Sitemap generated successfully.')
  })
  .catch(error => console.error('Error generating sitemap:', error))
