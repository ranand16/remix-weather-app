import { Link, useActionData } from "@remix-run/react";
import Layout from "../components/Layout";
import { Textfield } from "../components/TextField";
import React, { useState } from "react";
import { authenticator } from "../utils/auth.server";

export const meta = () => {
    return [{ title: "Weather Today - Login" }];
};

export const loader = async ({ request }) => {
    const user = await authenticator.isAuthenticated(request, {
        successRedirect: "/",
    });
    return user;
};

export const action = async ({ request }) => {
    return authenticator.authenticate("form", request, {
        successRedirect: "/",
        failureRedirect: "/login",
    });
};

const Login = () => {
    const actionData = useActionData();
    const [formData, setFormData] = useState({
        email: actionData?.fields?.email || "",
        password: actionData?.fields?.password || "",
    });
    const handleInputChange = (e, field) => {
        setFormData((form) => ({ ...form, [field]: e.target.value }));
    };
    return (
        <Layout>
            <div className="h-full justify-center bg-green-100 items-center flex flex-col gap-y-5">
                <form method="POST" className="rounded-2xl bg-white p-6 w-96">
                    <h2 className="text-3xl font-extrabold text-black-600 mb-5">
                        Login
                    </h2>
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
                            Login
                        </button>
                    </div>
                </form>
                <p className="text-gray-600">
                    Dont have an account?
                    <Link to="/signup">
                        <span className="text-red-600 px-2 underline">
                            Signup
                        </span>
                    </Link>
                </p>
            </div>
        </Layout>
    );
};

export default Login;
