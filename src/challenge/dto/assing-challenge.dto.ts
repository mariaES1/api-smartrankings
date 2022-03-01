import { IsNotEmpty } from 'class-validator';
import { Player } from 'src/players/interfaces/player.interfaces';
import { Result } from '../interfaces/challenge.interface';

export class AssignChallengeGameDto {
  @IsNotEmpty()
  def: Player;

  @IsNotEmpty()
  result: Array<Result>;
}
