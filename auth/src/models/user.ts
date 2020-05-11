import mongoose, { MongooseDocumentOptionals } from 'mongoose';

// An interface that describes the properties that are required to create a new user.

interface UserAttrs {
  email: string;
  password: string;
}
//An interfface that describes the properties that a user model has.
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// an interface that describes props that a user document has.
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//Below function is to make mongo work with typescript
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

//generics: angle bracket types provided to functions as arguments
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

//example working creation of new user
// const user = User.build({
//   email: 'test@test.com',
//   password: 'laksjfh',
// });

export { User };
