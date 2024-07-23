export const NUMERIC_REGEXP = (start: number, end: number) => new RegExp(`^[0-9]{${start},${end}}$`, 'g');

export const ALPHABETIC_SPACE_REGEX = /^[A-Za-z\s]+$/;

export const ALPHABETIC_REGEXP = (start: number, end: number) => new RegExp(`^[a-zA-Z]{${start},${end}}$`, 'g');

export const EMAIL_REGEXP =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
