import { Global, Module } from '@nestjs/common';
import { PrismaClient, prisma } from '@repo/database';
import { PrismaLifecycleService } from './prisma-lifecycle.service';

@Global()
@Module({
  providers: [
    {
      provide: PrismaClient,
      useValue: prisma,
    },
    PrismaLifecycleService,
  ],
  exports: [PrismaClient],
})
export class DatabaseModule {}
