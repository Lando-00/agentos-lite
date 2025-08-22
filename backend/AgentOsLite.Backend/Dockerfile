# ----- Build stage (SDK) -----
FROM mcr.microsoft.com/dotnet/sdk:8.0-bookworm-slim AS build
WORKDIR /src

# Copy the csproj explicitly (update the filename below if it differs)
COPY AgentOsLite.Backend.csproj ./
RUN dotnet restore "./AgentOsLite.Backend.csproj"

# Copy the rest and publish
COPY . .
RUN dotnet publish "./AgentOsLite.Backend.csproj" -c Debug -o /out --no-restore

# ----- Runtime stage (ASP.NET) -----
FROM mcr.microsoft.com/dotnet/aspnet:8.0-bookworm-slim
WORKDIR /app
COPY --from=build /out .

# .NET 8 container binds to 8080 by default
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080 \
    ASPNETCORE_ENVIRONMENT=Development

ENTRYPOINT ["dotnet", "AgentOsLite.Backend.dll"]
