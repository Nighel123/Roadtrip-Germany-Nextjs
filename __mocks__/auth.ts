const NAMock = {
  auth: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  handlers: {
    GET: jest.fn(),
    POST: jest.fn(),
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NAMock;
