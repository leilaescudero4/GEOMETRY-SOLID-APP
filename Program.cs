var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapPost("/calculate", async (HttpContext context) =>
{
    var data = await System.Text.Json.JsonSerializer.DeserializeAsync<CalcRequest>(context.Request.Body);

    if (data == null)
        return Results.BadRequest("Invalid input");

    double result = 0;

    if (data.shape == "ellipsoid")
    {
        result = (4.0 / 3.0) * Math.PI * data.a * data.b * data.h1;
    }
    else if (data.shape == "cone_dome")
    {
        double cone = (1.0 / 3.0) * Math.PI * Math.Pow(data.a, 2) * data.h1;
        double dome = (2.0 / 3.0) * Math.PI * Math.Pow(data.a, 3);
        result = cone + dome;
    }
    else if (data.shape == "terrain")
    {
        double avg = (data.h1 + data.h2) / 2.0;
        result = data.a * data.b * avg;
    }

    return Results.Ok(new { volume = result });
});

app.MapFallbackToFile("index.html");

app.Run();

public class CalcRequest
{
    public string? shape { get; set; }
    public double a { get; set; }
    public double b { get; set; }
    public double h1 { get; set; }
    public double h2 { get; set; }
}