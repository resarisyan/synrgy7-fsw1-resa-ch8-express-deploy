// import { inject, injectable } from 'inversify';
// import jwt from 'jsonwebtoken';
// import { UserRepository } from '../repositories/UserRepository.js';
// import TYPES from '../di/types.js';
// import { UserResponse } from '../dtos/response/user-response.js';
// import { Validation } from '../validators/index.js';
// import { UserValidation } from '../validators/user-validation.js';
// import bcrypt from 'bcrypt';
// import { ResponseError } from '../handlers/response-error.js';
// import { CarRepository } from '../repositories/CarRepository.js';
// import { DashboardResponse } from '../dtos/response/dashboard-response.js';

// @injectable()
// export class AuthService {
//   private userRepository: UserRepository;
//   private carRepository: CarRepository;
//   constructor(
//     @inject(TYPES.UserRepository) userRepository: UserRepository,
//     @inject(TYPES.CarRepository) carRepository: CarRepository
//   ) {
//     this.carRepository = carRepository;
//     this.userRepository = userRepository;
//   }

//   public async getDashboard(): Promise<DashboardResponse> {
//     const totalUser = await this.userRepository.count();
//     const totalCar = await this.carRepository.count();
//     return {
//       totalCars: totalCar,
//       totalMember: totalUser
//     };
//   }
// }
