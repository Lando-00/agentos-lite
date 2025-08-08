using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace AgentOS.Backend.Services;

public class OllamaOptions
{
    public string BaseUrl { get; set; } = "http://localhost:11434";
    public string Model { get; set; } = "mistral";
    public bool UseChat { get; set; } = true;
    public int RequestTimeoutSeconds { get; set; } = 30;
}

public class OllamaAIProvider : IAIProvider
{
    private readonly HttpClient _http;
    private readonly OllamaOptions _opts;

    public OllamaAIProvider(HttpClient httpClient, OllamaOptions opts)
    {
        _http = httpClient;
        _opts = opts;
        _http.Timeout = TimeSpan.FromSeconds(_opts.RequestTimeoutSeconds);
        _http.BaseAddress = new Uri(_opts.BaseUrl);
    }

    private static string StripThinkTags(string text)
    {
        if (string.IsNullOrEmpty(text))
            return text;

        // Remove <think>...</think> including newlines
        var pattern = @"<think>[\s\S]*?</think>";
        return System.Text.RegularExpressions.Regex.Replace(text, pattern, "").Trim();
    }

    public async Task<string> QueryAsync(string message)
    {
        if (string.IsNullOrWhiteSpace(message))
            return "Please provide a non-empty message.";

        if (_opts.UseChat)
        {
            // POST /api/chat  (non-streaming)
            var payload = new
            {
                model = _opts.Model,
                messages = new[] { new { role = "user", content = message } },
                stream = false
            };

            using var res = await _http.PostAsync("/api/chat",
                new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json"));

            res.EnsureSuccessStatusCode();

            using var s = await res.Content.ReadAsStreamAsync();
            using var doc = await JsonDocument.ParseAsync(s);

            // Response shape: { "message": { "role":"assistant", "content":"..." }, ... }
            if (doc.RootElement.TryGetProperty("message", out var msg) &&
                msg.TryGetProperty("content", out var content))
            {
                return StripThinkTags(content.GetString() ?? "");
            }

            // Some Ollama builds return choices; fall back to raw text if needed
            return StripThinkTags(doc.RootElement.ToString());
        }
        else
        {
            // POST /api/generate  (completion style, non-streaming)
            var payload = new
            {
                model = _opts.Model,
                prompt = message,
                stream = false
            };

            using var res = await _http.PostAsync("/api/generate",
                new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json"));

            res.EnsureSuccessStatusCode();

            using var s = await res.Content.ReadAsStreamAsync();
            using var doc = await JsonDocument.ParseAsync(s);

            // Response shape: { "response": "..." , ... }
            if (doc.RootElement.TryGetProperty("response", out var resp))
            {
                 return StripThinkTags(resp.GetString() ?? "");
            }

            return StripThinkTags(doc.RootElement.ToString());
        }
    }
}