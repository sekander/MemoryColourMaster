public class PatternStorage
{
    private readonly object _lock = new();
    private string _pattern = string.Empty;
    
    private string _player_pattern = string.Empty;
    
    private bool _match = false;
    
    private bool _resetLevel = false;
    
    public bool GetResetLevel()
    {
        lock (_lock)
        {
            return _resetLevel;
        }
    }

    public void UpdateResetLevel(bool level)
    {
        lock (_lock)
        {
            _resetLevel = level;
        }
    }
    
    public bool GetMatch()
    {
        lock (_lock)
        {
            return _match;
        }
    }

    public void UpdateMatch(bool match)
    {
        lock (_lock)
        {
            _match = match;
        }
    }

    public string GetPattern()
    {
        lock (_lock)
        {
            return _pattern;
        }
    }

    public void UpdatePattern(string newPattern)
    {
        lock (_lock)
        {
            _pattern = newPattern;
        }
    }
    
    public string GetPlayerPattern()
    {
        lock (_lock)
        {
            return _player_pattern;
        }
    }

    public void UpdatePlayerPattern(string newPattern)
    {
        lock (_lock)
        {
            _player_pattern = newPattern;
        }
    }
}
