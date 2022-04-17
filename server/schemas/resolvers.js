const { Book, User } = require("../models");

const resolvers = {
  Query: {
    me: async () => {
      return User.find({});
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { user, body }) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { savedBooks: body } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    },
    deleteBook: async (parent, { _id }) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: _id },
        { $pull: { savedBooks: { bookId: params.bookId } } },
        { new: true }
      );
      return updatedUser;
    },
  },
};
