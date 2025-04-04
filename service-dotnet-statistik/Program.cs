using System.Text.Json.Serialization;
using OpenTelemetry.Trace;
using OpenTelemetry.Resources;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;

var builder = WebApplication.CreateBuilder(args);

// --- OpenTelemetry Initialisierung START ---
var serviceName = Environment.GetEnvironmentVariable("OTEL_SERVICE_NAME") ?? "service-dotnet-statistik";
var otlpEndpoint = Environment.GetEnvironmentVariable("OTEL_EXPORTER_OTLP_ENDPOINT") ?? "http://otel-collector:4317"; // gRPC

builder.Logging.AddOpenTelemetry(logging =>
{
    logging.IncludeFormattedMessage = true;
    logging.IncludeScopes = true;
    logging.SetResourceBuilder(ResourceBuilder.CreateDefault().AddService(serviceName));
    logging.AddOtlpExporter(options =>
    {
        options.Endpoint = new Uri(otlpEndpoint);
        options.Protocol = OpenTelemetry.Exporter.OtlpExportProtocol.Grpc;
    });
});

builder.Services.AddOpenTelemetry()
    .ConfigureResource(resource => resource.AddService(serviceName))
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddSource(serviceName) // Eigene Quellen hinzufügen, falls manuell getraced wird
        .AddOtlpExporter(options =>
        {
            options.Endpoint = new Uri(otlpEndpoint);
            options.Protocol = OpenTelemetry.Exporter.OtlpExportProtocol.Grpc;
        }))
    .WithMetrics(metrics => metrics
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddRuntimeInstrumentation() // Runtime-Metriken (GC, etc.)
        .AddMeter(serviceName) // Eigene Meter hinzufügen, falls manuell gemessen wird
        .AddOtlpExporter(options =>
        {
            options.Endpoint = new Uri(otlpEndpoint);
            options.Protocol = OpenTelemetry.Exporter.OtlpExportProtocol.Grpc;
        }));
// --- OpenTelemetry Initialisierung END ---

// --- URLs explizit nur auf HTTP 8080 setzen ---
builder.WebHost.UseUrls("http://+:8080");

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- HTTP Client für Service-Kommunikation konfigurieren ---
builder.Services.AddHttpClient("TodoServiceClient", client =>
{
    // Basis-URL für den ToDo-Service im Docker-Netzwerk
    client.BaseAddress = new Uri("http://service-java-todo:8080/");
    client.DefaultRequestHeaders.Add("Accept", "application/json");
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// HTTPS Redirection entfernen, da wir intern HTTP verwenden und extern über einen Proxy/Gateway gehen würden
// app.UseHttpsRedirection();

// --- Endpunkt für Statistiken ---
app.MapGet("/statistics", async (IHttpClientFactory clientFactory) =>
{
    var httpClient = clientFactory.CreateClient("TodoServiceClient");
    int todoCount = 0;
    string? errorMessage = null;

    try
    {
        // Rufe den /todos Endpunkt des Java-Service auf
        var response = await httpClient.GetAsync("/todos");

        if (response.IsSuccessStatusCode)
        {
            var todos = await response.Content.ReadFromJsonAsync<List<TodoItem>>();
            todoCount = todos?.Count ?? 0;
            app.Logger.LogInformation("Successfully retrieved {TodoCount} ToDos.", todoCount);
        }
        else
        {
            errorMessage = $"Failed to retrieve ToDos. Status: {response.StatusCode}";
            app.Logger.LogError("Failed to retrieve ToDos. Status: {StatusCode}", response.StatusCode);
        }
    }
    catch (Exception ex)
    {
        errorMessage = $"Error connecting to ToDo service: {ex.Message}";
        app.Logger.LogError(ex, "Error connecting to ToDo service.");
        // Optional: Hier könnte man einen Circuit Breaker oder bessere Fehlerbehandlung einbauen
        // Für den MVP geben wir einfach 0 zurück mit Fehlermeldung
    }

    // Gib die Statistik zurück
    return Results.Ok(new { TotalTodos = todoCount, Error = errorMessage });

})
.WithName("GetStatistics")
.WithOpenApi();

// --- Health Check Endpunkt (Beispiel) ---
app.MapGet("/health", () => Results.Ok(new { status = "UP" }))
.WithName("HealthCheck")
.WithOpenApi();

// Console.WriteLine("Statistics Service started."); // Ersetzt durch Logging
app.Logger.LogInformation("Statistics Service starting.");
app.Run();

// --- Datenmodell für die Deserialisierung der ToDo-Antwort ---
// Muss den Feldern aus dem Java Service entsprechen
public class TodoItem
{
    [JsonPropertyName("id")] // Map JSON 'id' to C# 'Id'
    public long Id { get; set; }

    [JsonPropertyName("title")]
    public string? Title { get; set; }

    [JsonPropertyName("completed")]
    public bool Completed { get; set; }
}
