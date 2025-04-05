import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import {
  WebTracerProvider,
  BatchSpanProcessor,
} from '@opentelemetry/sdk-trace-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';

// Konfiguration des Exporters
// Annahme: Der Collector läuft auf dem gleichen Host und ist über Port 4318 erreichbar.
// Wichtig: Der Pfad /v1/traces ist der Standard für HTTP/protobuf.
const exporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces', // URL des OTel Collectors (HTTP)
  headers: {}, // Leere Header
});

// Span Processor erstellen
const processor = new BatchSpanProcessor(exporter);

// Resource separat erstellen
const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: 'frontend-angular',
  [SemanticResourceAttributes.SERVICE_VERSION]: '0.1.0',
});

// Konfiguration des Providers
const provider = new WebTracerProvider({
  resource: resource, // Übergebe die separate Instanz
  spanProcessors: [processor],
});

// Context Manager und Provider registrieren
provider.register({
  contextManager: new ZoneContextManager(),
});

// Automatische Instrumentierungen registrieren
registerInstrumentations({
  // tracerProvider: provider, // Optional: Explizit übergeben, falls nötig
  instrumentations: [
    new DocumentLoadInstrumentation(),
    new FetchInstrumentation({
      // Ignoriere Anfragen an den Collector selbst, um Endlosschleifen zu vermeiden
      ignoreUrls: [/localhost:4318\/v1\/traces/],
      // Füge den Trace-Kontext zu den Headern hinzu
      propagateTraceHeaderCorsUrls: [
        /.+/, // Wichtig: Für alle URLs den Header hinzufügen (inkl. API Gateway)
      ],
      clearTimingResources: true,
    }),
    new XMLHttpRequestInstrumentation({
      // Ignoriere Anfragen an den Collector selbst
      ignoreUrls: [/localhost:4318\/v1\/traces/],
      // Füge den Trace-Kontext zu den Headern hinzu
      propagateTraceHeaderCorsUrls: [
        /.+/, // Wichtig: Für alle URLs den Header hinzufügen (inkl. API Gateway)
      ],
    }),
  ],
});

console.log('OpenTelemetry Web Tracer initialisiert für frontend-angular');
