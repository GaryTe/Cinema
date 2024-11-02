export const ErrorUser = {
  nameIsString: 'Name field is not valid. Field name line.',
  nameLength: 'Name field is not valid. Min length 1, max length 15.',
  email: 'Email field is not valid. Please provide a valid email address.',
  avatarIsString: 'Avatar field is not valid. Field avatar line.',
  avatar: 'Avatar field is not valid. Image in jpg or png format',
  passwordLength: 'Password field is not valid. Min length 6, max length 12.'
} as const;
