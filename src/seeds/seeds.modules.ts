import { Module } from '@nestjs/common';
import { ReverseSeedersModule } from './commands/reverse-seeders/reverse-seeders.module';
import { AppStartModule } from './commands/start/app-start.module';

@Module({
  imports: [AppStartModule, ReverseSeedersModule],
})
export class SeedsModules {}
