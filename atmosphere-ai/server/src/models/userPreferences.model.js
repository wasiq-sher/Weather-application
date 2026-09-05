import mongoose from 'mongoose';

/**
 * User Preferences Schema Definition for Atmosphere AI
 * Fields:
 * - userId (unique index)
 * - temperatureUnit ('F' | 'C')
 * - windUnit ('mph' | 'km/h' | 'knots' | 'm/s')
 * - theme ('dark' | 'light' | 'system')
 * - notificationsEnabled (boolean)
 * - defaultLocation
 */
const userPreferencesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
      index: true,
    },
    temperatureUnit: {
      type: String,
      enum: ['F', 'C'],
      default: 'F',
    },
    windUnit: {
      type: String,
      enum: ['mph', 'km/h', 'knots', 'm/s'],
      default: 'mph',
    },
    theme: {
      type: String,
      enum: ['dark', 'light', 'system'],
      default: 'dark',
    },
    notificationsEnabled: {
      type: Boolean,
      default: true,
    },
    defaultLocation: {
      type: mongoose.Schema.Types.Mixed,
      default: 'San Francisco, CA',
    },
    aiAssistantPreferences: {
      responseStyle: {
        type: String,
        enum: ['concise', 'detailed'],
        default: 'concise',
      },
      focusArea: {
        type: String,
        enum: ['general', 'clothing', 'outdoor', 'commute'],
        default: 'general',
      },
      enforceGroundedData: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const UserPreferences = mongoose.model('UserPreferences', userPreferencesSchema);
export default UserPreferences;
