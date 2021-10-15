import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';
import { MongooseModule } from '@nestjs/mongoose'
import { CategoriesModule } from './categories/categories.module';
import { ChallengeModule } from './challenge/challenge.module';
@Module({
  imports: [
    PlayersModule,
    MongooseModule.forRoot('mongodb+srv://Admin:IzVldG6ViRkz37GZ@cluster0.p3cne.mongodb.net/smartRankings?retryWrites=true&w=majority'),
    CategoriesModule,
    ChallengeModule
  ]
})
export class AppModule {}
