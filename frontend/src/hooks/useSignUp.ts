import { FormObject } from "@/types";
import { FormValidator } from "@/utils";
import { FormEvent, useState } from "react";

interface SignUpErrorObject {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}
/**
 * Handle user creation.
 * @param event submit event
 */
export function useSignUp(): FormValidator<SignUpErrorObject> {
  const [errors, setErrors] = useState<SignUpErrorObject>({});
  const validator = new FormValidator();

  validator.errors = errors;
  validator.submitter = function (event: FormEvent) {
    event.preventDefault();
    const newErrorObject: SignUpErrorObject = {};
    const { username, email, password, confirmPassword } = event
      .target as unknown as FormObject;
    password.type = "password";

    // Usernames
    if (username.value.length === 0) {
      newErrorObject.username = "Username required.";
    } else if (/[0-9]/.test(username.value[0])) {
      newErrorObject.username = "Usernames cannot start with numbers.";
    } else if (!/^[a-z_][a-z0-9]+$/.test(username.value)) {
      newErrorObject.username =
        "Usernames must be lowercase alphanumeric characters or underscores.";
    }
    // Emails
    if (email.value.length === 0) {
      newErrorObject.email = "Email required.";
    } else if (!email.checkValidity()) {
      newErrorObject.email = "Enter a valid email.";
    }

    /// Passwords
    if (password.value.length === 0) {
      newErrorObject.password = "Password required.";
    } else if (
      !(
        /[0-9]/.test(password.value) &&
        /[a-z]/.test(password.value) &&
        /[A-Z]/.test(password.value)
      )
    ) {
      newErrorObject.password =
        "Passwords should contain digits and letters (upper and lower case).";
      showPasswordBriefly(password);
    } else if (password.value.length < 7) {
      newErrorObject.password = "Try a longer password.";
      showPasswordBriefly(password);
    } else if (password.value !== confirmPassword.value) {
      newErrorObject.confirmPassword = "Passwords do not match!";
      showPasswordBriefly(password);
      showPasswordBriefly(confirmPassword);
    }
    setErrors(newErrorObject);
  };

  return validator;
}

function showPasswordBriefly(password: HTMLInputElement) {
  password.type = "text";
  setTimeout(() => {
    password.type = "password";
  }, 3000);
}
