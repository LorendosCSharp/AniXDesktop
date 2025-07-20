import { useState } from "react";
import { Button, Dropdown, DropdownItem } from "flowbite-react";

interface YearPickerProps {
    label: string;
    selectedYear: number;
    onChange: (year: number) => void;
}
interface YearRangePickerProps {
    label: string;
    selectLabel: string;
    fromYear: number | null;
    toYear: number | null;
    onFromYearChange: (year: number) => void;
    onToYearChange: (year: number) => void;
}

const YearDropdown = ({ label, selectedYear, onChange }: YearPickerProps) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 200 }, (_, i) => 1900 + i); // 1900-2100 years around now

    return (
        <div className="flex flex-col gap-1 flex-grow px-0">
            <label className="ml-4 text-sm font-medium text-gray-900 dark:text-white">
                {label}
            </label>
            <div className=" border rounded-md overflow-y-auto max-h-24">
                {years.map((year) => (
                    <div
                        key={year}
                        onClick={() => onChange(year)}
                        className={` cursor-pointer px-3 py-1 hover:bg-blue-100 ${year === selectedYear ? "bg-blue-200 font-bold" : ""
                            }`}
                    >
                        {year}
                    </div>
                ))}
            </div>
        </div>
    );
};

const YearRangePicker = ({
    label,
    selectLabel,
    fromYear,
    toYear,
    onFromYearChange,
    onToYearChange,
}: YearRangePickerProps) => {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="flex flex-col relative">
            <div className="w-full relative mb-4">
                <label className="absolute -top-2 left-3 bg-[rgb(55_65_81)] px-1 text-sm text-white z-[1]">
                    {label}
                </label>
                <div className="border border-gray-300 rounded p-1">
                    <Button
                        className="flex items-center justify-center w-full focus:ring-0 hover:bg-gray-600 rounded-none"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {fromYear != null || toYear != null ? `${fromYear ?? ""}-${toYear ?? ""}` : selectLabel}
                    </Button>
                </div>
            </div>

            {showForm && (
                <div
                    className="absolute top-full left-0 mt-1 w-full border border-gray-300 rounded shadow-lg z-20 bg-[rgb(55_65_81)]"
                    key="selectForm"
                >
                    <div className="flex flex-row justify-around p-2">
                        <YearDropdown label="От" selectedYear={fromYear} onChange={onFromYearChange} />
                        <div className="w-5"></div>
                        <YearDropdown label="До" selectedYear={toYear} onChange={onToYearChange} />
                    </div>
                    <div className="p-2 border-t border-gray-200">
                        <Button
                            className="focus:outline-none focus:ring-0 hover:bg-gray-600 w-full"
                            onClick={() => setShowForm(false)}
                        >
                            Выбрать
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};


export default YearRangePicker;
