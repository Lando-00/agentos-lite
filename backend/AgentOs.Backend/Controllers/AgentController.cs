using System.Text;
using Microsoft.AspNetCore.Mvc;
using AgentOS.Backend.Services;

namespace AgentOS.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AgentController : ControllerBase
{
    private readonly IAIProviderResolver _resolver;
    public AgentController(IAIProviderResolver resolver) => _resolver = resolver;

    public class AgentQuery
    {
        public string Message { get; set; } = string.Empty;
        public string? Provider { get; set; } // "Ollama" | "Mock" | future: "OpenAI", "Claude"
    }

    [HttpPost("query")]
    public async Task<IActionResult> Query([FromBody] AgentQuery query)
    {
        var provider = _resolver.Resolve(query.Provider);
        var reply = await provider.QueryAsync(query.Message);
        return Ok(new { reply });
    }

    [HttpPost("stream")]
    public async Task Stream([FromBody] AgentQuery query)
    {
        var provider = _resolver.Resolve(query.Provider);

        Response.StatusCode = 200;
        Response.Headers.Append("Content-Type", "text/plain; charset=utf-8");
        Response.Headers.Append("Cache-Control", "no-cache");

        await foreach (var chunk in provider.StreamAsync(query.Message, HttpContext.RequestAborted))
        {
            var bytes = Encoding.UTF8.GetBytes(chunk);
            await Response.Body.WriteAsync(bytes, 0, bytes.Length, HttpContext.RequestAborted);
            await Response.Body.FlushAsync(HttpContext.RequestAborted);
        }
    }
}