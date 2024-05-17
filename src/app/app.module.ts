import { Module } from '@nestjs/common'
import { RunCommand } from '@/commands/run.command'

@Module({
  providers: [RunCommand]
})
export class AppModule {}
