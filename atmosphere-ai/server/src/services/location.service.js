import Location from '../models/location.model.js';
import mongoose from 'mongoose';

/**
 * In-memory fallback locations store when MongoDB is not connected
 */
let inMemoryLocations = [
  {
    _id: 'loc-sf-001',
    id: 'loc-sf-001',
    name: 'San Francisco',
    city: 'San Francisco',
    region: 'CA',
    country: 'United States',
    latitude: 37.7749,
    longitude: -122.4194,
    timezone: 'America/Los_Angeles',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'loc-ny-002',
    id: 'loc-ny-002',
    name: 'New York',
    city: 'New York',
    region: 'NY',
    country: 'United States',
    latitude: 40.7128,
    longitude: -74.0060,
    timezone: 'America/New_York',
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'loc-tokyo-003',
    id: 'loc-tokyo-003',
    name: 'Tokyo',
    city: 'Tokyo',
    region: 'Kanto',
    country: 'Japan',
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: 'Asia/Tokyo',
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'loc-london-004',
    id: 'loc-london-004',
    name: 'London',
    city: 'London',
    region: 'Greater London',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'Europe/London',
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
];

export class LocationService {
  /**
   * Helper to check if Mongoose is connected
   */
  isMongoConnected() {
    return mongoose.connection.readyState === 1;
  }

  /**
   * Get list of saved locations
   * @param {Object} query
   * @returns {Promise<Array>}
   */
  async getLocations(query = {}) {
    if (this.isMongoConnected()) {
      const filter = {};
      if (query.userId) filter.userId = query.userId;
      if (query.q) {
        filter.$or = [
          { name: { $regex: query.q, $options: 'i' } },
          { country: { $regex: query.q, $options: 'i' } },
          { region: { $regex: query.q, $options: 'i' } },
        ];
      }
      return await Location.find(filter).sort({ createdAt: -1 }).lean();
    }

    // In-memory fallback
    let results = [...inMemoryLocations];
    if (query.q) {
      const term = query.q.toLowerCase();
      results = results.filter(
        (loc) =>
          loc.name.toLowerCase().includes(term) ||
          loc.country.toLowerCase().includes(term) ||
          (loc.region && loc.region.toLowerCase().includes(term))
      );
    }
    return results;
  }

  /**
   * Create a new saved location
   * @param {Object} locationData
   * @returns {Promise<Object>}
   */
  async createLocation(locationData) {
    if (this.isMongoConnected()) {
      const location = new Location({
        name: locationData.name || locationData.city,
        region: locationData.region || '',
        country: locationData.country || 'US',
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        timezone: locationData.timezone || 'UTC',
        isDefault: Boolean(locationData.isDefault),
        userId: locationData.userId || null,
      });
      return await location.save();
    }

    // In-memory fallback
    const id = `loc-${Date.now()}`;
    const newLoc = {
      _id: id,
      id,
      name: locationData.name || locationData.city,
      city: locationData.name || locationData.city,
      region: locationData.region || '',
      country: locationData.country || 'US',
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      timezone: locationData.timezone || 'UTC',
      isDefault: Boolean(locationData.isDefault),
      createdAt: new Date().toISOString(),
    };
    inMemoryLocations.unshift(newLoc);
    return newLoc;
  }

  /**
   * Delete a location by ID and verify ownership
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<Object|boolean>}
   */
  async deleteLocation(id, userId = null) {
    if (this.isMongoConnected()) {
      const query = { _id: id };
      if (userId) query.userId = userId;
      const deleted = await Location.findOneAndDelete(query);
      return deleted;
    }

    // In-memory fallback
    const index = inMemoryLocations.findIndex((loc) => loc.id === id || loc._id === id);
    if (index !== -1) {
      const removed = inMemoryLocations.splice(index, 1)[0];
      return removed;
    }
    return null;
  }
}

export const locationService = new LocationService();
export default locationService;
