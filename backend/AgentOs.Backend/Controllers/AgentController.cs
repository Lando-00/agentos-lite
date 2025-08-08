using Microsoft.AspNetCore.Mvc;
using AgentOS.Backend.Services;
using System.Text;

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

    // New: streaming endpoint
    [HttpPost("stream")]
    public async Task Stream([FromBody] AgentQuery query)
    {
        Response.StatusCode = 200;
        Response.Headers.Append("Content-Type", "text/plain; charset=utf-8");
        Response.Headers.Append("Cache-Control", "no-cache");

        await foreach (var chunk in _aiProvider.StreamAsync(query.Message, HttpContext.RequestAborted))
        {
            var bytes = Encoding.UTF8.GetBytes(chunk);
            await Response.Body.WriteAsync(bytes, 0, bytes.Length, HttpContext.RequestAborted);
            await Response.Body.FlushAsync(HttpContext.RequestAborted);
        }
    }
}
