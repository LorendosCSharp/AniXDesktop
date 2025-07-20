// components/LabeledDropdown.tsx
import { Button, Checkbox, Dropdown } from "flowbite-react";
import React from "react";
import { ReactNode, useState, isValidElement, cloneElement } from "react";

interface LabeledCheckmarkProps {
    label: string;
    onStateLabel?: string | "вкл.";
    offStateLabel?: string | "выкл.";
    className?: string;
    state: boolean | false;
    onChangeState?: (item: boolean) => void;
}

export const LabeledCheckmark = ({
    label,
    onStateLabel,
    offStateLabel,
    className,
    state,
    onChangeState,
}: LabeledCheckmarkProps) => {

    function ChangeState() {
        onChangeState(!state);
        console.log(state)
    }


    return (
        <div className={className ? className : " h-full w-full focus:outline-none focus:ring-0 relative"}>
            <label className="absolute -top-2 left-3 bg-[rgb(55_65_81)] px-1 text-sm text-white z-[1]">
                {label}
            </label>
            <div className="flex border border-gray-300 rounded p-1 justify-end mt-2">
                <Button className="flex flex-row focus:ring-0 text-white bg-gray-800 p-0 h-full" onClick={() => ChangeState()}>
                    <div className={` flex ${!state ? "outline outline-1 bg-gray-600 outline-gray-400" : "transparent"}  h-full items-center w-12 justify-center rounded flex-grow`}>
                        {onStateLabel}
                    </div>
                    <div className={`flex ${state ? "outline outline-1 bg-gray-600 outline-gray-400" : "transparent"} h-full items-center w-12 justify-center rounded flex-grow`}>
                        {offStateLabel}
                    </div>
                </Button>
            </div>
        </div >
    );
};
