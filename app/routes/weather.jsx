import { getWeather } from "../data/weather";
import Widget from "../components/Widget";
import Search from "../components/Search";
import { json, redirect } from "@remix-run/node";
const DEFAULT_CITY = "New delhi";
export const meta = () => {
    return [{ title: "Remix Weather App" }];
};

export const loader = async ({ request }) => {
    const url = new URL(request.url);
    let city = url.searchParams.get("location");
    if (!city) city = DEFAULT_CITY;

    const [weatherInfo] = await Promise.all([getWeather(city)]);
    return {
        weatherInfo: weatherInfo,
    };
};

export const action = async ({ request }) => {
    const formData = await request.formData();
    const city = formData.get("search") || DEFAULT_CITY;
    return redirect(`?location=${city}`);
};

export default function Index() {
    return (
        <>
            <div className="mx-auto p-4 bg-gray-600 h-screen flex-col justify-center">
                <div className="mb-10">
                    <h1 className="text-center text-white text-xl font-bold">
                        Weather today
                    </h1>
                </div>
                <Search />
                <Widget />
            </div>
        </>
    );
}

/*
dayjs format:

MMM = Abbreviated month name
DD  = Day of the month, 2 digits
ddd = The short name of the day of the week
*/
