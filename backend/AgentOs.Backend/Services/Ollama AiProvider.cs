using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Runtime.CompilerServices;

namespace AgentOS.Backend.Services;

public class OllamaOptions
{
    public string BaseUrl { get; set; } = "http://localhost:11434";
    public string Model { get; set; } = "mistral"; // e.g. "deepseek-r1:1.5b"
    public bool UseChat { get; set; } = true;
    public int RequestTimeoutSeconds { get; set; } = 60;
    public bool StripReasoning { get; set; } = true; // strip <think>…</think>
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

    public async Task<string> QueryAsync(string message)
    {
        if (string.IsNullOrWhiteSpace(message))
            return "Please provide a non-empty message.";

        if (_opts.UseChat)
        {
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

            string text = doc.RootElement.TryGetProperty("message", out var msg)
                        && msg.TryGetProperty("content", out var content)
                ? content.GetString() ?? ""
                : doc.RootElement.ToString();

            return _opts.StripReasoning ? StripThinkTags(text) : text;
        }
        else
        {
            var payload = new { model = _opts.Model, prompt = message, stream = false };

            using var res = await _http.PostAsync("/api/generate",
                new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json"));
            res.EnsureSuccessStatusCode();

            using var s = await res.Content.ReadAsStreamAsync();
            using var doc = await JsonDocument.ParseAsync(s);

            string text = doc.RootElement.TryGetProperty("response", out var resp)
                ? resp.GetString() ?? ""
                : doc.RootElement.ToString();

            return _opts.StripReasoning ? StripThinkTags(text) : text;
        }
    }

    // --- STREAMING related methods ---

    // State for simple <think> filtering across tokens
    private bool _inThink = false;

    public async IAsyncEnumerable<string> StreamAsync(string message, [EnumeratorCancellation] CancellationToken ct = default)
    {
        var useChat = _opts.UseChat;
        object payload = useChat
            ? new { model = _opts.Model, messages = new[] { new { role = "user", content = message } }, stream = true }
            : new { model = _opts.Model, prompt = message, stream = true };

        using var req = new HttpRequestMessage(HttpMethod.Post, useChat ? "/api/chat" : "/api/generate")
        {
            Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
        };

        using var res = await _http.SendAsync(req, HttpCompletionOption.ResponseHeadersRead, ct);
        res.EnsureSuccessStatusCode();

        using var stream = await res.Content.ReadAsStreamAsync(ct);
        using var reader = new StreamReader(stream, Encoding.UTF8);

        while (!reader.EndOfStream)
        {
            ct.ThrowIfCancellationRequested();
            var line = await reader.ReadLineAsync();
            if (string.IsNullOrWhiteSpace(line)) continue;

            using var doc = JsonDocument.Parse(line);

            string? token = null;
            if (useChat && doc.RootElement.TryGetProperty("message", out var msg) &&
                          msg.TryGetProperty("content", out var content))
            {
                token = content.GetString();
            }
            else if (doc.RootElement.TryGetProperty("response", out var resp))
            {
                token = resp.GetString();
            }

            if (string.IsNullOrEmpty(token))
                continue;

            foreach (var cleaned in _opts.StripReasoning ? FilterThinkTokens(token) : new[] { token })
            {
                if (!string.IsNullOrEmpty(cleaned))
                    yield return cleaned;
            }
        }
    }

    // Remove <think>...</think> for non-streaming
    private static string StripThinkTags(string text)
    {
        if (string.IsNullOrEmpty(text)) return text;
        return System.Text.RegularExpressions.Regex
            .Replace(text, @"<think>[\s\S]*?</think>", "")
            .Trim();
    }

    // Streaming-friendly filter: if token contains start/end tags, toggle state and only yield outside
    private IEnumerable<string> FilterThinkTokens(string token)
    {
        // Very simple state machine suitable for typical DeepSeek R1 outputs
        int idx = 0;
        while (idx < token.Length)
        {
            if (!_inThink)
            {
                var start = token.IndexOf("<think>", idx, StringComparison.OrdinalIgnoreCase);
                if (start == -1)
                {
                    // no start tag; we are outside think → yield remainder
                    yield return token.Substring(idx);
                    break;
                }
                else
                {
                    // yield outside segment, then enter think
                    if (start > idx)
                        yield return token.Substring(idx, start - idx);

                    _inThink = true;
                    idx = start + "<think>".Length;
                }
            }
            else
            {
                var end = token.IndexOf("</think>", idx, StringComparison.OrdinalIgnoreCase);
                if (end == -1)
                {
                    // still inside think; skip the rest of this token
                    break;
                }
                else
                {
                    // exit think, continue after closing tag
                    _inThink = false;
                    idx = end + "</think>".Length;
                }
            }
        }
    }
}
