import mongoose from 'mongoose';

/**
 * Saved Location Schema Definition for Atmosphere AI
 * Fields:
 * - userId
 * - city
 * - country
 * - latitude
 * - longitude
 * - timezone
 * - favorite
 */
const locationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    city: {
      type: String,
      required: [true, 'City name is required'],
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default: 'United States',
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude coordinate is required'],
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude coordinate is required'],
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    favorite: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for name alias (backwards compatibility)
locationSchema.virtual('name').get(function () {
  return this.city;
});

// Virtual for isDefault alias (backwards compatibility)
locationSchema.virtual('isDefault').get(function () {
  return this.favorite;
});

// Compound Indexes for fast querying per user
locationSchema.index({ userId: 1, city: 1 });
locationSchema.index({ userId: 1, favorite: -1 });

export const Location = mongoose.model('Location', locationSchema);
export default Location;
