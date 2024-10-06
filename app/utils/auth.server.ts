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
    console.log("🚀 ~ formStrategy ~ email:", email)
    const password = form.get("password")
    console.log("🚀 ~ formStrategy ~ password:", password)

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log("you entered a wrong email")
        throw new AuthorizationError()
    }
    console.log("🚀 ~ 1 formStrategy ~ password:", password)

    const passwordsMatch = await bcrypt.compare(
        password as string,
        user.password,
    )
    console.log("🚀 ~ 2 formStrategy ~ password:", password)

    if (!passwordsMatch) {
        throw new AuthorizationError()
    }
    console.log("🚀 ~ 3 formStrategy ~ password:", password)

    return user
})

authenticator.use(formStrategy, "form")

export {authenticator}