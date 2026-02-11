import { Controller, Get } from '@nestjs/common';

//annotation tells nest js that this class is a controller
@Controller('health') //similar to /health - all routes start here
export class HealthController {
  @Get() //this handler is for GET requests to /health
  ping() {
    return 'the nest js application is healthy and running';
  }
}
