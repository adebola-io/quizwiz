import { FormObject } from "@/types";
import { FormValidator } from "@/utils";
import { useState } from "react";

interface LoginErrorObject {
  usernameOrEmail?: string;
  password?: string;
}

/**
 * Hook for handling logging in of users.
 */
export function useLogin(): FormValidator<LoginErrorObject> {
  const [errors, setErrors] = useState<LoginErrorObject>({});
  const validator = new FormValidator();

  validator.errors = errors;
  validator.submitter = function (event) {
    event.preventDefault();
    const { usernameOrEmail, password } = event
      .target as unknown as FormObject;
    const newErrorObject: LoginErrorObject = {};

    if (usernameOrEmail.value.length === 0) {
      newErrorObject.usernameOrEmail = "Please provide a username.";
    }
    if (password.value.length === 0) {
      newErrorObject.password = "Please provide a password.";
    }
    setErrors(newErrorObject);
  };

  return validator;
}
