namespace AgentOS.Backend.Services;

public interface IAIProviderResolver
{
    IAIProvider Resolve(string? name);
}