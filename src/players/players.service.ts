import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto} from './dto/create-player.dto';
import { v4 as uuid4 } from 'uuid';
import { Player } from './interfaces/player.interfaces';

@Injectable()
export class PlayersService {

    private players: Player[] = [];

    private readonly logger = new Logger(PlayersService.name);

    async createUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void>{
        const { email } = createPlayerDto;
        const finded =  this.players.find(player => player.email === email);

        if(finded){
           this.update(finded, createPlayerDto);
        }else{
            this.create(createPlayerDto);
        }
    }

    async getPlayerByEmail(email : string): Promise<Player>{
        const findedPlayer = this.players.find(player => player.email === email);
        if(!findedPlayer){
            throw new NotFoundException(`Player with email ${email} was not found!`);
        }
        return findedPlayer;
    }


    async getAllPlayers(): Promise<Player[]>{
        return await this.players;
    }

    private create(createPlayerDto: CreatePlayerDto): void{
        const { name, phoneNumber, email} = createPlayerDto;

        const player: Player = {
            id: uuid4(),
            name,
            phoneNumber,
            email,
            ranking: 'A',
            rankingPosition: 1,
            urlPhoto: 'www'
        }
        this.logger.log(`createPlayerDto: ${JSON.stringify(player)}`);
        this.players.push(player);
    }

    private update(finded: Player, createPlayerDto: CreatePlayerDto): void{
        const { name } = createPlayerDto;
        finded.name = name;
    }

    async deletePlayer(email): Promise<void>{
        const playerToDelete = this.players.find(player => player.email === email);
        this.players = this.players.filter(player => player.email !== playerToDelete.email);
    }
}
