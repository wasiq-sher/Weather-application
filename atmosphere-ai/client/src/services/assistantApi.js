/**
 * Centralized Weather Assistant API Service
 * Sends questions to the backend /api/assistant/ask endpoint using the
 * currently selected location telemetry and units.
 */
export async function askWeatherAssistant({ question, location, units = 'F' }) {
  if (!question || typeof question !== 'string' || !question.trim()) {
    throw new Error('Question is required.');
  }

  const token = localStorage.getItem('atmosphere_jwt_token');

  const bodyPayload = {
    question: question.trim(),
    city: location?.name || location?.city || 'San Francisco',
    lat: location?.latitude ?? location?.lat ?? 37.7749,
    lon: location?.longitude ?? location?.lon ?? -122.4194,
    units: units || 'F',
  };

  const response = await fetch('/api/assistant/ask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(bodyPayload),
  });

  const resData = await response.json();

  if (!response.ok || !resData.success) {
    throw new Error(resData.error?.message || resData.message || 'Failed to analyze weather telemetry.');
  }

  return resData.data;
}

export default askWeatherAssistant;
