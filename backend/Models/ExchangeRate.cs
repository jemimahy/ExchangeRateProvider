namespace backend.Models;

public class Response
{
    public List<Rates> Rates {get; set;} = new();
}

public class Rates
{
    public decimal Amount { get; set;}
    public string Country { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty;
    public string CurrencyCode { get; set; } = string.Empty;
    public int Order { get; set; }
    public decimal Rate { get; set; }
    public DateOnly ValidFrom { get; set; } 
}