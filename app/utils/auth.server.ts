import {Authenticator, AuthorizationError} from "remix-auth"
import {sessionStorage} from "./session.server"
import {FormStrategy} from "remix-auth-form"
import { prisma } from './prisma.server'
import bcrypt from "bcryptjs"

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    throw new Error("SESSION_SECRET must be set");
}

const authenticator = new Authenticator(sessionStorage)

const formStrategy = new FormStrategy(async ({form}) => {
    const email = form.get("email")
    const password = form.get("password")

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new AuthorizationError()
    }

    const passwordsMatch = await bcrypt.compare(
        password as string,
        user.password,
    )

    if (!passwordsMatch) {
        throw new AuthorizationError()
    }

    return user
})

authenticator.use(formStrategy, "form")

export {authenticator}