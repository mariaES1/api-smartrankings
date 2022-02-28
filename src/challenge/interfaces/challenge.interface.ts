import { Document } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interfaces';
import { ChallengeStatus } from './challege.status.enum';

export interface Challenge extends Document {
  dateTimeChallenge: Date;
  status: ChallengeStatus;
  dateTimeRequest: Date;
  dateTimeResponse: Date;
  requester: Player;
  category: string;
  players: Array<Player>;
  game: Game;
}

export interface Game extends Document {
  category: string;
  players: Array<Player>;
  def: Player;
  result: Array<Result>;
}

export interface Result {
  set: string;
}
