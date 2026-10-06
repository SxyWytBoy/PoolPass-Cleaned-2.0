import type { IndoorOutdoor } from '@/types/supabase';

/**
 * Real UK hotel pools that offer day access to non-residents.
 *
 * These are information-only listings: facts, a link to the venue's own website,
 * and no prices, reviews or booking. PoolPass is not affiliated with them.
 * When a host publishes a pool linked to one of these venues (pools.venue_slug),
 * the bookable listing replaces the venue card automatically.
 *
 * Facilities and day access are set by each venue and can change.
 */
export const VENUES_CHECKED = 'October 2026';

export interface Venue {
  slug: string;
  name: string;
  area: string;
  region: string;
  indoorOutdoor: IndoorOutdoor;
  summary: string;
  facilities: string[];
  dayAccess: string;
  url: string;
  /** Illustrative image only, not a photo of this venue. */
  image: string;
}

const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=1050&q=80&auto=format&fit=crop`;

export const VENUES: Venue[] = [
  {
    slug: 'corinthia-london',
    name: 'Corinthia London',
    area: 'Whitehall, London',
    region: 'London',
    indoorOutdoor: 'indoor',
    summary: 'ESPA Life at Corinthia is one of London’s largest hotel spas, with a thermal floor built around an indoor swimming pool and a vitality pool.',
    facilities: ['Indoor swimming pool', 'Vitality pool', 'Amphitheatre sauna', 'Ice fountain', 'Sleep pods'],
    dayAccess: 'Day spa experiences and spa passes can be booked by non-residents.',
    url: 'https://www.corinthia.com/en-gb/london/spa-at-corinthia-london/day-spa-experiences/',
    image: img('1575429198097-0414ec08e8cd'),
  },
  {
    slug: 'edwardian-manchester',
    name: 'The Edwardian Manchester',
    area: 'Peter Street, Manchester',
    region: 'North West',
    indoorOutdoor: 'indoor',
    summary: 'A Radisson Collection hotel in the former Free Trade Hall, with a spa and a deck-level pool in the city centre.',
    facilities: ['12m deck-level pool', 'Jacuzzi', 'Sauna', 'Steam room', 'Gym'],
    dayAccess: 'Non-guests can book a 2.5-hour Leisure Pass by phone.',
    url: 'https://www.radissonhotels.com/en-us/hotels/radisson-collection-edwardian-manchester/spa/leisure-pass',
    image: img('1520250497591-112f2f40a3f4'),
  },
  {
    slug: 'low-wood-bay',
    name: 'Low Wood Bay Resort & Spa',
    area: 'Windermere, Lake District',
    region: 'Lake District',
    indoorOutdoor: 'both',
    summary: 'A lakeside resort with a heated outdoor infinity pool looking across Windermere to the fells, plus an indoor pool and thermal spa.',
    facilities: ['Heated outdoor infinity pool', 'Indoor pool', 'Outdoor hot tub', 'Sauna', 'Vitality pool'],
    dayAccess: 'Spa days are available to non-residents.',
    url: 'https://englishlakes.co.uk/hotels/low-wood-bay/the-spa/spa-days/',
    image: img('1598902108854-10e335adac99'),
  },
  {
    slug: 'beech-hill',
    name: 'Beech Hill Hotel & Spa',
    area: 'Windermere, Lake District',
    region: 'Lake District',
    indoorOutdoor: 'both',
    summary: 'The Lakeview Spa has an indoor pool with views over Windermere and outdoor vitality spa pools on the terrace.',
    facilities: ['35ft indoor pool', 'Two outdoor vitality pools', 'Himalayan sauna', 'Steam room'],
    dayAccess: 'Spa access sessions and packages can be booked by non-residents.',
    url: 'https://www.beechhillhotel.co.uk/spa/',
    image: img('1506744038136-46273834b3fb'),
  },
  {
    slug: 'the-grove',
    name: 'The Grove',
    area: 'Chandler’s Cross, Hertfordshire',
    region: 'Home Counties',
    indoorOutdoor: 'both',
    summary: 'A country estate near Watford with the Sequoia spa’s black-mosaic pool and, in summer, a heated outdoor pool at Ralph’s Beach.',
    facilities: ['22m indoor mosaic pool', 'Seasonal outdoor pool', 'Jacuzzi', 'Sauna', 'Steam room'],
    dayAccess: 'Full and half spa days can be booked online.',
    url: 'https://www.thegrove.co.uk/spa/spa-days/',
    image: img('1501854140801-50d01698950b'),
  },
  {
    slug: 'harbour-brighton',
    name: 'Harbour Hotel & Spa Brighton',
    area: 'Kings Road, Brighton',
    region: 'South East',
    indoorOutdoor: 'indoor',
    summary: 'A seafront hotel whose underground HarSPA has a heated pool, a hydrotherapy pool and Scandinavian hot tubs.',
    facilities: ['Heated indoor pool', 'Hydrotherapy pool', 'Scandinavian hot tubs', 'Sauna', 'Steam room'],
    dayAccess: 'Spa day experiences are offered to non-residents.',
    url: 'https://www.harbourhotels.co.uk/our-hotels/sussex/harbour-hotel-brighton/spa-experiences',
    image: img('1531297484001-80022131f5a1'),
  },
  {
    slug: 'titanic-liverpool',
    name: 'Titanic Hotel Liverpool',
    area: 'Stanley Dock, Liverpool',
    region: 'North West',
    indoorOutdoor: 'indoor',
    summary: 'Maya Blue Wellness sits beneath a converted dock warehouse, with a Roman bath-style hydrotherapy pool and thermal suite.',
    facilities: ['Hydrotherapy pool', 'Thermal suite', 'Sauna', 'Steam room'],
    dayAccess: 'Non-residents can visit by appointment. Adults only (18+).',
    url: 'https://www.titanichotelliverpool.com/maya-blue-wellness',
    image: img('1463130456064-df74d816d25c'),
  },
  {
    slug: 'rudding-park',
    name: 'Rudding Park',
    area: 'Harrogate, North Yorkshire',
    region: 'Yorkshire',
    indoorOutdoor: 'both',
    summary: 'A family-owned estate with an indoor pool and a Roof Top Spa whose infinity-edge hydrotherapy pool runs from inside to out.',
    facilities: ['Indoor pool', '11m indoor-outdoor hydrotherapy pool', 'Panoramic sauna', 'Outdoor spa bath'],
    dayAccess: 'Spa days are available for solo guests, friends and couples.',
    url: 'https://www.ruddingpark.co.uk/spa/spa-days-experiences/',
    image: img('1465146344425-f00d5f5c8f07'),
  },
  {
    slug: 'one-spa-edinburgh',
    name: 'One Spa, Sheraton Grand Hotel & Spa',
    area: 'Conference Square, Edinburgh',
    region: 'Scotland',
    indoorOutdoor: 'both',
    summary: 'An award-winning city spa with a 19-metre pool and a rooftop hydropool that runs from inside to the open air.',
    facilities: ['19m swimming pool', 'Rooftop hydropool', 'Thermal suite', 'Gym'],
    dayAccess: 'Spa days and thermal experiences can be booked online.',
    url: 'https://www.onespa.com/',
    image: img('1542314831-068cd1dbfeeb'),
  },
  {
    slug: 'lygon-arms',
    name: 'The Lygon Arms',
    area: 'Broadway, Cotswolds',
    region: 'Cotswolds',
    indoorOutdoor: 'indoor',
    summary: 'A historic coaching inn in Broadway with a spa built around a heated indoor pool under a retractable roof.',
    facilities: ['Heated indoor pool', 'Retractable roof', 'Sauna', 'Steam room'],
    dayAccess: 'Day guests can book spa days and treatments.',
    url: 'https://www.lygonarmshotel.co.uk/relaxation/the-spa',
    image: img('1551123847-4041291bec0c'),
  },
  {
    slug: 'calcot',
    name: 'Calcot & Spa',
    area: 'Tetbury, Cotswolds',
    region: 'Cotswolds',
    indoorOutdoor: 'both',
    summary: 'A Cotswold-stone country hotel with a 16-metre indoor pool, a heated outdoor pool in season and a fireside hot tub.',
    facilities: ['16m indoor pool', 'Seasonal heated outdoor pool', 'Outdoor hot tub', 'Sauna', 'Steam room'],
    dayAccess: 'Spa day packages are offered. Check the hotel’s website for current availability.',
    url: 'https://calcot.co/',
    image: img('1504280390367-361c6d9f38f4'),
  },
];

export const findVenue = (slug: string | null | undefined) => VENUES.find((v) => v.slug === slug);

/** Venues not yet replaced by a live PoolPass listing. */
export const unclaimedVenues = (claimedSlugs: (string | null | undefined)[]) => {
  const claimed = new Set(claimedSlugs.filter(Boolean));
  return VENUES.filter((v) => !claimed.has(v.slug));
};
