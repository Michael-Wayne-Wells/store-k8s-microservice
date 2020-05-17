import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY undifined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  try {
    await natsWrapper.connect('purchasing', 'asdg', 'http://nats-srv:4222');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('connected to mongo');
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log('listening on 3000!!!!');
  });
};

start();
