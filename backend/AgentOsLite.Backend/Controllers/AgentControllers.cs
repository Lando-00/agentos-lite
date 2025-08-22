using Microsoft.AspNetCore.Mvc;
using AgentOS.Lite.Backend.Providers;

namespace AgentOS.Lite.Backend.Controllers;

[ApiController]
[Route("api/agent")]
public class AgentController : ControllerBase
{
    private readonly IAIProvider _aiProvider;

    public AgentController(IAIProvider aiProvider)
    {
        _aiProvider = aiProvider;
    }

    [HttpPost("query")]
    public async Task<IActionResult> Query([FromBody] QueryRequest request)
    {
        var response = await _aiProvider.QueryAsync(request.Prompt);
        return Ok(new { reply = response });
    }
}

public class QueryRequest
{
    public string Prompt { get; set; } = string.Empty;
}