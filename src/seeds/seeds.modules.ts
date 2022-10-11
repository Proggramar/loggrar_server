import { Module } from '@nestjs/common';
import { AppStartModule } from './commands/start/app-start.module';

@Module({
  imports: [AppStartModule],
})
export class SeedsModules {}
