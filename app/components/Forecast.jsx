import dayjs from "dayjs";

export default function Forecast({ data }) {
    const days = data.map((day, index) => {
        return (
            <div
                key={day.date}
                className="text-center mb-0 flex items-center justify-center flex-col"
            >
                <span className="block my-1">
                    {dayjs(day.date).format("MMM DD")}
                </span>

                <img
                    src={`${day.day.condition.icon}`}
                    className="block w-8 h-8"
                />
                <span className="block my-1">
                    {Math.round(day.day.avgtemp_c)}&deg;
                </span>
            </div>
        );
    });

    return (
        <div className="px-6 py-6 relative">
            <div
                className="text-center justify-between items-center flex space-x-10"
                style={{ flexFlow: "initial" }}
            >
                {days}
            </div>
        </div>
    );
}
