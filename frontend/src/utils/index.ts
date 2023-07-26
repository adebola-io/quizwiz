import { FormEvent, FormEventHandler } from "react";

export class FormValidator<T extends object> {
  __submitter?: FormEventHandler;
  errors: T = {} as T;
  next: ((event: FormEvent) => void) | undefined;

  set submitter(__submitter: FormEventHandler) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    self.__submitter = (event) => {
      __submitter(event);
      if (Object.values(self.errors).length === 0) {
        self.next?.(event);
      }
    };
  }
  get submitter(): FormEventHandler | undefined {
    return this.__submitter;
  }
  onValidate(next: (event: FormEvent) => void) {
    console.log(this);
    this.next = next;
  }
}
