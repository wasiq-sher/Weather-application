import apiClient from '../services/apiClient.js';

/**
 * Atmosphere AI - Centralized Mock Weather Data Provider
 * 
 * Provides mock datasets adhering to the types defined in weather.types.js.
 * Includes multiple preset locations, realistic hourly trajectories,
 * 7-day extended outlooks, environmental biometeorology metrics, and astronomical calculations.
 */

export const MOCK_LOCATIONS = [
  {
    id: 'san-francisco',
    name: 'San Francisco',
    region: 'CA',
    country: 'United States',
    lat: 37.7749,
    lon: -122.4194,
    timezone: 'America/Los_Angeles',
    localTime: '12:45 PM PST',
    isDefault: true,
  },
  {
    id: 'new-york',
    name: 'New York',
    region: 'NY',
    country: 'United States',
    lat: 40.7128,
    lon: -74.0060,
    timezone: 'America/New_York',
    localTime: '3:45 PM EST',
    isDefault: false,
  },
  {
    id: 'london',
    name: 'London',
    region: 'England',
    country: 'United Kingdom',
    lat: 51.5074,
    lon: -0.1278,
    timezone: 'Europe/London',
    localTime: '8:45 PM GMT',
    isDefault: false,
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    region: 'Kanto',
    country: 'Japan',
    lat: 35.6762,
    lon: 139.6503,
    timezone: 'Asia/Tokyo',
    localTime: '5:45 AM JST',
    isDefault: false,
  },
  {
    id: 'sydney',
    name: 'Sydney',
    region: 'NSW',
    country: 'Australia',
    lat: -33.8688,
    lon: 151.2093,
    timezone: 'Australia/Sydney',
    localTime: '6:45 AM AEST',
    isDefault: false,
  },
];

export const MOCK_CURRENT_WEATHER = {
  'san-francisco': {
    locationId: 'san-francisco',
    tempF: 68,
    tempC: 20,
    feelsLikeF: 67,
    feelsLikeC: 19,
    highF: 72,
    highC: 22,
    lowF: 55,
    lowC: 13,
    condition: 'Sunny & Mild',
    iconCode: 'clear-day',
    humidity: 42,
    uvIndex: 4,
    uvLevel: 'Moderate',
    aqi: 22,
    aqiStatus: 'Good',
    pressureHpa: 1012,
    windMph: 12,
    windKmh: 19,
    windDirection: 'NW',
    windGustMph: 19,
    visibilityMiles: 10,
    visibilityKm: 16.1,
    dewPointF: 46,
    dewPointC: 8,
    cloudCover: 15,
    sunrise: '6:32 AM',
    sunset: '7:45 PM',
    rainChance: 15,
    simpleSummary: 'Expect a light shower around 4:15 PM. Great time for a quick coffee break inside.',
    summary: 'Expect a brief temperature drop between 4:00 PM and 6:00 PM due to incoming coastal fog. Visibility may decrease to 2 miles along the Embarcadero.',
    lastUpdated: '4:10 PM (live radar sync)',
  },
  'new-york': {
    locationId: 'new-york',
    tempF: 76,
    tempC: 24,
    feelsLikeF: 78,
    feelsLikeC: 26,
    highF: 81,
    highC: 27,
    lowF: 64,
    lowC: 18,
    condition: 'Partly Cloudy',
    iconCode: 'partly-cloudy-day',
    humidity: 58,
    uvIndex: 6,
    uvLevel: 'High',
    aqi: 45,
    aqiStatus: 'Good',
    pressureHpa: 1016,
    windMph: 9,
    windKmh: 14,
    windDirection: 'SW',
    windGustMph: 15,
    visibilityMiles: 9.5,
    visibilityKm: 15.3,
    dewPointF: 60,
    dewPointC: 16,
    cloudCover: 35,
    sunrise: '6:24 AM',
    sunset: '7:28 PM',
    rainChance: 25,
    simpleSummary: 'Partly cloudy with mild humidity. A slight chance of an isolated evening shower around 7:30 PM.',
    summary: 'Warm afternoon with mild humidity. A slight chance of an isolated evening shower over Manhattan after 8:00 PM.',
    lastUpdated: '3:45 PM',
  },
  'london': {
    locationId: 'london',
    tempF: 61,
    tempC: 16,
    feelsLikeF: 60,
    feelsLikeC: 15,
    highF: 64,
    highC: 18,
    lowF: 52,
    lowC: 11,
    condition: 'Scattered Showers',
    iconCode: 'rain',
    humidity: 78,
    uvIndex: 2,
    uvLevel: 'Low',
    aqi: 28,
    aqiStatus: 'Good',
    pressureHpa: 1008,
    windMph: 15,
    windKmh: 24,
    windDirection: 'W',
    windGustMph: 24,
    visibilityMiles: 6.8,
    visibilityKm: 11,
    dewPointF: 54,
    dewPointC: 12,
    cloudCover: 82,
    sunrise: '6:18 AM',
    sunset: '7:42 PM',
    rainChance: 65,
    simpleSummary: 'Expect intermittent light rain showers through 5:00 PM. A great afternoon to carry an umbrella.',
    summary: 'Intermittent light drizzle through dusk. Stronger wind gusts expected along the Thames corridor.',
    lastUpdated: '8:45 PM',
  },
  'tokyo': {
    locationId: 'tokyo',
    tempF: 79,
    tempC: 26,
    feelsLikeF: 83,
    feelsLikeC: 28,
    highF: 86,
    highC: 30,
    lowF: 72,
    lowC: 22,
    condition: 'Humid & Overcast',
    iconCode: 'cloudy',
    humidity: 84,
    uvIndex: 5,
    uvLevel: 'Moderate',
    aqi: 35,
    aqiStatus: 'Good',
    pressureHpa: 1010,
    windMph: 7,
    windKmh: 11,
    windDirection: 'SSE',
    windGustMph: 12,
    visibilityMiles: 8,
    visibilityKm: 13,
    dewPointF: 72,
    dewPointC: 22,
    cloudCover: 90,
    sunrise: '5:14 AM',
    sunset: '6:06 PM',
    rainChance: 20,
    simpleSummary: 'Cloudy and warm with calm winds. Conditions will remain dry with gentle Tokyo Bay breezes.',
    summary: 'Early morning cloud deck over Tokyo Bay. High humidity throughout the day with calm winds.',
    lastUpdated: '5:45 AM',
  },
  'sydney': {
    locationId: 'sydney',
    tempF: 64,
    tempC: 18,
    feelsLikeF: 63,
    feelsLikeC: 17,
    highF: 68,
    highC: 20,
    lowF: 50,
    lowC: 10,
    condition: 'Clear & Crisp',
    iconCode: 'clear-day',
    humidity: 49,
    uvIndex: 5,
    uvLevel: 'Moderate',
    aqi: 18,
    aqiStatus: 'Good',
    pressureHpa: 1022,
    windMph: 11,
    windKmh: 18,
    windDirection: 'NE',
    windGustMph: 16,
    visibilityMiles: 10,
    visibilityKm: 16,
    dewPointF: 44,
    dewPointC: 7,
    cloudCover: 10,
    sunrise: '6:12 AM',
    sunset: '5:48 PM',
    rainChance: 5,
    simpleSummary: 'Crisp blue skies and brilliant sunshine continuing all afternoon. Ideal outdoor conditions.',
    summary: 'Clear coastal atmosphere with gentle oceanic breeze. Perfect visibility across the harbor.',
    lastUpdated: '6:45 AM',
  },
};

// Helper to generate a realistic 48-hour atmospheric progression
function generate48HourlyData(baseTempF, pattern = 'sunny-fog') {
  const conditionsPattern = {
    'sunny-fog': [
      { cond: 'Sunny', icon: 'clear-day', pop: 0, tempDelta: 0 },
      { cond: 'Sunny', icon: 'clear-day', pop: 0, tempDelta: 2 },
      { cond: 'Sunny', icon: 'clear-day', pop: 5, tempDelta: 4 },
      { cond: 'Partly Cloudy', icon: 'partly-cloudy-day', pop: 10, tempDelta: 3 },
      { cond: 'Coastal Fog', icon: 'fog', pop: 25, tempDelta: -2 },
      { cond: 'Cool Mist', icon: 'drizzle', pop: 45, tempDelta: -6 },
      { cond: 'Breezy Fog', icon: 'fog', pop: 35, tempDelta: -9 },
      { cond: 'Clear Twilight', icon: 'clear-night', pop: 10, tempDelta: -11 },
      { cond: 'Clear Night', icon: 'clear-night', pop: 5, tempDelta: -12 },
      { cond: 'Clear Night', icon: 'clear-night', pop: 0, tempDelta: -13 },
      { cond: 'Clear Night', icon: 'clear-night', pop: 0, tempDelta: -14 },
      { cond: 'Chilly Dawn', icon: 'clear-night', pop: 0, tempDelta: -15 },
    ],
    'rainy': [
      { cond: 'Overcast', icon: 'cloudy', pop: 30, tempDelta: 0 },
      { cond: 'Light Rain', icon: 'drizzle', pop: 65, tempDelta: -1 },
      { cond: 'Steady Rain', icon: 'rain', pop: 85, tempDelta: -3 },
      { cond: 'Heavy Showers', icon: 'heavy-rain', pop: 90, tempDelta: -4 },
      { cond: 'Scattered Showers', icon: 'rain', pop: 70, tempDelta: -3 },
      { cond: 'Drizzle', icon: 'drizzle', pop: 50, tempDelta: -2 },
      { cond: 'Overcast', icon: 'cloudy', pop: 35, tempDelta: -4 },
      { cond: 'Passing Mist', icon: 'fog', pop: 25, tempDelta: -5 },
      { cond: 'Cloudy Night', icon: 'partly-cloudy-night', pop: 20, tempDelta: -6 },
      { cond: 'Overcast Night', icon: 'cloudy', pop: 15, tempDelta: -7 },
      { cond: 'Morning Mist', icon: 'fog', pop: 30, tempDelta: -7 },
      { cond: 'Break in Clouds', icon: 'partly-cloudy-day', pop: 20, tempDelta: -4 },
    ]
  };

  const selectedPattern = conditionsPattern[pattern] || conditionsPattern['sunny-fog'];
  const now = new Date();
  const currentHour = now.getHours();

  return Array.from({ length: 48 }).map((_, i) => {
    const targetHour24 = (currentHour + i) % 24;
    const isNextDay = currentHour + i >= 24;
    const hour12 = targetHour24 % 12 === 0 ? 12 : targetHour24 % 12;
    const ampm = targetHour24 >= 12 ? 'PM' : 'AM';
    const timeLabel = i === 0 ? 'Now' : `${hour12} ${ampm}`;

    const patternIndex = (targetHour24) % selectedPattern.length;
    const patternEntry = selectedPattern[patternIndex];

    const tempF = Math.round(baseTempF + patternEntry.tempDelta + (Math.sin((i / 24) * Math.PI * 2) * 3));
    const tempC = Math.round(((tempF - 32) * 5) / 9);

    return {
      time: timeLabel,
      hour24: targetHour24,
      tempF,
      tempC,
      condition: patternEntry.cond,
      iconCode: patternEntry.icon,
      pop: patternEntry.pop,
      precipitationProbability: patternEntry.pop,
      precipitationType: patternEntry.pop >= 40 ? 'rain' : 'none',
      humidity: Math.min(95, Math.max(30, Math.round(55 + Math.sin(i / 6) * 20))),
      windMph: Math.min(30, Math.max(5, Math.round(12 + Math.cos(i / 5) * 6))),
      isNow: i === 0,
      dayOffset: isNextDay ? 1 : 0,
    };
  });
}

export const MOCK_HOURLY_FORECAST = {
  'san-francisco': generate48HourlyData(68, 'sunny-fog'),
  'new-york': generate48HourlyData(75, 'sunny-fog'),
  'london': generate48HourlyData(62, 'rainy'),
  'tokyo': generate48HourlyData(79, 'sunny-fog'),
  'sydney': generate48HourlyData(64, 'sunny-fog'),
};

export const MOCK_DAILY_FORECAST = {
  'san-francisco': [
    {
      id: 'sf-day-1',
      day: 'Today',
      dayFull: 'Tuesday',
      date: 'Sep 3',
      highF: 72,
      highC: 22,
      lowF: 55,
      lowC: 13,
      condition: 'Sunny & Coastal Fog',
      iconCode: 'partly-cloudy-day',
      pop: 15,
      precipitationAmount: '0.00 in',
      precipitationType: 'none',
      windMph: 14,
      windKmh: 23,
      windDirection: 'NW',
      windGustMph: 21,
      humidity: 52,
      uvIndex: 4,
      uvRating: 'Moderate',
      pressureHpa: 1014,
      dewPointF: 48,
      dewPointC: 9,
      cloudCover: 25,
      sunrise: '6:32 AM',
      sunset: '7:45 PM',
      daylightDuration: '13h 13m',
      summary: 'Warm midday peaking at 72°F followed by customary Pacific fog sweep along the Embarcadero by late afternoon.',
      recommendations: {
        attire: 'Short sleeves for afternoon; carry a windbreaker for the evening ocean breeze.',
        outdoor: 'Excellent morning and midday for walking and cycling; fog increases after 5 PM.',
        advisory: 'Coastal fog advisory active between 4:30 PM and 9:00 PM.',
      },
      dayParts: [
        { part: 'Morning', time: '8:00 AM', tempF: 58, tempC: 14, condition: 'Passing Mist', iconCode: 'fog', pop: 10 },
        { part: 'Afternoon', time: '1:00 PM', tempF: 72, tempC: 22, condition: 'Sunny & Warm', iconCode: 'clear-day', pop: 5 },
        { part: 'Evening', time: '6:00 PM', tempF: 62, tempC: 17, condition: 'Breezy Fog', iconCode: 'partly-cloudy-day', pop: 15 },
        { part: 'Overnight', time: '11:00 PM', tempF: 55, tempC: 13, condition: 'Marine Stratus', iconCode: 'partly-cloudy-night', pop: 10 },
      ],
    },
    {
      id: 'sf-day-2',
      day: 'Wed',
      dayFull: 'Wednesday',
      date: 'Sep 4',
      highF: 68,
      highC: 20,
      lowF: 54,
      lowC: 12,
      condition: 'Morning Fog, Afternoon Sun',
      iconCode: 'clear-day',
      pop: 10,
      precipitationAmount: '0.00 in',
      precipitationType: 'none',
      windMph: 12,
      windKmh: 19,
      windDirection: 'WNW',
      windGustMph: 18,
      humidity: 56,
      uvIndex: 5,
      uvRating: 'Moderate',
      pressureHpa: 1015,
      dewPointF: 49,
      dewPointC: 9,
      cloudCover: 30,
      sunrise: '6:33 AM',
      sunset: '7:43 PM',
      daylightDuration: '13h 10m',
      summary: 'Crisp morning clearing up by 11 AM with steady marine breezes and clear blue skies.',
      recommendations: {
        attire: 'Comfortable casual layers; sunglasses recommended during afternoon clearing.',
        outdoor: 'Favorable conditions throughout the day; light headwind on coastal routes.',
        advisory: null,
      },
      dayParts: [
        { part: 'Morning', time: '8:00 AM', tempF: 56, tempC: 13, condition: 'Low Stratus', iconCode: 'fog', pop: 15 },
        { part: 'Afternoon', time: '1:00 PM', tempF: 68, tempC: 20, condition: 'Clear Sky', iconCode: 'clear-day', pop: 0 },
        { part: 'Evening', time: '6:00 PM', tempF: 61, tempC: 16, condition: 'Mild Dusk', iconCode: 'clear-day', pop: 5 },
        { part: 'Overnight', time: '11:00 PM', tempF: 54, tempC: 12, condition: 'Clear Starlight', iconCode: 'clear-night', pop: 0 },
      ],
    },
    {
      id: 'sf-day-3',
      day: 'Thu',
      dayFull: 'Thursday',
      date: 'Sep 5',
      highF: 74,
      highC: 23,
      lowF: 56,
      lowC: 13,
      condition: 'Clear & Mild',
      iconCode: 'clear-day',
      pop: 0,
      precipitationAmount: '0.00 in',
      precipitationType: 'none',
      windMph: 10,
      windKmh: 16,
      windDirection: 'NW',
      windGustMph: 15,
      humidity: 44,
      uvIndex: 6,
      uvRating: 'High',
      pressureHpa: 1017,
      dewPointF: 46,
      dewPointC: 8,
      cloudCover: 10,
      sunrise: '6:34 AM',
      sunset: '7:42 PM',
      daylightDuration: '13h 08m',
      summary: 'Warmest day of the week with crystal-clear skies across the entire Bay Area.',
      recommendations: {
        attire: 'Lightweight summer clothing; apply sunscreen if spending extended hours outdoors.',
        outdoor: 'Prime weather for outdoor dining, rooftop events, and Golden Gate outings.',
        advisory: null,
      },
      dayParts: [
        { part: 'Morning', time: '8:00 AM', tempF: 60, tempC: 16, condition: 'Sunny Start', iconCode: 'clear-day', pop: 0 },
        { part: 'Afternoon', time: '1:00 PM', tempF: 74, tempC: 23, condition: 'Brilliant Sun', iconCode: 'clear-day', pop: 0 },
        { part: 'Evening', time: '6:00 PM', tempF: 66, tempC: 19, condition: 'Golden Twilight', iconCode: 'clear-day', pop: 0 },
        { part: 'Overnight', time: '11:00 PM', tempF: 57, tempC: 14, condition: 'Clear Skies', iconCode: 'clear-night', pop: 0 },
      ],
    },
    {
      id: 'sf-day-4',
      day: 'Fri',
      dayFull: 'Friday',
      date: 'Sep 6',
      highF: 69,
      highC: 21,
      lowF: 55,
      lowC: 13,
      condition: 'Partly Cloudy',
      iconCode: 'partly-cloudy-day',
      pop: 15,
      precipitationAmount: '0.00 in',
      precipitationType: 'none',
      windMph: 13,
      windKmh: 21,
      windDirection: 'W',
      windGustMph: 20,
      humidity: 49,
      uvIndex: 5,
      uvRating: 'Moderate',
      pressureHpa: 1014,
      dewPointF: 48,
      dewPointC: 9,
      cloudCover: 40,
      sunrise: '6:35 AM',
      sunset: '7:40 PM',
      daylightDuration: '13h 05m',
      summary: 'Passing high cirrus clouds and moderate coastal winds ahead of incoming weekend trough.',
      recommendations: {
        attire: 'Versatile casual wear; light sweater for the evening.',
        outdoor: 'Great conditions for sports and commute; comfortable ambient humidity.',
        advisory: null,
      },
      dayParts: [
        { part: 'Morning', time: '8:00 AM', tempF: 58, tempC: 14, condition: 'Filtered Sun', iconCode: 'partly-cloudy-day', pop: 5 },
        { part: 'Afternoon', time: '1:00 PM', tempF: 69, tempC: 21, condition: 'High Cirrus', iconCode: 'partly-cloudy-day', pop: 10 },
        { part: 'Evening', time: '6:00 PM', tempF: 63, tempC: 17, condition: 'Cloudy Sunset', iconCode: 'partly-cloudy-day', pop: 15 },
        { part: 'Overnight', time: '11:00 PM', tempF: 56, tempC: 13, condition: 'Overcast Deck', iconCode: 'cloudy', pop: 20 },
      ],
    },
    {
      id: 'sf-day-5',
      day: 'Sat',
      dayFull: 'Saturday',
      date: 'Sep 7',
      highF: 66,
      highC: 19,
      lowF: 53,
      lowC: 12,
      condition: 'Scattered Showers',
      iconCode: 'rain',
      pop: 55,
      precipitationAmount: '0.18 in',
      precipitationType: 'rain',
      windMph: 16,
      windKmh: 26,
      windDirection: 'SW',
      windGustMph: 25,
      humidity: 68,
      uvIndex: 3,
      uvRating: 'Moderate',
      pressureHpa: 1009,
      dewPointF: 52,
      dewPointC: 11,
      cloudCover: 80,
      sunrise: '6:36 AM',
      sunset: '7:39 PM',
      daylightDuration: '13h 03m',
      summary: 'Weak Pacific cold front bringing scattered afternoon showers and cool gusty winds.',
      recommendations: {
        attire: 'Waterproof jacket or umbrella; sturdy footwear for wet surfaces.',
        outdoor: 'Plan indoor activities for mid-afternoon; morning remains mostly dry.',
        advisory: 'Pavement may be slick during initial rainfall onset.',
      },
      dayParts: [
        { part: 'Morning', time: '8:00 AM', tempF: 56, tempC: 13, condition: 'Overcast', iconCode: 'cloudy', pop: 25 },
        { part: 'Afternoon', time: '1:00 PM', tempF: 65, tempC: 18, condition: 'Steady Showers', iconCode: 'rain', pop: 65 },
        { part: 'Evening', time: '6:00 PM', tempF: 59, tempC: 15, condition: 'Tapering Drizzle', iconCode: 'drizzle', pop: 45 },
        { part: 'Overnight', time: '11:00 PM', tempF: 53, tempC: 12, condition: 'Damp Mist', iconCode: 'fog', pop: 20 },
      ],
    },
    {
      id: 'sf-day-6',
      day: 'Sun',
      dayFull: 'Sunday',
      date: 'Sep 8',
      highF: 67,
      highC: 19,
      lowF: 52,
      lowC: 11,
      condition: 'Fresh Breezes',
      iconCode: 'wind',
      pop: 20,
      precipitationAmount: '0.02 in',
      precipitationType: 'rain',
      windMph: 18,
      windKmh: 29,
      windDirection: 'NW',
      windGustMph: 28,
      humidity: 54,
      uvIndex: 5,
      uvRating: 'Moderate',
      pressureHpa: 1013,
      dewPointF: 47,
      dewPointC: 8,
      cloudCover: 35,
      sunrise: '6:37 AM',
      sunset: '7:37 PM',
      daylightDuration: '13h 00m',
      summary: 'Brisk ocean winds with intermittent sunny intervals; front pushes eastward.',
      recommendations: {
        attire: 'Windbreaker and medium sweater; hat may require secure fit due to gusts.',
        outdoor: 'Crisp, invigorating air; great for coastal hiking if dressed for wind.',
        advisory: null,
      },
      dayParts: [
        { part: 'Morning', time: '8:00 AM', tempF: 55, tempC: 13, condition: 'Breezy Clearing', iconCode: 'wind', pop: 15 },
        { part: 'Afternoon', time: '1:00 PM', tempF: 67, tempC: 19, condition: 'Sun & Wind', iconCode: 'partly-cloudy-day', pop: 10 },
        { part: 'Evening', time: '6:00 PM', tempF: 59, tempC: 15, condition: 'Cool Gusts', iconCode: 'wind', pop: 10 },
        { part: 'Overnight', time: '11:00 PM', tempF: 52, tempC: 11, condition: 'Crisp Night', iconCode: 'clear-night', pop: 5 },
      ],
    },
    {
      id: 'sf-day-7',
      day: 'Mon',
      dayFull: 'Monday',
      date: 'Sep 9',
      highF: 70,
      highC: 21,
      lowF: 54,
      lowC: 12,
      condition: 'Sunny & Pleasant',
      iconCode: 'clear-day',
      pop: 5,
      precipitationAmount: '0.00 in',
      precipitationType: 'none',
      windMph: 11,
      windKmh: 18,
      windDirection: 'NNW',
      windGustMph: 16,
      humidity: 48,
      uvIndex: 5,
      uvRating: 'Moderate',
      pressureHpa: 1016,
      dewPointF: 46,
      dewPointC: 8,
      cloudCover: 15,
      sunrise: '6:38 AM',
      sunset: '7:35 PM',
      daylightDuration: '12h 57m',
      summary: 'Ideal start to the work week with calm winds, gentle sunshine, and mild temperatures.',
      recommendations: {
        attire: 'Business casual with light cardigan or jacket.',
        outdoor: 'Pleasant conditions for walking commutes and lunchtime parks.',
        advisory: null,
      },
      dayParts: [
        { part: 'Morning', time: '8:00 AM', tempF: 57, tempC: 14, condition: 'Sunny Morning', iconCode: 'clear-day', pop: 0 },
        { part: 'Afternoon', time: '1:00 PM', tempF: 70, tempC: 21, condition: 'Warm Sun', iconCode: 'clear-day', pop: 0 },
        { part: 'Evening', time: '6:00 PM', tempF: 62, tempC: 17, condition: 'Calm Twilight', iconCode: 'clear-day', pop: 5 },
        { part: 'Overnight', time: '11:00 PM', tempF: 54, tempC: 12, condition: 'Starlit', iconCode: 'clear-night', pop: 0 },
      ],
    },
  ],
  'new-york': [
    { day: 'Today', dayFull: 'Tuesday', date: 'Sep 3', highF: 81, highC: 27, lowF: 64, lowC: 18, condition: 'Partly Cloudy', iconCode: 'partly-cloudy-day', pop: 25, precipitationAmount: '0.02 in', windMph: 9, windKmh: 14, windDirection: 'SW', windGustMph: 15, humidity: 58, uvIndex: 6, uvRating: 'High', pressureHpa: 1016, summary: 'Warm afternoon with mild humidity. A slight chance of an isolated evening shower over Manhattan.', recommendations: { attire: 'Light breathable fabrics; light umbrella on standby.', outdoor: 'Great for Central Park walks before 6 PM.' } },
    { day: 'Wed', dayFull: 'Wednesday', date: 'Sep 4', highF: 84, highC: 29, lowF: 68, lowC: 20, condition: 'Sunny & Warm', iconCode: 'clear-day', pop: 10, precipitationAmount: '0.00 in', windMph: 8, windKmh: 13, windDirection: 'W', windGustMph: 12, humidity: 52, uvIndex: 7, uvRating: 'High', pressureHpa: 1015, summary: 'High pressure ridge delivers radiant sunshine and above-average temperatures.', recommendations: { attire: 'Summer attire; stay hydrated.' } },
    { day: 'Thu', dayFull: 'Thursday', date: 'Sep 5', highF: 79, highC: 26, lowF: 63, lowC: 17, condition: 'Scattered Thunderstorms', iconCode: 'thunderstorm', pop: 70, precipitationAmount: '0.45 in', windMph: 14, windKmh: 23, windDirection: 'NW', windGustMph: 28, humidity: 74, uvIndex: 4, uvRating: 'Moderate', pressureHpa: 1010, summary: 'Strong cold front sparks scattered thunderstorms by late afternoon with gusty downdrafts.', recommendations: { attire: 'Rain boots and solid umbrella.', outdoor: 'Monitor radar alerts between 3 PM and 7 PM.' } },
    { day: 'Fri', dayFull: 'Friday', date: 'Sep 6', highF: 73, highC: 23, lowF: 58, lowC: 14, condition: 'Clear & Crisp', iconCode: 'clear-day', pop: 0, precipitationAmount: '0.00 in', windMph: 12, windKmh: 19, windDirection: 'NW', windGustMph: 18, humidity: 42, uvIndex: 6, uvRating: 'High', pressureHpa: 1020, summary: 'Canadian airmass brings low humidity, brilliant sunshine, and crisp early autumn air.', recommendations: { attire: 'Light layers; great sweater weather by evening.' } },
    { day: 'Sat', dayFull: 'Saturday', date: 'Sep 7', highF: 75, highC: 24, lowF: 60, lowC: 16, condition: 'Sunny', iconCode: 'clear-day', pop: 5, precipitationAmount: '0.00 in', windMph: 9, windKmh: 14, windDirection: 'NNW', windGustMph: 14, humidity: 46, uvIndex: 6, uvRating: 'High', pressureHpa: 1021, summary: 'Outstanding weekend weather with clear skies and comfortable temperatures.', recommendations: { attire: 'Casual weekend wear.' } },
    { day: 'Sun', dayFull: 'Sunday', date: 'Sep 8', highF: 77, highC: 25, lowF: 62, lowC: 17, condition: 'Partly Cloudy', iconCode: 'partly-cloudy-day', pop: 20, precipitationAmount: '0.00 in', windMph: 10, windKmh: 16, windDirection: 'S', windGustMph: 16, humidity: 55, uvIndex: 5, uvRating: 'Moderate', pressureHpa: 1018, summary: 'Gentle southerly breeze with high decorative clouds; very pleasant.' },
    { day: 'Mon', dayFull: 'Monday', date: 'Sep 9', highF: 80, highC: 27, lowF: 65, lowC: 18, condition: 'Warm & Humid', iconCode: 'partly-cloudy-day', pop: 30, precipitationAmount: '0.05 in', windMph: 11, windKmh: 18, windDirection: 'SW', windGustMph: 17, humidity: 62, uvIndex: 6, uvRating: 'High', pressureHpa: 1014, summary: 'Mild return flow brings warm temperatures and slight chance of a passing late shower.' },
  ],
  'london': [
    { day: 'Today', dayFull: 'Tuesday', date: 'Sep 3', highF: 66, highC: 19, lowF: 52, lowC: 11, condition: 'Passing Showers', iconCode: 'rain', pop: 60, precipitationAmount: '0.15 in', windMph: 14, windKmh: 23, windDirection: 'WSW', windGustMph: 24, humidity: 76, uvIndex: 3, uvRating: 'Moderate', pressureHpa: 1008, summary: 'Atlantic low delivers intermittent rain showers and moderate westerly breezes.', recommendations: { attire: 'Waterproof coat and sturdy umbrella.' } },
    { day: 'Wed', dayFull: 'Wednesday', date: 'Sep 4', highF: 64, highC: 18, lowF: 50, lowC: 10, condition: 'Overcast & Cool', iconCode: 'cloudy', pop: 35, precipitationAmount: '0.03 in', windMph: 11, windKmh: 18, windDirection: 'W', windGustMph: 18, humidity: 72, uvIndex: 3, uvRating: 'Moderate', pressureHpa: 1012, summary: 'Persistent cloud deck with occasional breaks in the clouds during the afternoon.' },
    { day: 'Thu', dayFull: 'Thursday', date: 'Sep 5', highF: 68, highC: 20, lowF: 53, lowC: 12, condition: 'Sunny Spells', iconCode: 'partly-cloudy-day', pop: 15, precipitationAmount: '0.00 in', windMph: 9, windKmh: 14, windDirection: 'SW', windGustMph: 15, humidity: 64, uvIndex: 4, uvRating: 'Moderate', pressureHpa: 1018, summary: 'A much brighter day with warming spells of sunshine and gentle breeze.' },
    { day: 'Fri', dayFull: 'Friday', date: 'Sep 6', highF: 70, highC: 21, lowF: 55, lowC: 13, condition: 'Pleasant & Mild', iconCode: 'clear-day', pop: 10, precipitationAmount: '0.00 in', windMph: 8, windKmh: 13, windDirection: 'S', windGustMph: 13, humidity: 60, uvIndex: 4, uvRating: 'Moderate', pressureHpa: 1020, summary: 'Warmest and most settled day of the week with long sunny intervals.' },
    { day: 'Sat', dayFull: 'Saturday', date: 'Sep 7', highF: 67, highC: 19, lowF: 53, lowC: 12, condition: 'Cloudy with Mist', iconCode: 'fog', pop: 25, precipitationAmount: '0.01 in', windMph: 10, windKmh: 16, windDirection: 'ESE', windGustMph: 16, humidity: 78, uvIndex: 3, uvRating: 'Moderate', pressureHpa: 1016, summary: 'Morning mist giving way to overcast skies and cool evening temperatures.' },
    { day: 'Sun', dayFull: 'Sunday', date: 'Sep 8', highF: 63, highC: 17, lowF: 49, lowC: 9, condition: 'Breezy Showers', iconCode: 'drizzle', pop: 50, precipitationAmount: '0.10 in', windMph: 16, windKmh: 26, windDirection: 'NW', windGustMph: 26, humidity: 75, uvIndex: 3, uvRating: 'Moderate', pressureHpa: 1011, summary: 'Cool northwesterly airmass brings scattered damp showers.' },
    { day: 'Mon', dayFull: 'Monday', date: 'Sep 9', highF: 65, highC: 18, lowF: 51, lowC: 11, condition: 'Partly Cloudy', iconCode: 'partly-cloudy-day', pop: 20, precipitationAmount: '0.00 in', windMph: 12, windKmh: 19, windDirection: 'W', windGustMph: 19, humidity: 68, uvIndex: 4, uvRating: 'Moderate', pressureHpa: 1015, summary: 'Settled start to the week with patchy cloud and bright periods.' },
  ],
  'tokyo': [
    { day: 'Today', dayFull: 'Tuesday', date: 'Sep 3', highF: 86, highC: 30, lowF: 75, lowC: 24, condition: 'Humid & Sunny', iconCode: 'clear-day', pop: 20, precipitationAmount: '0.00 in', windMph: 8, windKmh: 13, windDirection: 'SE', windGustMph: 14, humidity: 72, uvIndex: 8, uvRating: 'Very High', pressureHpa: 1011, summary: 'Warm and tropical with brilliant sunshine and high humidity.' },
    { day: 'Wed', dayFull: 'Wednesday', date: 'Sep 4', highF: 88, highC: 31, lowF: 76, lowC: 24, condition: 'Scattered Storms', iconCode: 'thunderstorm', pop: 65, precipitationAmount: '0.55 in', windMph: 12, windKmh: 19, windDirection: 'S', windGustMph: 24, humidity: 82, uvIndex: 6, uvRating: 'High', pressureHpa: 1007, summary: 'Tropical moisture triggers localized afternoon thundershowers.' },
    { day: 'Thu', dayFull: 'Thursday', date: 'Sep 5', highF: 82, highC: 28, lowF: 71, lowC: 22, condition: 'Passing Showers', iconCode: 'rain', pop: 45, precipitationAmount: '0.20 in', windMph: 10, windKmh: 16, windDirection: 'ENE', windGustMph: 18, humidity: 76, uvIndex: 5, uvRating: 'Moderate', pressureHpa: 1012, summary: 'Breezy coastal cloudiness with light rain in the morning.' },
    { day: 'Fri', dayFull: 'Friday', date: 'Sep 6', highF: 84, highC: 29, lowF: 72, lowC: 22, condition: 'Clear Sky', iconCode: 'clear-day', pop: 10, precipitationAmount: '0.00 in', windMph: 7, windKmh: 11, windDirection: 'E', windGustMph: 12, humidity: 65, uvIndex: 8, uvRating: 'Very High', pressureHpa: 1016, summary: 'Excellent visibility with views of Mount Fuji possible in the morning.' },
    { day: 'Sat', dayFull: 'Saturday', date: 'Sep 7', highF: 85, highC: 29, lowF: 73, lowC: 23, condition: 'Partly Cloudy', iconCode: 'partly-cloudy-day', pop: 15, precipitationAmount: '0.00 in', windMph: 8, windKmh: 13, windDirection: 'SSE', windGustMph: 14, humidity: 68, uvIndex: 7, uvRating: 'High', pressureHpa: 1015, summary: 'Warm and comfortable weekend conditions across the Kanto plain.' },
    { day: 'Sun', dayFull: 'Sunday', date: 'Sep 8', highF: 83, highC: 28, lowF: 72, lowC: 22, condition: 'Hazy Sun', iconCode: 'partly-cloudy-day', pop: 20, precipitationAmount: '0.00 in', windMph: 9, windKmh: 14, windDirection: 'S', windGustMph: 15, humidity: 70, uvIndex: 7, uvRating: 'High', pressureHpa: 1013, summary: 'Gentle sea breezes with warm temperatures throughout the evening.' },
    { day: 'Mon', dayFull: 'Monday', date: 'Sep 9', highF: 81, highC: 27, lowF: 70, lowC: 21, condition: 'Overcast', iconCode: 'cloudy', pop: 30, precipitationAmount: '0.04 in', windMph: 10, windKmh: 16, windDirection: 'NE', windGustMph: 18, humidity: 74, uvIndex: 5, uvRating: 'Moderate', pressureHpa: 1014, summary: 'Cooler northeastern maritime flow brings cloud cover and mild temperatures.' },
  ],
  'sydney': [
    { day: 'Today', dayFull: 'Tuesday', date: 'Sep 3', highF: 68, highC: 20, lowF: 52, lowC: 11, condition: 'Sunny & Crisp', iconCode: 'clear-day', pop: 5, precipitationAmount: '0.00 in', windMph: 12, windKmh: 19, windDirection: 'WNW', windGustMph: 18, humidity: 48, uvIndex: 5, uvRating: 'Moderate', pressureHpa: 1022, summary: 'Early spring sunshine with clear skies across the harbour and light offshore winds.' },
    { day: 'Wed', dayFull: 'Wednesday', date: 'Sep 4', highF: 72, highC: 22, lowF: 54, lowC: 12, condition: 'Mild Spring Sun', iconCode: 'clear-day', pop: 0, precipitationAmount: '0.00 in', windMph: 10, windKmh: 16, windDirection: 'NW', windGustMph: 15, humidity: 45, uvIndex: 6, uvRating: 'High', pressureHpa: 1020, summary: 'Warming westerly breeze brings pleasant spring temperatures.' },
    { day: 'Thu', dayFull: 'Thursday', date: 'Sep 5', highF: 75, highC: 24, lowF: 56, lowC: 13, condition: 'Warm & Breezy', iconCode: 'partly-cloudy-day', pop: 10, precipitationAmount: '0.00 in', windMph: 15, windKmh: 24, windDirection: 'NNW', windGustMph: 22, humidity: 42, uvIndex: 6, uvRating: 'High', pressureHpa: 1016, summary: 'Warmest day with brisk northwesterly winds ahead of a southerly buster.' },
    { day: 'Fri', dayFull: 'Friday', date: 'Sep 6', highF: 63, highC: 17, lowF: 49, lowC: 9, condition: 'Southerly Surge', iconCode: 'wind', pop: 40, precipitationAmount: '0.12 in', windMph: 22, windKmh: 35, windDirection: 'S', windGustMph: 36, humidity: 68, uvIndex: 4, uvRating: 'Moderate', pressureHpa: 1024, summary: 'Sharp temperature drop following strong southerly wind change with brief coastal showers.' },
    { day: 'Sat', dayFull: 'Saturday', date: 'Sep 7', highF: 65, highC: 18, lowF: 50, lowC: 10, condition: 'Coastal Breezes', iconCode: 'partly-cloudy-day', pop: 15, precipitationAmount: '0.00 in', windMph: 14, windKmh: 23, windDirection: 'SSE', windGustMph: 20, humidity: 58, uvIndex: 5, uvRating: 'Moderate', pressureHpa: 1026, summary: 'Fresh coastal breezes with clearing skies and comfortable sunshine.' },
    { day: 'Sun', dayFull: 'Sunday', date: 'Sep 8', highF: 69, highC: 21, lowF: 52, lowC: 11, condition: 'Sunny & Calm', iconCode: 'clear-day', pop: 5, precipitationAmount: '0.00 in', windMph: 9, windKmh: 14, windDirection: 'E', windGustMph: 13, humidity: 52, uvIndex: 6, uvRating: 'High', pressureHpa: 1023, summary: 'Ideal beach and outdoor conditions with gentle sea breeze in the afternoon.' },
    { day: 'Mon', dayFull: 'Monday', date: 'Sep 9', highF: 71, highC: 22, lowF: 53, lowC: 12, condition: 'Mild & Clear', iconCode: 'clear-day', pop: 0, precipitationAmount: '0.00 in', windMph: 10, windKmh: 16, windDirection: 'NE', windGustMph: 15, humidity: 50, uvIndex: 6, uvRating: 'High', pressureHpa: 1021, summary: 'Superb weather to start the week with clear skies and mild temperatures.' },
  ],
};

export const MOCK_AIR_HEALTH = {
  'san-francisco': {
    aqi: 22,
    category: 'Good',
    dominantPollutant: 'PM2.5',
    pm25: 8.2, // µg/m³
    pm10: 14.5, // µg/m³
    o3: 24.1, // ppb
    no2: 9.8, // ppb
    co: 0.3, // ppm
    so2: 1.2, // ppb
    healthRecommendation: 'Air quality is considered satisfactory, and air pollution poses little or no risk.',
    outdoorActivityRisk: 'Minimal',
    respiratoryRisk: 'Clear',
    pollenTree: 'Low (1/5)',
    pollenGrass: 'Moderate (2/5)',
    pollenWeed: 'Low (1/5)',
    uvPeakTime: '1:15 PM',
    uvPeakValue: 5.2,
  },
  'new-york': {
    aqi: 38,
    category: 'Good',
    dominantPollutant: 'PM2.5',
    pm25: 11.4,
    pm10: 19.8,
    o3: 31.0,
    no2: 18.2,
    co: 0.5,
    so2: 2.1,
    healthRecommendation: 'Air quality is acceptable for outdoor activities and travel.',
    outdoorActivityRisk: 'Low',
    respiratoryRisk: 'Normal',
    pollenTree: 'Moderate (2/5)',
    pollenGrass: 'Moderate (2/5)',
    pollenWeed: 'Low (1/5)',
    uvPeakTime: '1:00 PM',
    uvPeakValue: 5.8,
  },
  'london': {
    aqi: 19,
    category: 'Good',
    dominantPollutant: 'NO2',
    pm25: 6.8,
    pm10: 12.1,
    o3: 22.4,
    no2: 14.2,
    co: 0.3,
    so2: 1.0,
    healthRecommendation: 'Ideal clean air conditions throughout the metropolitan area.',
    outdoorActivityRisk: 'None',
    respiratoryRisk: 'Clear',
    pollenTree: 'Low (1/5)',
    pollenGrass: 'Low (1/5)',
    pollenWeed: 'Low (1/5)',
    uvPeakTime: '1:10 PM',
    uvPeakValue: 2.4,
  },
  'tokyo': {
    aqi: 28,
    category: 'Good',
    dominantPollutant: 'PM2.5',
    pm25: 9.5,
    pm10: 16.2,
    o3: 28.3,
    no2: 16.5,
    co: 0.4,
    so2: 1.5,
    healthRecommendation: 'Satisfactory air quality with calm wind conditions.',
    outdoorActivityRisk: 'Minimal',
    respiratoryRisk: 'Clear',
    pollenTree: 'Moderate (3/5)',
    pollenGrass: 'Low (1/5)',
    pollenWeed: 'Low (1/5)',
    uvPeakTime: '11:45 AM',
    uvPeakValue: 6.8,
  },
  'sydney': {
    aqi: 15,
    category: 'Good',
    dominantPollutant: 'O3',
    pm25: 5.1,
    pm10: 10.4,
    o3: 19.8,
    no2: 7.2,
    co: 0.2,
    so2: 0.8,
    healthRecommendation: 'Pristine maritime air quality with superior clarity.',
    outdoorActivityRisk: 'None',
    respiratoryRisk: 'Optimal',
    pollenTree: 'Low (1/5)',
    pollenGrass: 'Moderate (2/5)',
    pollenWeed: 'Low (1/5)',
    uvPeakTime: '12:30 PM',
    uvPeakValue: 7.4,
  },
};

export const MOCK_SUN_MOON = {
  'san-francisco': {
    sunrise: '6:32 AM',
    sunset: '7:45 PM',
    dawn: '6:05 AM',
    dusk: '8:12 PM',
    daylightDuration: '13h 13m',
    solarNoon: '1:08 PM',
    sunAltitudeDeg: 54.2,
    goldenHourMorning: '6:32 AM – 7:15 AM',
    goldenHourEvening: '7:05 PM – 7:45 PM',
    blueHourEvening: '7:45 PM – 8:02 PM',
    moonPhase: 'Waxing Gibbous',
    moonIlluminationPct: 78,
    moonrise: '4:18 PM',
    moonset: '3:45 AM',
    moonAgeDays: 10.4,
    nextFullMoonDate: 'Sep 8, 2026',
    nextNewMoonDate: 'Sep 23, 2026',
  },
  'new-york': {
    sunrise: '6:24 AM',
    sunset: '7:28 PM',
    dawn: '5:56 AM',
    dusk: '7:55 PM',
    daylightDuration: '13h 04m',
    solarNoon: '12:56 PM',
    sunAltitudeDeg: 52.8,
    goldenHourMorning: '6:24 AM – 7:06 AM',
    goldenHourEvening: '6:49 PM – 7:28 PM',
    blueHourEvening: '7:28 PM – 7:46 PM',
    moonPhase: 'Waxing Gibbous',
    moonIlluminationPct: 78,
    moonrise: '4:02 PM',
    moonset: '3:31 AM',
    moonAgeDays: 10.4,
    nextFullMoonDate: 'Sep 8, 2026',
    nextNewMoonDate: 'Sep 23, 2026',
  },
  'london': {
    sunrise: '6:18 AM',
    sunset: '7:42 PM',
    dawn: '5:42 AM',
    dusk: '8:18 PM',
    daylightDuration: '13h 24m',
    solarNoon: '1:00 PM',
    sunAltitudeDeg: 46.1,
    goldenHourMorning: '6:18 AM – 7:04 AM',
    goldenHourEvening: '6:58 PM – 7:42 PM',
    blueHourEvening: '7:42 PM – 8:06 PM',
    moonPhase: 'Waxing Gibbous',
    moonIlluminationPct: 78,
    moonrise: '5:12 PM',
    moonset: '4:15 AM',
    moonAgeDays: 10.4,
    nextFullMoonDate: 'Sep 8, 2026',
    nextNewMoonDate: 'Sep 23, 2026',
  },
  'tokyo': {
    sunrise: '5:14 AM',
    sunset: '6:06 PM',
    dawn: '4:47 AM',
    dusk: '6:33 PM',
    daylightDuration: '12h 52m',
    solarNoon: '11:40 AM',
    sunAltitudeDeg: 58.4,
    goldenHourMorning: '5:14 AM – 5:52 AM',
    goldenHourEvening: '5:28 PM – 6:06 PM',
    blueHourEvening: '6:06 PM – 6:23 PM',
    moonPhase: 'Waxing Gibbous',
    moonIlluminationPct: 78,
    moonrise: '3:45 PM',
    moonset: '2:50 AM',
    moonAgeDays: 10.4,
    nextFullMoonDate: 'Sep 8, 2026',
    nextNewMoonDate: 'Sep 23, 2026',
  },
  'sydney': {
    sunrise: '6:12 AM',
    sunset: '5:48 PM',
    dawn: '5:47 AM',
    dusk: '6:13 PM',
    daylightDuration: '11h 36m',
    solarNoon: '12:00 PM',
    sunAltitudeDeg: 48.7,
    goldenHourMorning: '6:12 AM – 6:48 AM',
    goldenHourEvening: '5:12 PM – 5:48 PM',
    blueHourEvening: '5:48 PM – 6:04 PM',
    moonPhase: 'Waxing Gibbous',
    moonIlluminationPct: 78,
    moonrise: '2:30 PM',
    moonset: '4:10 AM',
    moonAgeDays: 10.4,
    nextFullMoonDate: 'Sep 8, 2026',
    nextNewMoonDate: 'Sep 23, 2026',
  },
};

export const MOCK_ALERTS = {
  'san-francisco': [
    {
      id: 'alert-01',
      severity: 'advisory',
      event: 'Coastal Fog & Wind Advisory',
      headline: 'Dense coastal fog and winds up to 22 mph expected this evening',
      description: 'Marine layer surge will push low visibility conditions into the Golden Gate and western SF neighborhoods between 4:30 PM and 9:00 PM.',
      effective: '4:00 PM PST',
      expires: '10:00 PM PST',
    },
  ],
};

// Simulation helpers for TanStack Query
const delay = (ms = 180) => new Promise(res => setTimeout(res, ms));

function mapWmoToCondition(code = 0, isDay = true) {
  switch (code) {
    case 0:
      return { condition: isDay ? 'Sunny' : 'Clear Sky', iconCode: isDay ? 'clear-day' : 'clear-night', description: isDay ? 'Clear, sunny skies' : 'Clear starlight conditions' };
    case 1:
      return { condition: 'Mainly Clear', iconCode: isDay ? 'clear-day' : 'clear-night', description: 'Mainly clear skies with light upper air clarity' };
    case 2:
      return { condition: 'Partly Cloudy', iconCode: isDay ? 'partly-cloudy-day' : 'partly-cloudy-night', description: 'Scattered clouds with periods of sunshine' };
    case 3:
      return { condition: 'Overcast', iconCode: 'cloudy', description: 'Overcast stratiform cloud cover' };
    case 45:
    case 48:
      return { condition: 'Foggy', iconCode: 'fog', description: 'Reduced horizontal visibility and coastal mist' };
    case 51:
    case 53:
    case 55:
      return { condition: 'Light Drizzle', iconCode: 'drizzle', description: 'Light atmospheric mist and intermittent drizzle' };
    case 61:
    case 63:
      return { condition: 'Rain', iconCode: 'rain', description: 'Active precipitation and wet roadway conditions' };
    case 65:
      return { condition: 'Heavy Rain', iconCode: 'heavy-rain', description: 'Heavy precipitation with localized pooling' };
    case 71:
    case 73:
    case 75:
    case 77:
      return { condition: 'Snow', iconCode: 'snow', description: 'Snow precipitation and chilly ground conditions' };
    case 80:
    case 81:
    case 82:
      return { condition: 'Rain Showers', iconCode: 'rain', description: 'Passing convective rain showers' };
    case 85:
    case 86:
      return { condition: 'Snow Showers', iconCode: 'snow', description: 'Occasional wintry snow showers' };
    case 95:
      return { condition: 'Thunderstorm', iconCode: 'thunderstorm', description: 'Convective thunderstorm with gusty surface winds' };
    case 96:
    case 99:
      return { condition: 'Severe Storm', iconCode: 'thunderstorm', description: 'Severe thunderstorm with possible hail activity' };
    default:
      return { condition: isDay ? 'Sunny' : 'Clear', iconCode: isDay ? 'clear-day' : 'clear-night', description: 'Favorable meteorological observations' };
  }
}

function degreesToCardinal(deg = 0) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const idx = Math.round((((deg % 360) + 360) % 360) / 22.5);
  return directions[idx % 16];
}

function formatIsoToTime(isoStr, fallback = '6:30 AM') {
  if (!isoStr) return fallback;
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return fallback;
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch {
    return fallback;
  }
}

function resolveLocationCoordinates(locationInput) {
  let lat = 37.7749;
  let lon = -122.4194;
  let city = 'San Francisco';
  let country = 'United States';
  let timezone = 'auto';
  let locKey = 'san-francisco';

  if (typeof locationInput === 'object' && locationInput !== null) {
    lat = locationInput.latitude ?? locationInput.lat ?? 37.7749;
    lon = locationInput.longitude ?? locationInput.lon ?? -122.4194;
    city = locationInput.city || locationInput.name || 'Active Station';
    country = locationInput.country || '';
    timezone = locationInput.timezone || 'auto';
    locKey = locationInput.id || `${Number(lat).toFixed(2)},${Number(lon).toFixed(2)}`;
  } else if (typeof locationInput === 'string') {
    locKey = locationInput;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('atmosphere_saved_locations_v1');
        if (stored) {
          const saved = JSON.parse(stored);
          const match = saved.find(
            (l) => l.id === locationInput || l.city?.toLowerCase() === locationInput.toLowerCase()
          );
          if (match) {
            lat = match.latitude ?? match.lat ?? lat;
            lon = match.longitude ?? match.lon ?? lon;
            city = match.city || match.name || city;
            country = match.country || country;
            timezone = match.timezone || timezone;
            return { lat, lon, city, country, timezone, locKey };
          }
        }
      } catch {}
    }

    const found = MOCK_LOCATIONS.find(
      (l) => l.id === locationInput || l.city?.toLowerCase() === locationInput.toLowerCase()
    );
    if (found) {
      lat = found.lat || found.latitude || lat;
      lon = found.lon || found.longitude || lon;
      city = found.name || found.city || city;
      country = found.country || country;
      timezone = found.timezone || timezone;
    }
  }

  return { lat, lon, city, country, timezone, locKey };
}

export async function fetchLocations() {
  await delay(120);
  return MOCK_LOCATIONS;
}

export async function fetchCurrentWeather(locationInput = 'san-francisco') {
  const { lat, lon, city, country, locKey } = resolveLocationCoordinates(locationInput);

  // Fetch real live weather from Open-Meteo API
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,visibility,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`;

    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const current = data.current || {};
      const daily = data.daily || {};
      const hourly = data.hourly || {};

      const tempC = Math.round(current.temperature_2m ?? 20);
      const tempF = Math.round((tempC * 9) / 5 + 32);
      const feelsLikeC = Math.round(current.apparent_temperature ?? tempC);
      const feelsLikeF = Math.round((feelsLikeC * 9) / 5 + 32);

      const highC = daily.temperature_2m_max?.[0] !== undefined ? Math.round(daily.temperature_2m_max[0]) : tempC + 4;
      const highF = Math.round((highC * 9) / 5 + 32);
      const lowC = daily.temperature_2m_min?.[0] !== undefined ? Math.round(daily.temperature_2m_min[0]) : tempC - 4;
      const lowF = Math.round((lowC * 9) / 5 + 32);

      const wmoCode = current.weather_code ?? 0;
      const isDay = current.is_day !== 0;
      const { condition, iconCode, description } = mapWmoToCondition(wmoCode, isDay);

      const humidity = Math.round(current.relative_humidity_2m ?? 50);
      const windKmh = Math.round(current.wind_speed_10m ?? 10);
      const windMph = Math.round(windKmh * 0.621371);
      const windGustKmh = Math.round(current.wind_gusts_10m ?? windKmh * 1.25);
      const windGustMph = Math.round(windGustKmh * 0.621371);
      const windDirection = Math.round(current.wind_direction_10m ?? 180);
      const windCardinal = degreesToCardinal(windDirection);

      const pressureHpa = Math.round(current.surface_pressure ?? 1013);
      const currentUv = hourly.uv_index?.[0] !== undefined ? Math.round(hourly.uv_index[0]) : 4;
      const uvLevel = currentUv > 7 ? 'Very High' : currentUv > 5 ? 'High' : currentUv > 2 ? 'Moderate' : 'Low';

      const visMeters = hourly.visibility?.[0] !== undefined ? hourly.visibility[0] : 10000;
      const visibilityKm = Math.round((visMeters / 1000) * 10) / 10;
      const visibilityMiles = Math.round((visMeters / 1609.34) * 10) / 10;

      const rainChance = hourly.precipitation_probability?.[0] ?? daily.precipitation_probability_max?.[0] ?? 0;
      const cloudCover = Math.round(current.cloud_cover ?? 20);

      const sunriseStr = formatIsoToTime(daily.sunrise?.[0], '6:30 AM');
      const sunsetStr = formatIsoToTime(daily.sunset?.[0], '7:15 PM');

      const dewPointC = Math.round(tempC - ((100 - humidity) / 5));
      const dewPointF = Math.round((dewPointC * 9) / 5 + 32);

      return {
        locationId: locKey,
        city,
        country,
        tempF,
        tempC,
        feelsLikeF,
        feelsLikeC,
        highF,
        highC,
        lowF,
        lowC,
        condition,
        iconCode,
        humidity,
        uvIndex: currentUv,
        uvLevel,
        aqi: 38,
        aqiStatus: 'Good',
        pressureHpa,
        windMph,
        windKmh,
        windDirection: windCardinal,
        windDirectionDeg: windDirection,
        windGustMph,
        visibilityMiles,
        visibilityKm,
        dewPointF,
        dewPointC,
        cloudCover,
        sunrise: sunriseStr,
        sunset: sunsetStr,
        rainChance,
        simpleSummary: `${condition} in ${city}. High of ${tempC}°C (${tempF}°F) with ${humidity}% humidity.`,
        summary: `${description}. Atmospheric pressure at ${pressureHpa} hPa. Surface winds from ${windCardinal} at ${windKmh} km/h.`,
        lastUpdated: 'Live sensor sync',
        isRealData: true,
      };
    }
  } catch (err) {
    console.warn('[WeatherAPI] Live current weather fetch error, using fallback:', err.message);
  }

  return MOCK_CURRENT_WEATHER[locKey] || MOCK_CURRENT_WEATHER['san-francisco'];
}

export async function fetchHourlyForecast(locationInput = 'san-francisco') {
  const { lat, lon, locKey } = resolveLocationCoordinates(locationInput);

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,visibility,wind_speed_10m,wind_direction_10m&timezone=auto`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const hourly = data.hourly || {};
      const times = hourly.time || [];
      const currentHour = new Date().getHours();

      // Take next 24 to 48 hours starting from current local hour
      const result = [];
      const count = Math.min(times.length, 48);

      for (let i = 0; i < count; i++) {
        const timeIso = times[i];
        const d = new Date(timeIso);
        const hour = d.getHours();
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 === 0 ? 12 : hour % 12;
        const timeLabel = i === 0 ? 'Now' : `${hour12} ${ampm}`;

        const tempC = Math.round(hourly.temperature_2m?.[i] ?? 20);
        const tempF = Math.round((tempC * 9) / 5 + 32);
        const pop = Math.round(hourly.precipitation_probability?.[i] ?? 0);
        const wCode = hourly.weather_code?.[i] ?? 0;
        const isDayTime = hour >= 6 && hour < 19;
        const { condition, iconCode } = mapWmoToCondition(wCode, isDayTime);

        result.push({
          time: timeLabel,
          hour24: hour,
          tempF,
          tempC,
          condition,
          iconCode,
          pop,
          precipitationProbability: pop,
          humidity: Math.round(hourly.relative_humidity_2m?.[i] ?? 50),
          windMph: Math.round((hourly.wind_speed_10m?.[i] ?? 10) * 0.621371),
          windDirection: degreesToCardinal(hourly.wind_direction_10m?.[i] ?? 180),
          isNow: i === 0,
        });
      }

      if (result.length > 0) {
        return result;
      }
    }
  } catch (e) {
    console.warn('[WeatherAPI] Live hourly forecast error, using fallback:', e.message);
  }

  return MOCK_HOURLY_FORECAST[locKey] || MOCK_HOURLY_FORECAST['san-francisco'];
}

export async function fetchDailyForecast(locationInput = 'san-francisco') {
  const { lat, lon, locKey } = resolveLocationCoordinates(locationInput);

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const daily = data.daily || {};
      const dates = daily.time || [];
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const daysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      const result = [];
      for (let i = 0; i < dates.length; i++) {
        const d = new Date(dates[i]);
        const dayName = i === 0 ? 'Today' : days[d.getDay()];
        const dayFullName = i === 0 ? 'Today' : daysFull[d.getDay()];
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const maxC = Math.round(daily.temperature_2m_max?.[i] ?? 22);
        const maxF = Math.round((maxC * 9) / 5 + 32);
        const minC = Math.round(daily.temperature_2m_min?.[i] ?? 14);
        const minF = Math.round((minC * 9) / 5 + 32);

        const wCode = daily.weather_code?.[i] ?? 0;
        const { condition, iconCode, description } = mapWmoToCondition(wCode, true);
        const pop = Math.round(daily.precipitation_probability_max?.[i] ?? 0);
        const windKmh = Math.round(daily.wind_speed_10m_max?.[i] ?? 15);

        result.push({
          id: `day-${i + 1}`,
          day: dayName,
          dayFull: dayFullName,
          date: dateStr,
          highF: maxF,
          highC: maxC,
          lowF: minF,
          lowC: minC,
          condition,
          iconCode,
          pop,
          precipitationAmount: pop > 30 ? '0.12 in' : '0.00 in',
          precipitationType: pop > 30 ? 'rain' : 'none',
          windMph: Math.round(windKmh * 0.621371),
          windKmh,
          windDirection: 'NW',
          windGustMph: Math.round(windKmh * 0.8),
          humidity: 55,
          uvIndex: Math.round(daily.uv_index_max?.[i] ?? 5),
          uvRating: (daily.uv_index_max?.[i] ?? 5) > 6 ? 'High' : 'Moderate',
          pressureHpa: 1014,
          dewPointF: 50,
          dewPointC: 10,
          cloudCover: 25,
          sunrise: formatIsoToTime(daily.sunrise?.[i], '6:30 AM'),
          sunset: formatIsoToTime(daily.sunset?.[i], '7:15 PM'),
          daylightDuration: '13h 10m',
          summary: description,
          recommendations: {
            attire: 'Comfortable seasonal attire.',
            outdoor: 'Ideal conditions for routine travel and outdoor activities.',
            advisory: null,
          },
          dayParts: [
            { part: 'Morning', time: '8:00 AM', tempF: minF + 4, tempC: minC + 2, condition, iconCode, pop: Math.round(pop * 0.4) },
            { part: 'Afternoon', time: '1:00 PM', tempF: maxF, tempC: maxC, condition, iconCode, pop },
            { part: 'Evening', time: '6:00 PM', tempF: maxF - 4, tempC: maxC - 2, condition, iconCode, pop: Math.round(pop * 0.6) },
            { part: 'Overnight', time: '11:00 PM', tempF: minF, tempC: minC, condition, iconCode, pop: 0 },
          ],
        });
      }

      if (result.length > 0) return result;
    }
  } catch (e) {
    console.warn('[WeatherAPI] Live daily forecast error, using fallback:', e.message);
  }

  return MOCK_DAILY_FORECAST[locKey] || MOCK_DAILY_FORECAST['san-francisco'];
}

export async function fetchAirHealth(locationInput = 'san-francisco') {
  const { lat, lon, city, locKey } = resolveLocationCoordinates(locationInput);

  // 1. Try backend endpoint first
  try {
    const res = await apiClient.get(`/air-quality?lat=${lat}&lon=${lon}&city=${encodeURIComponent(city)}`);
    if (res?.success && res?.data) {
      return res.data;
    }
  } catch (error) {
    // Continue to open-meteo air quality
  }

  // 2. Try Open-Meteo Air Quality API
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const cur = data.current || {};
      const aqi = Math.round(cur.us_aqi ?? cur.european_aqi ?? 36);
      const aqiStatus = aqi <= 50 ? 'Good' : aqi <= 100 ? 'Moderate' : aqi <= 150 ? 'Unhealthy for Sensitive Groups' : 'Unhealthy';

      return {
        aqi,
        status: aqiStatus,
        dominantPollutant: 'PM2.5',
        advisory: aqi <= 50 ? 'Air quality is satisfactory and air pollution poses little or no risk.' : 'Sensitive individuals should consider limiting prolonged outdoor exertion.',
        pollutants: [
          { name: 'PM2.5', code: 'pm25', value: Math.round((cur.pm2_5 ?? 8.5) * 10) / 10, unit: 'µg/m³', status: (cur.pm2_5 ?? 8.5) <= 12 ? 'Good' : 'Moderate', percent: Math.min(100, Math.round(((cur.pm2_5 ?? 8.5) / 35) * 100)) },
          { name: 'PM10', code: 'pm10', value: Math.round((cur.pm10 ?? 16) * 10) / 10, unit: 'µg/m³', status: (cur.pm10 ?? 16) <= 54 ? 'Good' : 'Moderate', percent: Math.min(100, Math.round(((cur.pm10 ?? 16) / 150) * 100)) },
          { name: 'Ozone', code: 'o3', value: Math.round((cur.ozone ?? 38) * 10) / 10, unit: 'ppb', status: 'Good', percent: 45 },
          { name: 'Nitrogen Dioxide', code: 'no2', value: Math.round((cur.nitrogen_dioxide ?? 12) * 10) / 10, unit: 'ppb', status: 'Good', percent: 25 },
        ],
        pollen: { tree: 'Low', grass: 'Low', weed: 'Low' },
      };
    }
  } catch (e) {
    console.warn('[AirQuality API] Live fetch fallback to catalog:', e.message);
  }

  await delay(100);
  return MOCK_AIR_HEALTH[locKey] || MOCK_AIR_HEALTH['san-francisco'];
}

export async function fetchSunMoon(locationInput = 'san-francisco') {
  const { lat, lon, locKey } = resolveLocationCoordinates(locationInput);

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset&timezone=auto`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const daily = data.daily || {};
      const sunrise = formatIsoToTime(daily.sunrise?.[0], '6:20 AM');
      const sunset = formatIsoToTime(daily.sunset?.[0], '7:15 PM');

      return {
        sunrise,
        sunset,
        dawn: '5:50 AM',
        dusk: '7:45 PM',
        daylightDuration: '13h 05m',
        solarNoon: '12:45 PM',
        sunAltitudeDeg: 55.0,
        goldenHourMorning: `${sunrise} – 7:10 AM`,
        goldenHourEvening: `6:40 PM – ${sunset}`,
        blueHourEvening: `${sunset} – 7:45 PM`,
        moonPhase: 'Waxing Crescent',
        moonIlluminationPct: 45,
        moonrise: '2:15 PM',
        moonset: '1:45 AM',
        moonAgeDays: 5.2,
        nextFullMoonDate: 'Oct 14, 2026',
        nextNewMoonDate: 'Oct 28, 2026',
      };
    }
  } catch (e) {
    console.warn('[SunMoon API] Live fetch notice:', e.message);
  }

  await delay(120);
  return MOCK_SUN_MOON[locKey] || MOCK_SUN_MOON['san-francisco'];
}

export async function fetchAlerts(locationInput = 'san-francisco') {
  const { locKey } = resolveLocationCoordinates(locationInput);
  await delay(100);
  return MOCK_ALERTS[locKey] || [];
}
