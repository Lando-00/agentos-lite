using AgentOS.Backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Config binding
var aiSection = builder.Configuration.GetSection("AI");
var providerName = aiSection.GetValue<string>("Provider") ?? "Mock";

// Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

if (string.Equals(providerName, "Ollama", StringComparison.OrdinalIgnoreCase))
{
    var ollamaOpts = aiSection.GetSection("Ollama").Get<OllamaOptions>() ?? new OllamaOptions();
    builder.Services.AddSingleton(ollamaOpts);
    builder.Services.AddHttpClient<IAIProvider, OllamaAIProvider>();
}
else
{
    builder.Services.AddScoped<IAIProvider, MockAIProvider>();
}

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();