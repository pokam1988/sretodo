using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

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
            Console.WriteLine($"[Statistics] Successfully retrieved {todoCount} ToDos.");
        }
        else
        {
            errorMessage = $"Failed to retrieve ToDos. Status: {response.StatusCode}";
            Console.WriteLine($"[Statistics] Error: {errorMessage}");
        }
    }
    catch (Exception ex)
    {
        errorMessage = $"Error connecting to ToDo service: {ex.Message}";
        Console.WriteLine($"[Statistics] Exception: {errorMessage}");
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


Console.WriteLine("Statistics Service started.");
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
