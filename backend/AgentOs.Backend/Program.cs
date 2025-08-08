using AgentOS.Backend.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Bind Ollama options + register both providers
var ollamaOpts = builder.Configuration.GetSection("AI:Ollama").Get<OllamaOptions>() ?? new();
builder.Services.AddSingleton(ollamaOpts);
builder.Services.AddHttpClient<OllamaAIProvider>();
builder.Services.AddScoped<MockAIProvider>();

// Provider resolver (runtime selection)
builder.Services.AddScoped<IAIProviderResolver, AIProviderResolver>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();