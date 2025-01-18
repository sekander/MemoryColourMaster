using Microsoft.AspNetCore.Mvc;

namespace ReactAspNetApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MemoryColourMasterController(PatternStorage patternStorage) : ControllerBase
    {
        readonly Random random = new Random();
        
        private readonly PatternStorage _patternStorage = patternStorage;
        
        int pattern_index = 0;

        private void PatternGenerator(){
            Console.WriteLine("Generating New Pattern");
            int randomNumber = random.Next(1, 5);

            // Retrieve the existing pattern from session, or initialize an empty string if it doesn't exist
            var generated_pattern = HttpContext.Session.GetString("Pattern") ?? "";

            // Append the new random number to the existing pattern
            generated_pattern += randomNumber.ToString();

            // Save the updated pattern back into session
            HttpContext.Session.SetString("Pattern", generated_pattern);

            // Optional: Log the current pattern to the console
            Console.WriteLine($"Current Pattern: {generated_pattern}");
        }

        //Get
        //[HttpGet]
        [HttpGet("getpattern")]
        //public IActionResult GetPattern ([FromQuery] string pattern)
        public IActionResult GetPattern ()
        {
            PatternGenerator();
            // Return the updated pattern from session

            string currentPattern = HttpContext.Session.GetString("Pattern") ?? ""; // Retrieve the latest pattern from session
            _patternStorage.UpdatePattern(currentPattern);
            return Ok(new { message = $"{currentPattern}"});
        }
        
        [HttpGet("getmatch")]
        //public IActionResult GetPattern ([FromQuery] string pattern)
        public IActionResult GetMatch ()
        {
            // Return the updated pattern from session
            if(_patternStorage.GetMatch())
            {
                _patternStorage.UpdatePlayerPattern("");
                _patternStorage.UpdateMatch(false);
                return Ok(new { message = "True"});
            }
            else if(_patternStorage.GetResetLevel())
            {
                _patternStorage.UpdateResetLevel(false);
                return Ok(new { message = "GAME OVER"});
            }
            else{
                return Ok(new { message = "False"});
            }
        }

        //Post
        [HttpPost("send")]
        //public IActionResult SendPattern ([FromBody] string pattern)
        public IActionResult SendPattern_s ([FromBody] MessageInputDTo pattern)
        {
            // Retrieve the current pattern from the session, or initialize an empty string if it doesn't exist
            string currentPattern = HttpContext.Session.GetString("Player_Pattern") ?? "";
            
            // Log the incoming pattern
            Console.WriteLine($"Sent Pattern: {pattern.Text}");
            
            // Append the new pattern to the existing one
            currentPattern += pattern.Text;

            // Save the updated pattern back into the session
            HttpContext.Session.SetString("Player_Pattern", currentPattern);
            
            // Update the pattern storage with the new pattern
            _patternStorage.UpdatePlayerPattern(currentPattern);

            // Return a response indicating the pattern has been received
            return Ok(new { message = $"Received Pattern: {pattern.Text}"}); 
        }
        
        [HttpPost("sendpattern")]
        //public IActionResult SendPattern ([FromBody] string pattern)
        public IActionResult SendPattern ([FromBody] MessageInputDTo pattern)
        {
            Console.WriteLine($"Sent Pattern: {pattern.IntegerValue}");
            return Ok(new { message = $"Received Pattern: {pattern.IntegerValue}"}); 
        }
        
        // API GET method to clear the pattern stored in session
        [HttpGet("clearpattern")]
        public IActionResult ClearPattern()
        {
            // Clear the session
            HttpContext.Session.Clear();
            _patternStorage.UpdatePattern("");
            _patternStorage.UpdatePlayerPattern("");

            // Return a confirmation message
            return Ok(new { message = "Pattern cleared from session." });
        }
        
        // API GET method to clear the pattern stored in session
        [HttpGet("clearplayerpattern")]
        public IActionResult ClearPlayerPattern()
        {
            // Clear the session
            //HttpContext.Session.Clear();
            HttpContext.Session.SetString("Player_Pattern", "");
            _patternStorage.UpdatePlayerPattern("");

            // Return a confirmation message
            return Ok(new { message = "Player Pattern cleared from session." });
        }
    } 
    


    //Class to represent input message received from react
    public class MessageInputDTo
    {
        public string Text {get; set;}
        public int IntegerValue { get; set; }
        public float FloatValue { get; set; }
    }
}