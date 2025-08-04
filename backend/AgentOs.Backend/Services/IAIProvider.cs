namespace AgentOS.Backend.Services;

public interface IAIProvider
{
    Task<string> QueryAsync(string message);
}