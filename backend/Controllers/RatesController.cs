using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;

namespace backend.Controllers;

[ApiController]

[Route("api/[controller]")] 
public class RatesController : ControllerBase
{
    private readonly ExchangeRateProvider _provider;
    private readonly ILogger<RatesController> _logger;

    public RatesController(ExchangeRateProvider provider, ILogger<RatesController> logger)
    {
        _provider = provider;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<Rates>), 200)]
    [ProducesResponseType(500)]

    public async Task<IActionResult> Get()
    {
        _logger.LogInformation("Request received for current exchange rates.");

        try
        {
            var rates = await _provider.GetRatesAsync();
            if (rates == null || !rates.Any())
            {
                _logger.LogWarning("No exchange rates found.");
                return NotFound("No exchange rates available.");
            }

            _logger.LogInformation("Successfully retrieved exchange rates.");
            return Ok(rates);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching exchange rates.");
            return StatusCode(500, "An error occurred while fetching exchange rates.");
        }
    }
}