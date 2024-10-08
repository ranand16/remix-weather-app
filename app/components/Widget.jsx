import Forecast from "./Forecast";
// import { useActionData, useLoaderData } from "@remix-run/react";
import { Form, useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";

export default function Widget() {
    const data = useLoaderData();
    const { weatherInfo = { current: {}, location: {}, forecaset: {} } } = data;
    const { current, location, forecast } = weatherInfo;

    return (
        <>
            {!weatherInfo ? (
                <div className="text-center text-orange-500 text-2xl">
                    <h1>{"could not load weather data now!"}</h1>
                </div>
            ) : (
                <div className="flex flex-wrap justify-center">
                    <div className="px-2 max-w-2xl">
                        <div className="bg-gray-900 text-white relative min-w-0 break-words rounded-lg overflow-hidden mb-4 w-full dark:bg-gray-600">
                            <div className="px-6 py-6 relative">
                                <div className="flex mb-4 justify-between items-center">
                                    <div>
                                        <div className="flex flex-row items-center">
                                            <h5 className="mb-0 font-medium text-xl">
                                                {`${
                                                    location.name ||
                                                    "Undefined Location"
                                                }, ${location.region}`}{" "}
                                            </h5>
                                            &nbsp;&nbsp;&nbsp;
                                            <Form method="post">
                                                <input
                                                    className="hidden absolute"
                                                    type="text"
                                                    name="currentcity"
                                                    action="currentcity"
                                                    id="currentcity"
                                                    value={location.name}
                                                    placeholder=""
                                                    readOnly
                                                />
                                                <button
                                                    type="submit"
                                                    name="action"
                                                    className="h-full"
                                                    value="add_fav_city"
                                                    title="Add to favorite city"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="18px"
                                                        height="18px"
                                                        viewBox="0 0 18 18"
                                                    >
                                                        <path
                                                            fill="#aaa"
                                                            d="M18 9a1.5 1.5 0 0 1-1.5 1.5h-6v6a1.5 1.5 0 0 1-3 0v-6h-6a1.5 1.5 0 0 1 0-3h6v-6a1.5 1.5 0 0 1 3 0v6h6A1.5 1.5 0 0 1 18 9z"
                                                        />
                                                    </svg>
                                                </button>
                                            </Form>
                                        </div>
                                        <h6 className="mb-0">
                                            {dayjs(location.localtime).format(
                                                // "dddd MM"
                                                "MMM DD"
                                            )}
                                        </h6>
                                        <small>{current.temp_c}</small>
                                    </div>
                                    <div className="text-right mt-2 mr-4">
                                        <div className="text-center">
                                            <h3 className="font-bold text-4xl mb-0">
                                                <span>
                                                    {Math.round(current.temp_c)}
                                                    &deg;
                                                </span>
                                                <img
                                                    src={current.condition.icon}
                                                    className="inline-block pl-3"
                                                />
                                            </h3>
                                            <p className="text-left">
                                                <small>
                                                    {current.condition.text}
                                                </small>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="block sm:flex justify-between items-center flex-wrap pt-5">
                                    <div className="w-full sm:w-1/2">
                                        <div className="flex mb-2 justify-between items-center">
                                            <span>Temp</span>
                                            <small className="px-2 inline-block">
                                                {Math.round(current.temp_c)}
                                                &nbsp;&deg;
                                            </small>
                                        </div>
                                    </div>
                                    <div className="w-full sm:w-1/2">
                                        <div className="flex mb-2 justify-between items-center">
                                            <span>Feels like</span>
                                            <small className="px-2 inline-block">
                                                {Math.round(
                                                    current.feelslike_c
                                                )}
                                                &nbsp;&deg;
                                            </small>
                                        </div>
                                    </div>
                                    <div className="w-full sm:w-1/2">
                                        <div className="flex mb-2 justify-between items-center">
                                            <span>Humidity</span>
                                            <small className="px-2 inline-block">
                                                {Math.round(
                                                    weatherInfo.current.humidity
                                                )}{" "}
                                                %
                                            </small>
                                        </div>
                                    </div>
                                    <div className="w-full sm:w-1/2">
                                        <div className="flex mb-2 justify-between items-center">
                                            <span>Dew Point</span>
                                            <small className="px-2 inline-block">
                                                {Math.round(
                                                    weatherInfo.current
                                                        .dewpoint_c
                                                )}
                                                &nbsp;&deg;
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="divider table mx-2 text-center bg-transparent whitespace-nowrap">
                                <span className="inline-block px-3">
                                    <h6>7 Day Forecast</h6>
                                </span>
                            </div>

                            <Forecast data={forecast["forecastday"]} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
