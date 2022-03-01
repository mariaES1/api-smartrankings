import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/players/players.service';
import { AssignChallengeGameDto } from './dto/assing-challenge.dto';
import { CreateChallengeDto } from './dto/createChallenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
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

  async getAllChallenges(): Promise<Array<Challenge>> {
    return await this.challengeModel
      .find()
      .populate('requester')
      .populate('players')
      .populate('game')
      .exec();
  }

  async getPlayerChallenges(_id: any): Promise<Array<Challenge>> {
    const players = await this.playersService.getAllPlayers();
    const filter = players.filter((player) => player._id == _id);

    if (filter.length == 0) {
      throw new BadRequestException(`The id ${_id} is not a player`);
    }

    return await this.challengeModel
      .find()
      .where('players')
      .in(_id)
      .populate('requester')
      .populate('players')
      .populate('game')
      .exec();
  }

  async updateChallenge(
    _id: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<void> {
    const foundChallenge = await this.challengeModel.findById(_id).exec();

    if (!foundChallenge) {
      throw new NotFoundException(`Challenge ${_id} not registered`);
    }

    if (updateChallengeDto.status) {
      foundChallenge.dateTimeRequest = new Date();
    }
    foundChallenge.status = updateChallengeDto.status;
    foundChallenge.dateTimeChallenge = updateChallengeDto.dateTimeChallenge;

    await this.challengeModel
      .findByIdAndUpdate({ _id }, { $set: foundChallenge })
      .exec();
  }

  async assignChallenge(
    _id: string,
    assignChallenge: AssignChallengeGameDto,
  ): Promise<void> {
    const foundChallenge = await this.challengeModel.findById(_id).exec();

    if (!foundChallenge) {
      throw new BadRequestException(`Challenge ${_id} not registered`);
    }

    const filter = foundChallenge.players.filter(
      (player) => player._id == assignChallenge.def,
    );

    if (filter.length == 0) {
      throw new BadRequestException(
        `The winner players does not exist in this challenge`,
      );
    }

    const createdGame = new this.gameModel(assignChallenge);

    createdGame.category = foundChallenge.category;
    createdGame.players = foundChallenge.players;

    const result = await createdGame.save();

    foundChallenge.status = ChallengeStatus.ACCOMPLISHED;
    foundChallenge.game = result._id;

    try {
      await this.challengeModel
        .findByIdAndUpdate({ _id }, { $set: foundChallenge })
        .exec();
    } catch (error) {
      await this.gameModel.deleteOne({ _id: result._id }).exec();
      throw new InternalServerErrorException();
    }
  }

  async deleteChallenge(_id: string): Promise<void> {
    const foundChallenge = await this.challengeModel.findById(_id).exec();

    if (!foundChallenge) {
      throw new BadRequestException(`Challenge ${_id} not registered`);
    }

    foundChallenge.status = ChallengeStatus.CANCELED;

    await this.challengeModel
      .findByIdAndUpdate({ _id }, { $set: foundChallenge })
      .exec();
  }
}
