import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto} from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './interfaces/player.interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {

    constructor(@InjectModel('Player') private readonly playerModule: Model<Player>) {}

    private readonly logger = new Logger(PlayersService.name);

    async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player>{
        const { email } = createPlayerDto;
        const finded =  await this.playerModule.findOne({email}).exec();

        if(finded){
            throw new BadRequestException(`Player with email ${email} already exists.`);
        }

        const player = new this.playerModule(createPlayerDto);
        return player.save();
    }

    async updatePlayer(_id: string, updatePlayerDto: UpdatePlayerDto): Promise<void>{
        const finded =  await this.playerModule.findOne({_id}).exec();

        if(!finded){
           throw new NotFoundException(`Player with id ${_id} was not found.`)
        }

        this.playerModule.findByIdAndUpdate({_id}, {$set: updatePlayerDto}).exec();
    }

    async getPlayerById(_id : string): Promise<Player>{
        const findedPlayer = await this.playerModule.findOne({_id}).exec();
        if(!findedPlayer){
            throw new NotFoundException(`Player with id ${_id} was not found!`);
        }
        return findedPlayer;
    }


    async getAllPlayers(): Promise<Player[]>{
        return this.playerModule.find().exec();
    }

    async deletePlayer(_id: string): Promise<any>{
        const findedPlayer = await this.playerModule.findOne({_id}).exec();
        if(!findedPlayer){
            throw new NotFoundException(`Player with id ${_id} does not exists!`);
        }
        return this.playerModule.deleteOne({_id}).exec();
    }
}
