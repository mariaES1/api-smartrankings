import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { ChallengeModule } from './challenge/challenge.module';
@Module({
  imports: [
    PlayersModule,
    MongooseModule.forRoot(
      'mongodb+srv://Maria:DlkcN4qR7VhlH8Sw@cluster0.uvx5v.mongodb.net/smartRanking?retryWrites=true&w=majority',
    ),
    CategoriesModule,
    ChallengeModule,
  ],
})
export class AppModule {}
