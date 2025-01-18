using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;

public class BackgroundCounterService : IHostedService, IDisposable
{
    private Timer _timer;
    private int _count;

    // This method is called when the background service starts
    public Task StartAsync(CancellationToken cancellationToken)
    {
        _timer = new Timer(IncrementCount, 
                           null, 
                           TimeSpan.Zero, 
                           TimeSpan.FromSeconds(1));
        // throw new NotImplementedException();
        return Task.CompletedTask;
    }
    
    private void IncrementCount(object state)
    {
        _count++;
        // Console.WriteLine($"Current Count: {_count}");
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        // throw new NotImplementedException();
        _timer?.Change(Timeout.Infinite, 0);
        return Task.CompletedTask;
    }
    public void Dispose()
    {
        // throw new NotImplementedException();
        _timer?.Dispose();
    }

    public int GetCount()
    {
        return _count;
    }

}