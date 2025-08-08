using Microsoft.Extensions.Configuration;

namespace AgentOS.Backend.Services;

public class AIProviderResolver : IAIProviderResolver
{
    private readonly OllamaAIProvider _ollama;
    private readonly MockAIProvider _mock;
    private readonly string _defaultProvider;

    public AIProviderResolver(
        OllamaAIProvider ollama,
        MockAIProvider mock,
        IConfiguration config)
    {
        _ollama = ollama;
        _mock = mock;
        _defaultProvider = config.GetSection("AI").GetValue<string>("Provider") ?? "Mock";
    }

    public IAIProvider Resolve(string? name)
    {
        var key = string.IsNullOrWhiteSpace(name) ? _defaultProvider : name;
        return key.Equals("Ollama", StringComparison.OrdinalIgnoreCase) ? _ollama : _mock;
    }
}