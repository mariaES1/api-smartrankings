import {
  ArgumentMetadata,
  BadGatewayException,
  PipeTransform,
} from '@nestjs/common';
import { ChallengeStatus } from '../interfaces/challege.status.enum';

export class ChallengeStatusValidationPipe implements PipeTransform {
  readonly acceptedStatuses = [
    ChallengeStatus.ACCEPT,
    ChallengeStatus.DENIED,
    ChallengeStatus.CANCELED,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.isValidStatus(status)) {
      throw new BadGatewayException(`${status} is an invalid status`);
    }
  }

  private isValidStatus(status: any) {
    const idx = this.acceptedStatuses.indexOf(status);

    return idx !== -1;
  }
}
