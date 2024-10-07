import { getWeather } from "../data/weather";
import Widget from "../components/Widget";
import Search from "../components/Search";
import { json, redirect } from "@remix-run/node";
import { authenticator } from "../utils/auth.server";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
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

    let prefData;
    if (user) {
        prefData = await getMyPrefs(user.id);
    }

    const [weatherInfo] = await Promise.all([getWeather(city)]);
    return {
        weatherInfo: weatherInfo,
        user,
        prefData,
    };
};

export const action = async ({ request }) => {
    const formData = await request.formData();
    const action = formData.get("action");
    console.log("🚀🚀🚀🚀🚀🚀action🚀🚀🚀🚀🚀🚀:", action);

    switch (action) {
        case "logout": {
            console.log("Logging you out!");
            return await authenticator.logout(request, {
                redirectTo: "/login",
            });
        }

        case "add_fav_city": {
            const cit = formData.get("currentcity");
            const user = await authenticator.isAuthenticated(request);
            if (!user) return redirect("/login");
            const favcity = await createFavCity({
                city: cit,
                byUser: {
                    connect: {
                        id: user.id,
                    },
                },
            });
            return redirect(`/?location=${cit}`);
        }
        case "go_to_fav_city": {
            const city = "New Delhi";
            const user = await authenticator.isAuthenticated(request);
            if (!user) return redirect("/login");

            return redirect(`/?location=${city}`);
        }

        // action == search
        default: {
            const city = formData.get("search") || DEFAULT_CITY;
            return redirect(`/?location=${city}`);
        }
    }
};

export default function Index() {
    const ld = useLoaderData();
    const { prefData = {} } = ld;
    const { prefs = [] } = prefData;
    console.log("🚀 ~ Index ~ prefs:", prefs);
    const submit = useSubmit();
    const goToFavCity = (e) => {
        console.log("🚀 ~ goToFavCity ~ e:", e);
        const favCity = e.target.id.split("-")[2];
        console.log("🚀 ~ goToFavCity ~ favCity:", favCity);
        submit(e.target, {
            action: `location=${favCity}`,
        });
    };

    return (
        <Layout>
            <div className="bg-gray-600 flex relative">
                {/* <div className="flex items-start absolute max-w-xs xl:max-w-md">
                    Dropdown here
                </div> */}
                <div className="mx-auto p-4 h-screen flex-col justify-center items-center max-w-max">
                    <div className="mb-10">
                        <h1 className="text-center text-white text-xl font-bold">
                            Weather today
                        </h1>
                    </div>
                    <Search />
                    <Widget />
                    <div className="w-full h-24"></div>
                    <h2 className="text-white mb-4">Your favorite cities</h2>
                    <Form>
                        {prefs.map((pref, i) => {
                            return (
                                <button
                                    key={pref.id || i}
                                    name="action"
                                    className="text-white border px-2 py-1"
                                    id={`fav-city-${pref.city}`}
                                    onClick={goToFavCity}
                                >
                                    {pref.city}
                                </button>
                            );
                        })}
                    </Form>
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
