import { createNewUser } from "@/services";
import { ErrorObject } from "@/types";
import { FormEvent, FormEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "./useNotification";

interface SignUpObject {
  submitter: FormEventHandler;
  errors: ErrorObject;
  isLoading: boolean;
}

/**
 * Handle user creation.
 * @param event submit event
 */
export function useSignUp(): SignUpObject {
  const [errors, setErrors] = useState<ErrorObject>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const notifyUser = useNotification();

  return {
    isLoading,
    submitter: function (event: FormEvent) {
      event.preventDefault();
      // Prevent double clicks.
      if (isLoading) {
        return;
      }
      const newErrorObject: ErrorObject = {};
      const { username, email, password, confirmPassword } = event
        .target as unknown as {
          [key in keyof Required<ErrorObject>]: HTMLInputElement;
        };
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

      if (Object.values(newErrorObject).length == 0) {
        setIsLoading(true);
        createNewUser({
          username: username.value,
          password: password.value,
          emailAddress: email.value,
          confirmPassword: confirmPassword.value,
        }).then(() => {
          notifyUser("Welcome!", "success", 1000).then(() => navigate("/home"));
        })
          .catch((err) => {
            notifyUser(err.message, "error", 2000);
          })
          .finally(() => setIsLoading(false));
      }
    },
    errors,
  };
}

function showPasswordBriefly(password: HTMLInputElement) {
  password.type = "text";
  setTimeout(() => {
    password.type = "password";
  }, 3000);
}
