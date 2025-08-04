namespace AgentOS.Backend.Services;

public class MockAIProvider : IAIProvider
{
    public Task<string> QueryAsync(string message)
    {
        return Task.FromResult($"[MockAI] You said: {message}");
    }
}