import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Printer } from 'prettier';
import { ChallengesService } from './challenge.service';
import { AssignChallengeGameDto } from './dto/assing-challenge.dto';
import { CreateChallengeDto } from './dto/createChallenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatusValidationPipe } from './pipes/challenge-validation.pipe';

@Controller('api/v1/challenges')
export class ChallengeController {
  constructor(private readonly challengesService: ChallengesService) {}

  private readonly logger = new Logger(ChallengeController.name);

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body() createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    this.logger.log(
      `createChallengeDto: ${JSON.stringify(createChallengeDto)}`,
    );
    return await this.challengesService.createChallenge(createChallengeDto);
  }

  @Get()
  async getChallenges(
    @Query('playerId') _id: string,
  ): Promise<Array<Challenge>> {
    return _id
      ? await this.challengesService.getPlayerChallenges(_id)
      : await this.challengesService.getAllChallenges();
  }

  @Put('/:challenge')
  async updateChallenge(
    @Body(ChallengeStatusValidationPipe) updateChallengeDto: UpdateChallengeDto,
    @Param('challenge') _id: string,
  ): Promise<void> {
    await this.challengesService.updateChallenge(_id, updateChallengeDto);
  }

  @Post('/:challenge/game')
  async assingChallengeGame(
    @Body(ValidationPipe) assingChallengeGameDto: AssignChallengeGameDto,
    @Param('challenge') _id: string,
  ): Promise<void> {
    return await this.challengesService.assignChallenge(
      _id,
      assingChallengeGameDto,
    );
  }

  @Delete('/:_id')
  async deleteChallenge(@Param('_id') _id: string): Promise<void> {
    await this.challengesService.deleteChallenge(_id);
  }
}
