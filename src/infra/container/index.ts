import 'reflect-metadata';
import { container } from 'tsyringe';

import { AddUserUseCase } from '@/data/usecases/add-user-usecase';
import { AuthenticationUseCase } from '@/data/usecases/authentication-usecase';
import { FetchUsersUseCase } from '@/data/usecases/fetch-users-usecase';
import { LoadUserByTokenUseCase } from '@/data/usecases/load-user-by-token-usecase';
import { UsersRepository } from '@/infra/db/repositories/users-repository';
import { UsersTokenRepository } from '@/infra/db/repositories/users-token-repository';
import { BcryptAdapter } from '@/infra/providers/cryptography/bcrypt-adapter/bcrypt-adapter';
import { JwtAdapter } from '@/infra/providers/cryptography/jwt-adapter/jwt-adapter';
import { EmailValidator } from '@/utils/email-validator';

// usecase
container.register('AddUserUseCase', AddUserUseCase);
container.register('AuthenticationUseCase', AuthenticationUseCase);
container.register('LoadUserByTokenUseCase', LoadUserByTokenUseCase);
container.register('FetchUsersUseCase', FetchUsersUseCase);

// repositories
container.register('UsersRepository', UsersRepository);
container.register('UsersTokenRepository', UsersTokenRepository);

// Providers
container.register('BcryptAdapter', BcryptAdapter);
container.register('JwtAdapter', JwtAdapter);
container.register('EmailValidator', EmailValidator);
