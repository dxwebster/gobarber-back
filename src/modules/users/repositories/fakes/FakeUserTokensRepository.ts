import { uuid } from 'uuidv4';

import IUsersTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '../../infra/typeorm/entities/UserToken';

class FakeUsersTokenRepository implements IUsersTokensRepository {
  private userTokens: UserToken[] = [];

  // cria o método generate
  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  // cria o método finByToken
  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find((findToken) => findToken.token === token);
    return userToken;
  }
}

export default FakeUsersTokenRepository;
