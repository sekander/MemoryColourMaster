using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading;
using System.Threading.Tasks;

public class PatternUpdateService : BackgroundService
{
    private readonly ILogger<PatternUpdateService> _logger;
    private readonly IServiceProvider _serviceProvider;
    private string _currentPattern = "";
    private readonly PatternStorage _patternStorage;
    // private readonly int _updateInterval = 5000; // Update every 5 seconds
    private readonly int _updateInterval = 100; // Update every 5 seconds

    public PatternUpdateService(ILogger<PatternUpdateService> logger, 
                                IServiceProvider serviceProvider,
                                PatternStorage patternStorage)
    {
        // _random = new Random();
        _logger = logger;
        _serviceProvider = serviceProvider;
        _patternStorage = patternStorage;
    }

    public string GetCurrentPattern() => _currentPattern;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Pattern update service started.");
        // bool level_complete = false;

        while (!stoppingToken.IsCancellationRequested)
        {
            // UpdatePattern();
            string cpuPattern = _patternStorage.GetPattern();
            string playerPattern = _patternStorage.GetPlayerPattern();
            Console.WriteLine($"Background Service");
            Console.WriteLine($"Cpu Patter: " + _patternStorage.GetPattern());
            Console.WriteLine($"Player Patter: " + _patternStorage.GetPlayerPattern());
            

            
            // Check if the patterns are not empty
            if (string.IsNullOrEmpty(cpuPattern) || string.IsNullOrEmpty(playerPattern))
            {
                // If either pattern is empty, update the match status to false
                _patternStorage.UpdateMatch(false);
            }
            else
            {
                if (playerPattern.Length < cpuPattern.Length)
                {
                    Console.WriteLine("Player Pattern lenght is not fully submitted ");

                }else if (playerPattern.Length == cpuPattern.Length)
                {
                    Console.WriteLine("Player Pattern lenght fully submitted ");
                    // Check if both patterns are of the same length and match completely
                    if (cpuPattern.Length == playerPattern.Length && cpuPattern.Equals(playerPattern))
                    {
                        // Update match status to true if both patterns match completely
                        _patternStorage.UpdateMatch(true);
                        Console.WriteLine("PLAYER MATCHED PATTERN!!");
                        //_patternStorage.UpdatePlayerPattern("");

                    }
                    else
                    {
                        // Update match status to false if they don't match
                        _patternStorage.UpdateMatch(false);
                        _patternStorage.UpdateResetLevel(true);
                        Console.WriteLine("PLAYER DID NOT MATCH PATTERN!!");
                    }
                }
            }

            await Task.Delay(_updateInterval, stoppingToken);
        }

        _logger.LogInformation("Pattern update service stopped.");
    }
}