import { Body, Controller, Post } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {

    constructor( private readonly playersService: PlayersService ) {};

    @Post()
    async createUpdatePlayers( @Body() createPlayerDto: CreatePlayerDto){
        await this.playersService.createUpdatePlayer(createPlayerDto);
    }
}
