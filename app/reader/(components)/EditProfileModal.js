'use client';

import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/ProfileAuthContext";
import { allCountries } from "country-region-data";

export default function EditReaderProfile({ reader, onClose }) {
  const { setReader } = useAuth();

  const [formData, setFormData] = useState({
    first_name: reader?.first_name || "",
    last_name: reader?.last_name || "",
    email: reader?.email || "",
    country: reader?.country || "Nigeria",
    state: reader?.state || "Lagos",
  });

  const [states, setStates] = useState([]);

  // Update states when country changes
  useEffect(() => {
    const countryData = allCountries.find(
      (c) => c[0] === formData.country
    );
    if (countryData && countryData[2]) {
      setStates(countryData[2].map((r) => r[0]));
      // Set default state if current state is not in the list
      if (!countryData[2].map((r) => r[0]).includes(formData.state)) {
        setFormData((prev) => ({ ...prev, state: countryData[2][0][0] }));
      }
    } else {
      setStates([]);
      setFormData((prev) => ({ ...prev, state: "" }));
    }
  }, [formData.country]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setReader({ ...reader, ...formData });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg"
      >
        <h2 className="text-xl font-bold mb-6">Edit Profile</h2>

        {/* First Name */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            className="border border-red-700 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
            placeholder="Enter First Name"
          />
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            className="border border-red-700 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
            placeholder="Enter Last Name"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="border border-red-700 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Enter Email"
          />
        </div>

        {/* Country and State */}
        <div className="flex justify-between gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-gray-700 mb-1">Country</label>
            <select
              className="border border-red-700 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
            >
              {allCountries.map((c) => (
                <option key={c[1]} value={c[0]}>
                  {c[0]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-gray-700 mb-1">State / Province</label>
            <select
              className="border border-red-700 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
            >
              {states.length > 0 ? (
                states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))
              ) : (
                <option value="">No states available</option>
              )}
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white border rounded hover:bg-red-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save Edit
          </button>
        </div>
      </form>
    </div>
  );
}
