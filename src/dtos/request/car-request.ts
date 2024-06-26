import { PageRequest } from './page-request';

export interface CreateCarRequest extends Request {
  plate: string;
  manufacture: string;
  model: string;
  image: string;
  rentPerDay: number;
  capacity: number;
  description: string;
  transmission: string;
  year: number;
  created_by: string;
  availableAt: Date;
  driverType: boolean;
}

export interface UpdateCarRequest extends Request {
  id: string;
  plate?: string;
  manufacture?: string;
  model?: string;
  image?: string;
  rentPerDay?: number;
  capacity?: number;
  description?: string;
  transmission?: string;
  year?: number;
  updated_by: string;
  availableAt?: Date;
  driverType?: boolean;
  npm?: boolean;
}

export interface SearchCarRequest extends Request {
  driverType: boolean;
  capacity?: number;
  pickUpTime: string;
  pickUpDate: string;
  pagination: PageRequest;
}
