import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto} from './dto/create-player.dto';
import { v4 as uuid4 } from 'uuid';
import { Player } from './interfaces/player.interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {

    constructor(@InjectModel('Player') private readonly playerModule: Model<Player>) {}

    private readonly logger = new Logger(PlayersService.name);

    async createUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void>{
        const { email } = createPlayerDto;
        const finded =  await this.playerModule.findOne({email}).exec();

        if(finded){
           this.update(createPlayerDto);
        }else{
            this.create(createPlayerDto);
        }
    }

    async getPlayerByEmail(email : string): Promise<Player>{
        const findedPlayer = await this.playerModule.findOne({email}).exec();
        if(!findedPlayer){
            throw new NotFoundException(`Player with email ${email} was not found!`);
        }
        return findedPlayer;
    }


    async getAllPlayers(): Promise<Player[]>{
        return await this.playerModule.find().exec();
    }

    private async create(createPlayerDto: CreatePlayerDto): Promise<Player>{
        const player = new this.playerModule(createPlayerDto);
        return await player.save();
    }

    private async update(createPlayerDto: CreatePlayerDto): Promise<Player>{
        return await this.playerModule.findByIdAndUpdate({email: createPlayerDto.email}, {$set: createPlayerDto}).exec();
    }

    async deletePlayer(email: string): Promise<any>{
        return await this.playerModule.remove({email}).exec();
    }
}
