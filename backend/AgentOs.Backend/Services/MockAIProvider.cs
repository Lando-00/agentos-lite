
namespace AgentOS.Backend.Services;

public class MockAIProvider : IAIProvider
{
    public Task<string> QueryAsync(string message)
    {
        return Task.FromResult($"[MockAI] You said: {message}");
    }

    public IAsyncEnumerable<string> StreamAsync(string message, CancellationToken ct = default)
    {
        return GetChunks($"[MockAI] You said: {message}");
    }

    private async IAsyncEnumerable<string> GetChunks(string response)
    {
        for (int i = 0; i < response.Length; i++)
        {
            yield return response[i].ToString();
            await Task.Delay(100); // Simulate streaming delay
        }
    }
}