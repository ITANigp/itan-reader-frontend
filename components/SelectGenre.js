import { useState } from "react";
import genreData from "@/constants/dataGenres";

export default function GenreSelector({ value, onChange }) {
  const [selected, setSelected] = useState({});
  const selections = value || [];

  const mainCategories = Object.keys(genreData);

  const getSubCategories = () => {
    const value = genreData[selected.main];
    if (Array.isArray(value)) return [];
    return Object.keys(value || {});
  };

  const getDetails = () => {
    const value = genreData[selected.main];
    if (Array.isArray(value)) return value;
    return value?.[selected.sub] || [];
  };

  const handleAdd = () => {
    if (selected.main && selected.detail && selections.length < 3) {
      onChange([...selections, { ...selected }]);
      setSelected({});
    }
  };

  const hasMaxSelections = selections.length >= 3;

  console.log("Selected genre array: ", selections);
  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-xl">
      <h2 className="text-lg font-semibold mb-4">Select Genre (Max 3)</h2>

      <div className="space-y-4">
        {/* Main Category */}
        <select
          className="w-full border p-2 rounded"
          value={selected.main || ""}
          onChange={(e) =>
            setSelected({
              main: e.target.value,
              sub: undefined,
              detail: undefined,
            })
          }
          disabled={hasMaxSelections}
        >
          <option value="">Select Main Genre</option>
          {mainCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Subcategory */}
        {selected.main && getSubCategories().length > 0 && (
          <select
            className="w-full border p-2 rounded"
            value={selected.sub || ""}
            onChange={(e) =>
              setSelected((prev) => ({
                ...prev,
                sub: e.target.value,
                detail: undefined,
              }))
            }
            disabled={hasMaxSelections}
          >
            <option value="">Select Subcategory</option>
            {getSubCategories().map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        )}

        {/* Detail */}
        {selected.main && getDetails().length > 0 && (
          <select
            className="w-full border p-2 rounded"
            value={selected.detail || ""}
            onChange={(e) =>
              setSelected((prev) => ({ ...prev, detail: e.target.value }))
            }
            disabled={hasMaxSelections}
          >
            <option value="">Select Specific</option>
            {getDetails().map((detail) => (
              <option key={detail} value={detail}>
                {detail}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={handleAdd}
          disabled={!selected.main || !selected.detail || hasMaxSelections}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Add Genre
        </button>

        {hasMaxSelections && (
          <p className="text-sm text-red-600 font-medium">
            You can only select up to 3 genres.
          </p>
        )}

        {/* Selected Genres */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Selected Genres</h3>
          {selections.map((sel, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-gray-100 p-2 rounded mb-1"
            >
              <span>
                {sel.main} {sel.sub ? `› ${sel.sub}` : ""} › {sel.detail}
              </span>
              <button
                onClick={() =>
                  onChange(selections.filter((_, i) => i !== idx))
                }
                className="bg-red-500 text-white hover:underline px-2 rounded-md"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
