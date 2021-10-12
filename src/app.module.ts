import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';
import { MongooseModule } from '@nestjs/mongoose'
@Module({
  imports: [
    PlayersModule,
    MongooseModule.forRoot('mongodb+srv://Admin:IzVldG6ViRkz37GZ@cluster0.p3cne.mongodb.net/smartRankings?retryWrites=true&w=majority')
  ]
})
export class AppModule {}
