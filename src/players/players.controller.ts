import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './interfaces/player.interfaces';
import { PlayersService } from './players.service';
import { ValidatorParams } from '../common/pipes/validator-params.pipe';

@Controller('api/v1/players')
export class PlayersController {

    constructor( private readonly playersService: PlayersService ) {};

    @Post()
    @UsePipes(ValidationPipe)
    async createPlayers(@Body() createPlayerDto: CreatePlayerDto): Promise<Player>{
        return this.playersService.createPlayer(createPlayerDto);
    }

    @Put('/:_id')
    @UsePipes(ValidationPipe)
    async updatePlayers(@Body()  updatePlayerDto: UpdatePlayerDto, @Param('_id', ValidatorParams) _id:string): Promise<void>{
        this.playersService.updatePlayer(_id, updatePlayerDto);
    }

    @Get()
    async getPlayers(): Promise<Player[]>{
        return this.playersService.getAllPlayers();
    }

    @Get('/:_id')
    async getPlayerById(@Param('_id', ValidatorParams) _id:string): Promise<Player>{
        return this.playersService.getPlayerById(_id);
    }

    @Delete('/:_id')
    async deletePlayer(@Param('_id', ValidatorParams) _id:string): Promise<void>{
        await this.playersService.deletePlayer(_id);
    }
}
