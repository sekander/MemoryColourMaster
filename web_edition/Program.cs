using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// 
// 1. Register the BackgroundCounterService as a singleton service, which means one instance
//    will be shared across the application lifetime.
builder.Services.AddSingleton<BackgroundCounterService>();
builder.Services.AddSingleton<PatternUpdateService>();
builder.Services.AddSingleton<PatternStorage>(); // Shared singleton storage

// 2. Register the BackgroundCounterService as a hosted service that runs in the background.
//    This allows ASP.NET Core to run it as a background task.
builder.Services.AddHostedService(provider => provider.GetRequiredService<BackgroundCounterService>());
builder.Services.AddHostedService(provider => provider.GetRequiredService<PatternUpdateService>());

builder.Services.AddControllersWithViews();
builder.Services.AddControllers();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession();  // Add session services



var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");


//Map API endpoints
app.MapControllers();

// Serve the React app for any other request
app.MapFallbackToFile("index.html"); // This should match your React app's entry point

app.UseSession(); // Use session middleware

app.Run();
