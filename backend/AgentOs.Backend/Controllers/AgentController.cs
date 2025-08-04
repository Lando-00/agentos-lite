using Microsoft.AspNetCore.Mvc;
using AgentOS.Backend.Services;

namespace AgentOS.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AgentController : ControllerBase
{
    private readonly IAIProvider _aiProvider;

    public AgentController(IAIProvider aiProvider)
    {
        _aiProvider = aiProvider;
    }

    public class AgentQuery
    {
        public string Message { get; set; } = string.Empty;
    }

    [HttpPost("query")]
    public async Task<IActionResult> Query([FromBody] AgentQuery query)
    {
        var reply = await _aiProvider.QueryAsync(query.Message);
        return Ok(new { reply });
    }
}
