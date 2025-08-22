using System.Threading.Tasks;

namespace AgentOS.Lite.Backend.Providers;

public class MockAIProvider : IAIProvider
{
    public Task<string> QueryAsync(string prompt)
    {
        // Simple echo with mock prefix
        return Task.FromResult($"[Mock Response] You said: {prompt}");
    }
}