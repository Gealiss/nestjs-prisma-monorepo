import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { createZodDto, ZodResponse } from 'nestjs-zod';
import z from 'zod/v4';

// NOTE: Request and response schemas are left here near the controller, for simplicity.
// In most cases they should be in separate files.
const healthResponseSchema = z.object({
  status: z.string().describe('Status').meta({ example: 'ok' }),
  timestamp: z.iso.datetime().describe('Timestamp').meta({ example: new Date().toISOString() }),
});

class HealthResponseDto extends createZodDto(healthResponseSchema) {}

@Controller('health')
export class HealthController {
  @Get()
  @HttpCode(HttpStatus.OK)
  @ZodResponse({ status: HttpStatus.OK, type: HealthResponseDto })
  health(): HealthResponseDto {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
