// lib/errors.ts
import { CredentialsSignin } from "next-auth"

export class InvalidLoginError extends CredentialsSignin {
  constructor(code: string) {
    super(code)
    this.code = code
  }
}
