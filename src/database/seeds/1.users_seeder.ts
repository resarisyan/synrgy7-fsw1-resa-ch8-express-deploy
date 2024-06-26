import { Knex } from 'knex';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const tableName = 'users';
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(tableName).del();

  // Inserts seed entries
  await knex(tableName).insert([
    {
      name: 'Admin',
      username: 'admin',
      email: 'resarisyan@gmail.com',
      password: await bcrypt.hash('admin', 10),
      role: 'ADMIN'
    }
  ]);

  await knex(tableName).insert([
    {
      name: 'Super Admin',
      username: 'superadmin',
      email: 'superadmin@gmail.com',
      password: await bcrypt.hash('superadmin', 10),
      role: 'SUPERADMIN'
    }
  ]);

  await knex(tableName).insert([
    {
      name: 'Member',
      username: 'member',
      email: 'resarisyan77@gmail.com',
      password: await bcrypt.hash('password', 10),
      role: 'MEMBER'
    }
  ]);

  const users = Array(10)
    .fill(null)
    .map(() => ({
      name: faker.person.firstName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: bcrypt.hashSync('password', 10),
      role: 'MEMBER'
    }));
  await knex(tableName).insert(users);
}
