using AgentOS.Lite.Backend.Providers;

var builder = WebApplication.CreateBuilder(args);

// CORS for frontend
// CORS: allow the Vite dev server origin
const string CorsPolicy = "FrontendDev";
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

// ✅ Swagger services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DI for your provider
builder.Services.AddScoped<AgentOS.Lite.Backend.Providers.IAIProvider, AgentOS.Lite.Backend.Providers.MockAIProvider>();

var app = builder.Build();

app.UseCors(CorsPolicy);

// ✅ Swagger middleware (usually fine in Development)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.Run();
