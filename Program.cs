using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapPost("/calculate", async (HttpContext context) =>
{
    var data = await JsonSerializer.DeserializeAsync<CalcRequest>(context.Request.Body);

    if (data == null)
        return Results.BadRequest(new { error = "Invalid input" });

    double result = 0;

    switch (data.Shape)
    {
        case "ellipsoid":
            result = (4.0 / 3.0) * Math.PI * data.A * data.B * data.H1;
            break;

        case "cone_dome":
            double cone = (1.0 / 3.0) * Math.PI * data.A * data.A * data.H1;
            double dome = (2.0 / 3.0) * Math.PI * data.A * data.A * data.H2;
            result = cone + dome;
            break;

        case "terrain":
            result = data.A * data.A * data.H1;
            break;
    }

    return Results.Ok(new { volume = result });
});

app.Run();

public class CalcRequest
{
    public string Shape { get; set; }
    public double A { get; set; }
    public double B { get; set; }
    public double H1 { get; set; }
    public double H2 { get; set; }
}
