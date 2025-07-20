// components/LabeledDropdown.tsx
import { Dropdown } from "flowbite-react";
import React, { ReactElement } from "react";
import { ReactNode, useState, isValidElement, cloneElement } from "react";

interface LabeledDropdownProps {
    label: string;
    selectLabel: string;
    children?: ReactNode;
    className?: string;
    selectedItem?: string | null;
    onChangeSelectedItem?: (item: string) => void;
}

export const LabeledDropdown = ({
    label,
    selectLabel,
    children,
    className,
    selectedItem,
    onChangeSelectedItem,
}: LabeledDropdownProps) => {

    const handleSelect = (item) => {
        onChangeSelectedItem(item);
        console.log("User selected:", item);

    };

    const enhancedChildren = React.Children.map(children, (child) => {
        if (isValidElement(child)) {
            return cloneElement(child as ReactElement, {
                onClick: () => handleSelect(child.props.children),
            });
        }
        return child;
    });

    return (
        <div className="w-full relative mb-4  hover:bg-gray-600">
            <label className="absolute -top-2 left-3 bg-[rgb(55_65_81)] px-1 text-sm text-white">
                {label}
            </label>
            <div className="border border-gray-300 rounded p-1">
                <Dropdown
                    label={selectedItem != null ? selectedItem : selectLabel}
                    inline={false}
                    className={`w-full focus:outline-none focus:ring-0 ${className}`}
                >
                    {enhancedChildren}
                </Dropdown>
            </div>
        </div >
    );
};
