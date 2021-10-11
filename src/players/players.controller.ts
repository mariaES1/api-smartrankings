import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './interfaces/player.interfaces';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {

    constructor( private readonly playersService: PlayersService ) {};

    @Post()
    async createUpdatePlayers(@Body() createPlayerDto: CreatePlayerDto){
        await this.playersService.createUpdatePlayer(createPlayerDto);
    }

    @Get()
    async getPlayers(@Query('email') email:string): Promise<Player[] | Player>{
        if(email){
            return await this.playersService.getPlayerByEmail(email);
        }
        else{
            return await this.playersService.getAllPlayers();
        }
    }

    @Delete()
    async deletePlayer(@Query('email') email:string): Promise<void>{
        await this.playersService.deletePlayer(email);
    }
}
