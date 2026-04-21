using System.Net.Http.Json;
using System.Text.Json;
using backend.Models;

namespace backend.Services;

public class ExchangeRateProvider
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<ExchangeRateProvider> _logger;
    private readonly string _url;

    public ExchangeRateProvider(HttpClient httpClient, ILogger<ExchangeRateProvider> logger, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _logger = logger;
        _url = configuration["CnbSettings:DailyRatesUrl"]
            ?? throw new ArgumentNullException("CnbSettings:DailyRatesUrl", "URL is missing in configuration.");
    }

    public async Task<List<Rates>> GetRatesAsync()
    {
       var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        try
        {
            var response = await _httpClient.GetFromJsonAsync<Response>(_url, options);
            return response?.Rates.Select(r => new Rates
            {
                Amount = r.Amount,
                Country = r.Country,
                Currency = r.Currency,
                CurrencyCode = r.CurrencyCode,
                Order = r.Order,
                Rate = r.Rate,
                ValidFrom = r.ValidFrom
            }).ToList() ?? new List<Rates>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching exchange rates from CNB API.");
            return new List<Rates>();
        }
    }
}