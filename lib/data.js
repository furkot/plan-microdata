module.exports = {
    address: address,
    coordinates: coordinates,
    item: item,
    pin: pin,
    text: text
};

function item(node) {
  do {
    node = node.parentElement;
  } while(node && !node.hasAttribute('itemscope'));
  return node;
}

function text(node, maxLen) {
  var value;
  if (node) {
    if (node.tagName === 'META') {
      value = node.getAttribute('content');
    }
    else if (node.tagName === 'DATA') {
      value = node.getAttribute('value');
    }
    else {
      value = node.textContent;
    }
    if (value) {
      if (maxLen && value.length > maxLen) {
        value = value.substr(0, maxLen);
      }
      return value.trim() || undefined;
    }
  }
}

function address(node) {
  var value;
  if (node && node.getAttribute('itemtype') === 'http://schema.org/PostalAddress') {
    value = ['streetAddress', 'addressLocality', 'addressRegion', 'addressCountry'].reduce(function (parts, val) {
      val = text(node.querySelector('[itemprop="' + val + '"]'));
      if (val) {
        parts.push(val);
      }
      return parts;
    }, []). join(',');
  }
  return value || undefined;
}

function coordinates(node) {
  var value;
  if (node && node.getAttribute('itemtype') === 'http://schema.org/GeoCoordinates') {
    value = ['latitude', 'longitude'].reduce(function (coords, val) {
      val = text(node.querySelector('[itemprop="' + val + '"]'));
      if (val) {
        val = parseFloat(val);
        if (!isNaN(val)) {
          coords.push(val);
        }
      }
      return coords;
    }, []);
    if (value.length === 2) {
      return {
        lat: value[0],
        lon: value[1]
      };
    }
  }
}

var pins = {
  // AdministrativeArea
  City: 71,
  // CivicStructure
  Airport: 1,
  Aquarium: 67,
  Beach: 56,
  BusStation: 1,
  BusStop: 1,
  Campground: 11,
  Cemetery: 65,
  Crematorium: 65,
  EventVenue: 74,
  FireStation: 1,
  GovernmentBuilding: 41,
  Hospital: 1,
  MovieTheater: 1,
  Museum: 33,
  MusicVenue: 74,
  Park: 50,
  ParkingFacility: 1,
  PerformingArtsTheater: 74,
  PlaceOfWorship: 34,
  Playground: 1,
  PoliceStation: 1,
  RVPark: 11,
  StadiumOrArena: 68,
  SubwayStation: 1,
  TaxiStand: 1,
  TrainStation: 1,
  Zoo: 67,
  // Landform
  BodyOfWater: 58,
  Continent: 1,
  Mountain: 59,
  Volcano: 60,
  // BodyOfWater
  Canal: 1,
  LakeBodyOfWater: 62,
  OceanBodyOfWater: 58,
  Pond: 62,
  Reservoir: 62,
  RiverBodyOfWater: 63,
  SeaBodyOfWater: 58,
  Waterfall: 58,
  // LandmarksOrHistoricalBuildings
  LandmarksOrHistoricalBuildings: 46,
  // LocalBusiness
  EntertainmentBusiness: 68,
  FoodEstablishment: 24,
  GovernmentOffice: 41,
  Library: 66,
  LodgingBusiness: 0,
  TouristInformationCenter: 73,
  // FoodEstablishment
  Bakery: 24,
  BarOrPub: 31,
  Brewery: 28,
  CafeOrCoffeeShop: 24,
  FastFoodRestaurant: 24,
  IceCreamShop: 24,
  Restaurant: 24,
  Winery: 30,
  // LodgingBusiness
  BedAndBreakfast: 12,
  Hostel: 15,
  Hotel: 0,
  Motel: 16
  // Residence
  // TouristAttraction
};

function pin(node) {
  var value;
  if (node) {
    value = node.getAttribute('itemtype').replace('http://schema.org/', '');
    return pins[value];
  }
}