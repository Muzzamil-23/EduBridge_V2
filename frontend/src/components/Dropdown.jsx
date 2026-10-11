import { Listbox } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

const Dropdown = ({ label, options, selected, onChange, error }) => (
    <div className="w-full">
        <Listbox value={selected} onChange={onChange}>
            <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </Listbox.Label>

            <div className="relative mt-1">
                <Listbox.Button
                    className="relative w-full cursor-pointer rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-10 text-left text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                >
                    <span className="block truncate">{selected || "Select..."}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                    </span>
                </Listbox.Button>

                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white border border-gray-200 py-1 shadow-lg focus:outline-none z-10">
                    {options.map((option, idx) => (
                        <Listbox.Option
                            key={idx}
                            value={option}
                            className={({ active, selected }) =>
                                `cursor-pointer select-none py-2 pl-4 pr-10 ${active
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-700"
                                } ${selected ? "font-semibold" : ""}`
                            }
                        >
                            {option}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </div>
        </Listbox>

        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
);

export default Dropdown