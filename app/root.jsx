import styles from "./tailwind.css";
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useRouteError,
    isRouteErrorResponse,
} from "@remix-run/react";

export const links = () => [{ rel: "stylesheet", href: styles }];

export default function App() {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        return (
            <div className="mx-auto p-4 bg-gray-600 h-screen flex-col justify-center">
                <div className="mb-10">
                    <h1>An error occured!</h1>
                    <p>{error.statusText}</p>
                </div>
            </div>
        );
    }
}
