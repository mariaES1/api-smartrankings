import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from 'src/categories/categories.module';
import { PlayersModule } from 'src/players/players.module';
import { ChallengeController } from './challenge.controller';
import { ChallengesService } from './challenge.service';
import { ChallengeSchema } from './interfaces/challenge.schema';
import { GameSchema } from './interfaces/game.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Challenge', schema: ChallengeSchema },
      { name: 'Game', schema: GameSchema },
    ]),
    PlayersModule,
    CategoriesModule,
  ],
  controllers: [ChallengeController],
  providers: [ChallengesService],
})
export class ChallengeModule {}
