import { Module } from '@nestjs/common';
import { ChallengeController } from './challenge.controller';
import { ChallengeService } from './challenge.service';

@Module({
  controllers: [ChallengeController],
  providers: [ChallengeService]
})
export class ChallengeModule {}
