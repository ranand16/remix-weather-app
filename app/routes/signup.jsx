import React, { useState } from "react";
import { useActionData, Link } from "@remix-run/react";
import Layout from "../components/Layout";
import { Textfield } from "../components/TextField";
import { json } from "@remix-run/node";
import { createUser } from "../utils/user.server";
import { authenticator } from "../utils/auth.server";

export const meta = () => {
    return [{ title: "Weather Today - Signup" }];
};

export const loader = async ({ request }) => {
    const user = await authenticator.isAuthenticated(request, {
        successRedirect: "/",
    });
    return { user };
};

export const action = async ({ request }) => {
    const form = await request.formData();
    const action = form.get("_action");
    const email = form.get("email");
    const password = form.get("password");
    const name = form.get("name");

    if (
        typeof action !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        typeof name !== "string"
    ) {
        return json(
            {
                error: "Invalid Form Data",
                form: action,
            },
            { status: 400 }
        );
    }
    console.log("🚀 ~ action ~ form:", form);

    const r = await createUser({ email, password, name });
    console.log("🚀 ~ action ~ r:", r);

    return await authenticator.authenticate("form", request, {
        successRedirect: "/",
        failureRedirect: "/signup",
        context: {
            formData: form,
        },
    });
};

const Signup = () => {
    const actionData = useActionData();
    const [formData, setFormData] = useState({
        email: actionData?.fields?.email || "",
        password: actionData?.fields?.password || "",
        name: actionData?.fields?.password || "",
    });

    // Updates the form data when an input changes
    const handleInputChange = (event, field) => {
        setFormData((form) => ({ ...form, [field]: event.target.value }));
    };

    return (
        <Layout>
            <div className="h-full justify-center items-center flex flex-col gap-y-5">
                <form method="POST" className="rounded-2xl bg-white p-6 w-96">
                    <h2 className="text-3xl font-extrabold text-black-600 mb-5">
                        Create an account
                    </h2>
                    <Textfield
                        htmlFor="name"
                        type="name"
                        label="Name"
                        value={formData.name}
                        onChange={(e) => handleInputChange(e, "name")}
                    />
                    <Textfield
                        htmlFor="email"
                        label="Email"
                        value={formData.email}
                        onChange={(e) => handleInputChange(e, "email")}
                    />
                    <Textfield
                        htmlFor="password"
                        type="password"
                        label="Password"
                        value={formData.password}
                        onChange={(e) => handleInputChange(e, "password")}
                    />
                    <div className="w-full text-center mt-5">
                        <button
                            type="submit"
                            name="_action"
                            value="Sign In"
                            className="w-full rounded-xl mt-2 bg-red-500 px-3 py-2 text-white font-semibold transition duration-300 ease-in-out hover:bg-red-600"
                        >
                            Create an account
                        </button>
                    </div>
                </form>
                <p className="text-gray-600">
                    Already have an account?
                    <Link to="/login">
                        <span className="text-red-600 px-2 underline">
                            Sign In
                        </span>
                    </Link>
                </p>
            </div>
        </Layout>
    );
};

export default Signup;
