import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/players/players.service';
import { CreateChallengeDto } from './dto/createChallenge.dto';
import { ChallengeStatus } from './interfaces/challege.status.enum';
import { Challenge, Game } from './interfaces/challenge.interface';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Game') private readonly gameModel: Model<Game>,
    private readonly categoriesService: CategoriesService,
    private readonly playersService: PlayersService,
  ) {}

  private readonly logger = new Logger(ChallengesService.name);

  async createChallenge(
    createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    const players = await this.playersService.getAllPlayers();

    createChallengeDto.players.map((playerDto) => {
      const filter = players.filter((player) => player._id == playerDto._id);

      if (filter.length == 0) {
        throw new BadRequestException(
          `The id ${playerDto._id} is not a player`,
        );
      }
    });

    const isPlayer = await createChallengeDto.players.filter(
      (player) => player._id == createChallengeDto.requester,
    );

    this.logger.log(`isPlayer: ${isPlayer}`);

    if (isPlayer.length == 0) {
      throw new BadRequestException('The requester must be a match player');
    }

    const playerCategory = await this.categoriesService.getPlayerCategory(
      createChallengeDto.requester,
    );

    if (!playerCategory) {
      throw new BadRequestException(
        'The requester must be registered in a category',
      );
    }

    const createdChallenge = new this.challengeModel(createChallengeDto);
    createdChallenge.category = playerCategory.category;
    createdChallenge.dateTimeRequest = new Date();
    createdChallenge.status = ChallengeStatus.PENDING;
    return await createdChallenge.save();
  }
}
