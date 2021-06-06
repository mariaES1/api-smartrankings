import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDto} from './dto/create-player.dto';
import { v4 as uuid4 } from 'uuid';
import { Player } from './interfaces/player.interfaces';

@Injectable()
export class PlayersService {

    private players: Player[];

    private readonly logger = new Logger(PlayersService.name);

    async createUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void>{
        this.create(createPlayerDto);
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
}
