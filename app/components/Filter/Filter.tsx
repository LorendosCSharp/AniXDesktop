import {
    Button,
    Dropdown,
    DropdownItem,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "flowbite-react";
import { LabeledDropdown } from "../Dropdown/LabeledDropdown";
import data from "./data.json";
import { IFilters } from "./IFilter";
import YearRangePicker from "./YearRangePicker";
import { useState } from "react";
import { MultiSelectDropdown } from "../Dropdown/MultiSelectDropdown";
import { filtersStorageKey } from "#/api/config";
import { LabeledCheckmark } from "../Checkmark/LabeledCheckmark";

interface FilterProps {
    isShown: boolean;
    setShown: (shown: boolean) => void;
}

const Filter = ({ isShown, setShown }: FilterProps) => {
    const getInitialFilters = (): IFilters => {
        try {
            const saved = sessionStorage.getItem(filtersStorageKey);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch {
            // ignore parse errors
        }
        return {
            country: null,
            category: null,
            genres: [],
            bookmarks: [],
            studio: null,
            source: null,
            season: null,
            episode: null,
            status: null,
            episodeDuration: null,
            ageRating: [],
            sort: null,
            fromYear: null,
            toYear: null,
            excludeGenres: false,
        };
    };

    const [filters, setFilters] = useState<IFilters>(getInitialFilters);

    function onClose() {
        setShown(false);

    }


    function getItemsByName(name: string) {
        const found = data.resources.array.find((obj) => obj._name === name);
        return found ? found.item : [];
    }

    function clearFilters() {
        setFilters({
            country: null,
            category: null,
            genres: [],
            bookmarks: [],
            studio: null,
            source: null,
            season: null,
            episode: null,
            status: null,
            episodeDuration: null,
            ageRating: [],
            sort: null,
            fromYear: null,
            toYear: null,
            excludeGenres: false
        });
        sessionStorage.removeItem("filters");
    }
    function applyFilters() {
        sessionStorage.setItem(filtersStorageKey, JSON.stringify(filters));
        setShown(false);
        window.location.reload();
    }

    return (
        <Modal show={isShown} onClose={onClose}>
            <ModalHeader>
                <div>Фильтры</div>
            </ModalHeader>
            <ModalBody>
                <div className="my-4 flex gap-8">
                    <div className="flex flex-col gap-2 flex-grow">
                        <LabeledDropdown
                            label="Страна"
                            selectLabel="Выберите"
                            selectedItem={filters.country}
                            onChangeSelectedItem={(val) =>
                                setFilters((prev) => ({ ...prev, country: val }))
                            }
                        >
                            {getItemsByName("countries").map((item, i) => (
                                <DropdownItem key={i}>{item}</DropdownItem>
                            ))}
                        </LabeledDropdown>

                        <LabeledDropdown
                            label="Категория"
                            selectLabel="Выберите"
                            selectedItem={filters.category}
                            onChangeSelectedItem={(val) =>
                                setFilters((prev) => ({ ...prev, category: val }))
                            }
                        >
                            {getItemsByName("categories").map((item, i) => (
                                <DropdownItem key={i}>{item}</DropdownItem>
                            ))}
                        </LabeledDropdown>

                        <div >
                            <MultiSelectDropdown
                                label="Жанры"
                                selectLabel="Выберите"
                                selectedItems={filters.genres}
                                onChangeSelectedItems={(val) =>
                                    setFilters((prev) => ({ ...prev, genres: val }))
                                }
                                className="mb-[5px]"
                            >
                                {getItemsByName("genres").map((item, i) =>
                                    <div key={i}>{item}</div>
                                )}
                            </MultiSelectDropdown>
                            <LabeledCheckmark label="Исключить Жанры" offStateLabel="нет" onStateLabel="да" state={filters.excludeGenres} onChangeState={(val) => setFilters((prev) => ({ ...prev, excludeGenres: val }))}></LabeledCheckmark>
                        </div>
                        <MultiSelectDropdown
                            label="Исключить закладки"
                            selectLabel="Выберите"
                            selectedItems={filters.bookmarks}
                            onChangeSelectedItems={(val) =>
                                setFilters((prev) => ({ ...prev, bookmarks: val }))
                            }
                        >
                            {getItemsByName("bookmarks_default_page_values").map((item, i) => (
                                <div key={i}>{item}</div>
                            ))}
                        </MultiSelectDropdown>

                        <LabeledDropdown
                            label="Студия"
                            selectLabel="Выберите"
                            selectedItem={filters.studio}
                            onChangeSelectedItem={(val) =>
                                setFilters((prev) => ({ ...prev, studio: val }))
                            }
                        >
                            {getItemsByName("studios").map((item, i) => (
                                <DropdownItem key={i}>{item}</DropdownItem>
                            ))}
                        </LabeledDropdown>

                        <LabeledDropdown
                            label="Первоисточник"
                            selectLabel="Выберите"
                            selectedItem={filters.source}
                            onChangeSelectedItem={(val) =>
                                setFilters((prev) => ({ ...prev, source: val }))
                            }
                        >
                            {getItemsByName("sources").map((item, i) => (
                                <DropdownItem key={i}>{item}</DropdownItem>
                            ))}
                        </LabeledDropdown>

                        <div className="my-4 flex gap-8">
                            <div className="flex flex-col gap-2 flex-grow">
                                <YearRangePicker
                                    label="Года"
                                    selectLabel="Выберите"
                                    fromYear={filters.fromYear}
                                    toYear={filters.toYear}
                                    onFromYearChange={(year) =>
                                        setFilters((prev) => ({ ...prev, fromYear: year }))
                                    }
                                    onToYearChange={(year) =>
                                        setFilters((prev) => ({ ...prev, toYear: year }))
                                    }
                                />
                                <LabeledDropdown
                                    label="Эпизодов"
                                    selectLabel="Выберите"
                                    selectedItem={filters.episode}
                                    onChangeSelectedItem={(val) =>
                                        setFilters((prev) => ({ ...prev, episode: val }))
                                    }
                                >
                                    {getItemsByName("episodes").map((item, i) => (
                                        <DropdownItem key={i}>{item}</DropdownItem>
                                    ))}
                                </LabeledDropdown>
                            </div>
                            <div className="flex flex-col gap-2 flex-grow">
                                <LabeledDropdown
                                    label="Сезон"
                                    selectLabel="Выберите"
                                    selectedItem={filters.season}
                                    onChangeSelectedItem={(val) =>
                                        setFilters((prev) => ({ ...prev, season: val }))
                                    }
                                >
                                    {getItemsByName("seasons").map((item, i) => (
                                        <DropdownItem key={i}>{item}</DropdownItem>
                                    ))}
                                </LabeledDropdown>

                                <LabeledDropdown
                                    label="Статус"
                                    selectLabel="Выберите"
                                    selectedItem={filters.status}
                                    onChangeSelectedItem={(val) =>
                                        setFilters((prev) => ({ ...prev, status: val }))
                                    }
                                >
                                    {getItemsByName("statuses").map((item, i) => (
                                        <DropdownItem key={i}>{item}</DropdownItem>
                                    ))}
                                </LabeledDropdown>
                            </div>
                        </div>

                        <LabeledDropdown
                            label="Длительность эризода"
                            selectLabel="Выберите"
                            selectedItem={filters.episodeDuration}
                            onChangeSelectedItem={(val) =>
                                setFilters((prev) => ({ ...prev, episodeDuration: val }))
                            }
                        >
                            {getItemsByName("episodeDurations").map((item, i) => (
                                <DropdownItem key={i}>{item}</DropdownItem>
                            ))}
                        </LabeledDropdown>

                        <MultiSelectDropdown
                            label="Возрастное ограничение"
                            selectLabel="Выберите"
                            selectedItems={filters.ageRating}
                            onChangeSelectedItems={(val) =>
                                setFilters((prev) => ({ ...prev, ageRating: val }))
                            }
                        >
                            {getItemsByName("ageRatings").map((item, i) => (
                                <div key={i}>{item}</div>
                            ))}
                        </MultiSelectDropdown>

                        <LabeledDropdown
                            label="Сортировка"
                            selectLabel="Выберите"
                            selectedItem={filters.sort}
                            onChangeSelectedItem={(val) =>
                                setFilters((prev) => ({ ...prev, sort: val }))
                            }
                        >
                            {getItemsByName("sort").map((item, i) => (
                                <DropdownItem key={i}>{item}</DropdownItem>
                            ))}
                        </LabeledDropdown>
                    </div>
                </div>
            </ModalBody>

            <ModalFooter className="flex items-center justify-between ">
                <Button color="red" className="flex-grow" onClick={clearFilters}>
                    Очистить
                </Button>
                <Button color="blue" className="flex-grow" onClick={applyFilters}>
                    Применить
                </Button>

            </ModalFooter>
        </Modal>
    );
};

export default Filter;
