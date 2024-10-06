import { Form, Link, useLoaderData } from "@remix-run/react";

const Layout = ({ children }) => {
    let user = null;
    const data = useLoaderData();
    if (data) user = data?.user;

    const fullname = user?.name;

    return (
        <div className="h-screen w-full bg-green-100">
            <div className="flex w-full justify-between">
                {user && <div className="float-left">{fullname}</div>}
                {!user && (
                    <div className="float-right">
                        <Link to="/login">
                            <span className="text-red-600 px-2 underline">
                                Signin
                            </span>
                        </Link>
                    </div>
                )}
                {user && (
                    <div className="float-right">
                        <Form method="post">
                            <button
                                type="submit"
                                name="action"
                                value="logout"
                                id="logout"
                                className="text-red-500 py-1 border px-3 text-sm rounded-md font-semibold"
                            >
                                Logout
                            </button>
                        </Form>
                    </div>
                )}
            </div>
            {children}
        </div>
    );
};

export default Layout;
