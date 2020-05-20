import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';
declare global {
  namespace NodeJS {
    interface Global {
      signup(id?: string): string[];
    }
  }
}
jest.mock('../nats-wrapper');
let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signup = (id?: string) => {
  //build jwt payload
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };
  //Create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  //Build session object {jws: my_JWR}
  const session = {
    jwt: token,
  };
  //Turn into JSON
  const sessionJSON = JSON.stringify(session);
  //enocode as base
  const base64 = Buffer.from(sessionJSON).toString('base64');
  //return cookie
  return [`express:sess=${base64}`];
};
