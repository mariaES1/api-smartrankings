import { Body, Controller, Post } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './interfaces/player.interfaces'

@Controller('api/v1/players')
export class PlayersController {
    @Post()
    async createUpdatePlayers( @Body() createPlayerDto: CreatePlayerDto){
        const { email } = createPlayerDto
            return JSON.stringify(`{
                "email" : ${email};
            }`)
    }
}
