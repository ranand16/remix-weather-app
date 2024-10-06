import { getWeather } from "../data/weather";
import Widget from "../components/Widget";
import Search from "../components/Search";
import { json, redirect } from "@remix-run/node";
import { authenticator } from "../utils/auth.server";
import { Form, useLoaderData } from "@remix-run/react";
import Layout from "../components/Layout";
import { createFavCity, getMyPrefs } from "../utils/preferences.server";
const DEFAULT_CITY = "New delhi";
export const meta = () => {
    return [{ title: "Remix Weather App" }];
};
export const loader = async ({ request }) => {
    const user = await authenticator.isAuthenticated(request, {});
    const url = new URL(request.url);
    let city = url.searchParams.get("location");
    if (!city) city = DEFAULT_CITY;

    let userPrefs = {};
    const [weatherInfo] = await Promise.all([getWeather(city)]);
    return {
        weatherInfo: weatherInfo,
        user,
        userPrefs,
    };
};

export const action = async ({ request }) => {
    const formData = await request.formData();
    const action = formData.get("action");
    console.log("🚀 ~ action ~ action:", formData, " ::: ", action);

    switch (action) {
        case "logout": {
            console.log("Logging you out!");
            return await authenticator.logout(request, {
                redirectTo: "/login",
            });
        }

        case "add_nd": {
            console.log("Adding delhi aas fav city!");
            const user = await authenticator.isAuthenticated(request);
            if (!user) return redirect("/login");
            const cfavcity = await createFavCity({
                city: "London",
                byUser: {
                    connect: {
                        id: user.id,
                    },
                },
            });
            return cfavcity;
            // return redirect("/");
        }

        // action == search
        default: {
            const city = formData.get("search") || DEFAULT_CITY;
            return redirect(`/?location=${city}`);
        }
    }
};

export default function Index() {
    return (
        <Layout>
            <div className="bg-gray-600 flex relative">
                <div className="flex items-start absolute max-w-xs xl:max-w-md">
                    <Form method="post">
                        <button
                            type="submit"
                            name="action"
                            value="add_nd"
                            id="add_nd"
                            data-city="add_nd"
                            className="text-red-500 py-1 border px-3 text-sm rounded-md font-semibold"
                        >
                            Add new delhi to favorite
                        </button>
                        {/* <button
                            type="submit"
                            name="action"
                            value="logout"
                            id="add_ld"
                            className="text-red-500 py-1 border px-3 text-sm rounded-md font-semibold"
                        >
                            Add london to favorite
                        </button>
                        <button
                            type="submit"
                            name="action"
                            value="logout"
                            id="add_hk"
                            className="text-red-500 py-1 border px-3 text-sm rounded-md font-semibold"
                        >
                            Add hong kong to favorite
                        </button>
                        <button
                            type="submit"
                            name="action"
                            value="logout"
                            id="add_pt"
                            className="text-red-500 py-1 border px-3 text-sm rounded-md font-semibold"
                        >
                            Add patna to favorite
                        </button> */}
                    </Form>
                </div>
                <div className="mx-auto p-4 h-screen flex-col justify-center items-center max-w-max">
                    <div className="mb-10">
                        <h1 className="text-center text-white text-xl font-bold">
                            Weather today
                        </h1>
                    </div>
                    <Search />
                    <Widget />
                </div>
            </div>
        </Layout>
    );
}

/*
dayjs format:

MMM = Abbreviated month name
DD  = Day of the month, 2 digits
ddd = The short name of the day of the week
*/
