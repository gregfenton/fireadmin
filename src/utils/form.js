/**
 * Returns error message if value does not exist, otherwise returns
 * undefined
 * @param {String} value - Email to validate
 * @returns {String | undefined} Error message for missing required param
 * @example Required Field
 * <Field
 *   name="password"
 *   component={TextField}
 *   label="Password"
 *   type="password"
 *   validate={required}
 * />
 */
export function required(value) {
  return value ? undefined : 'Required'
}

/**
 * Returns error message if value is not a valid email, otherwise returns
 * undefined
 * @param {String} value - Email to validate
 * @returns {String | undefined} Error message for invalid email
 * @example Basic
 * <Field
 *   name="email"
 *   component={TextField}
 *   label="Email"
 *   validate={validateEmail}
 * />
 */
export function validateEmail(value) {
  return value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined
}

/**
 * Confirm that string is a valid Firebase Database URL
 * @param {String} value - String to validate as a databse url
 * @returns {String | undefined} Error message for invalid databaseUrl
 */
export function validateDatabaseUrl(value) {
  if (value && (!value.match('http') || !value.match('firebaseio.com'))) {
    return 'Invalid databaseURL. Copy from Firebase Auth UI.'
  }
  return undefined
}
