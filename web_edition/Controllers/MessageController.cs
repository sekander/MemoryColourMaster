using Microsoft.AspNetCore.Mvc;

namespace ReactAspNetApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        [HttpGet("great")]
        public IActionResult GetGreeting()
        {
            return Ok(new {message = "Hello from ASP.NET "});
        }
        //Post method that receives input from React frontend
        [HttpPost("send")]
        public IActionResult ReceiveMessage([FromBody] MessageInput input)
        {
            if (string.IsNullOrEmpty(input.Text))
            {
                return BadRequest(new {message = "Message cannot be empty!"});
            }
            return Ok(new { message = $"Received: {input.Text}"});
        } 
    }

    //Class to represent input message received from react
    public class MessageInput
    {
        public string Text {get; set;}
    }
    
}