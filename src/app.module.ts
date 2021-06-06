import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';
@Module({
  imports: [PlayersModule]
})
export class AppModule {}
