import { Document } from 'mongoose';
import { Player } from '../../players/interfaces/player.interfaces';

export interface Categories extends Document {
  readonly category: string;
  description: string;
  events: Array<Event>;
  players: Array<Player>;
}

export interface Event {
  name: string;
  operation: string;
  value: number;
}
