import { useState } from "react";
import { FormEvent } from "react";

class FormValidator<T extends object> {
  submitter: (event: FormEvent) => void;
  /**
   * Function that will run if there are no errors.
   */
  onValidate: ((event: FormEvent) => void) | undefined;
  private errorStateHandler: [T, React.Dispatch<React.SetStateAction<T>>];

  constructor(
    errorStateHandler: FormValidator<T>["errorStateHandler"],
    checker: (event: FormEvent) => T,
  ) {
    this.errorStateHandler = errorStateHandler;
    this.submitter = (event) => {
      const errors = checker(event);
      this.errorStateHandler[1](errors);
      if (Object.values(errors).length === 0) {
        if (this.onValidate) {
          this.onValidate(event);
        } else {
          console.warn("onValidate() is not defined for form validator.");
        }
      }
    };
  }

  get errors() {
    return this.errorStateHandler[0];
  }
}

/**
 * Hook for handling form validation submission.
 * @param checker A function that returns an error object.
 */
export function useFormValidator<T extends object>(
  checker: (event: FormEvent) => T,
): FormValidator<T> {
  const errorStateHandler = useState<T>({} as T);
  const validator = new FormValidator(errorStateHandler, checker);

  return validator;
}
