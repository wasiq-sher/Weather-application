import React from 'react';
import { Bot } from 'lucide-react';
import SectionHeader from '../components/SectionHeader.jsx';
import Badge from '../components/Badge.jsx';
import WeatherAssistant from '../components/WeatherAssistant.jsx';

/**
 * AssistantPage - Full Weather Intelligence Conversational AI
 * Grounded conversational model providing real weather data analysis.
 */
export default function AssistantPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <SectionHeader
        title="Atmosphere AI Weather Assistant"
        subtitle="Conversational atmospheric intelligence grounded strictly in live telemetry streams"
        icon={Bot}
        badge={<Badge variant="ai">Grounded Gemini Flash</Badge>}
      />

      {/* Main Weather Assistant Component */}
      <WeatherAssistant />
    </div>
  );
}

