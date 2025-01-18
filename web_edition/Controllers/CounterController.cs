using Microsoft.AspNetCore.Mvc;

namespace ReactAspNetApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CounterController : ControllerBase
    {
        // Inject the BackgroundCounterService to access the current count
        private readonly BackgroundCounterService _counterService;

        public CounterController(BackgroundCounterService counterService)
        {
            _counterService = counterService;
        }

        //Get
        [HttpGet("count")]
        public IActionResult GetCount()
        {
            int count = _counterService.GetCount();

            return Ok(new {count});
        }
    }
}
