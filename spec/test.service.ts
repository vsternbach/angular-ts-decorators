import { Injectable } from '../angular-ts-decorators';


@Injectable()
export class TestService {

  constructor() {

  }

  public static createSelf(): TestService {
    return new TestService;
  }

  public someMethod(): void {

  }
}