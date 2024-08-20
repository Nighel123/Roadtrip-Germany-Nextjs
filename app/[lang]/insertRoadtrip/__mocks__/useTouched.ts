const states = {
  errors: [],
  formRef: {},
  handleBlur: jest.fn(),
  handleChange: jest.fn(),
  handleSubmit: jest.fn(),
  loading: false,
};

export const useTouched = jest.fn();
useTouched.mockReturnValue(states);
