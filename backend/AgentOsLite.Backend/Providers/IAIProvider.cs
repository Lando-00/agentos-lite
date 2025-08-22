namespace AgentOS.Lite.Backend.Providers;

public interface IAIProvider
{
    Task<string> QueryAsync(string prompt);
}