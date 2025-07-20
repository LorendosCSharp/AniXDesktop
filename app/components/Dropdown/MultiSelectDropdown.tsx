// components/MultiSelectDropdown.tsx
import React, { ReactNode, isValidElement, cloneElement } from "react";
import { Button, Dropdown } from "flowbite-react";

interface MultiSelectDropdownProps {
    label: string;
    selectLabel: string;
    children?: ReactNode;
    className?: string;
    selectedItems: string[]; // multiple selected items
    onChangeSelectedItems: (items: string[]) => void;
}

export const MultiSelectDropdown = ({
    label,
    selectLabel,
    children,
    className,
    selectedItems,
    onChangeSelectedItems,
}: MultiSelectDropdownProps) => {

    // Toggle item in selectedItems
    const handleSelect = (item: string) => {
        let newSelected: string[];
        if (selectedItems.includes(item)) {
            // remove item
            newSelected = selectedItems.filter((i) => i !== item);
        } else {
            // add item
            newSelected = [...selectedItems, item];
        }
        onChangeSelectedItems(newSelected);
    };

    // Add onClick handlers to children items
    const enhancedChildren = React.Children.map(children, (child) => {
        if (isValidElement(child)) {
            const itemLabel = child.props.children;
            const isSelected = selectedItems.includes(itemLabel);

            return cloneElement(child, {
                onClick: () => handleSelect(itemLabel),
                className: `${isSelected ? "bg-blue-200 font-bold" : ""
                    } cursor-pointer px-3 py-1 hover:bg-blue-100`,
            });
        }
        return child;
    });

    // Display selected items or the placeholder label
    let displayLabel = selectLabel;
    if (selectedItems.length > 0 && selectedItems.length < 4) {
        displayLabel = selectedItems.join(", ");
    }
    else if (selectedItems.length > 3) {
        displayLabel = selectedItems.slice(0, 3).join(", ") + ", +1 ";
    }

    return (
        <div className=" flex w-full relative mb-4 ">
            <label className="absolute -top-2 left-3 bg-[rgb(55_65_81)] px-1 text-sm text-white">
                {label}
            </label>
            <div className="border border-gray-300 rounded p-1 flex-grow hover:bg-gray-600">
                <Dropdown
                    label={displayLabel}
                    inline={false}
                    className={`w-full focus:outline-none focus:ring-0 ${className}`}
                >
                    {enhancedChildren}
                </Dropdown>
            </div>
            {selectedItems?.length > 0 && <div>
                <Button color="red" className="h-full focus:ring-0" onClick={() => (onChangeSelectedItems([]))}>
                    Х
                </Button>
            </div>}
        </div>
    );
};
