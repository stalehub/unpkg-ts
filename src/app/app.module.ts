import { Module } from '@nestjs/common'
import { Commands } from '@/commands'
import { RunCommand } from '@/commands/run.command'

@Module({
  providers: [...Commands],
  imports: [RunCommand]
})
export class AppModule {}
