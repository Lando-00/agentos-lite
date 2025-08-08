namespace AgentOS.Backend.Services;

public interface IAIProvider
{
    Task<string> QueryAsync(string message);

    // New: streaming API. Yields tokens as they arrive.
    IAsyncEnumerable<string> StreamAsync(string message, CancellationToken ct = default);
}