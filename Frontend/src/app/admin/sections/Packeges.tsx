"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import Cookies from "js-cookie";

const api_url = process.env.NEXT_PUBLIC_API_URL;

type ModelType = {
  Id: string;
  Name: string;
};

type PackageType = {
  Id?: string;
  Name: string;
  Slug: string;
  Description: string;
  Price: number;
  Currency: string;
  TokensLimit: number;
  ImagesLimit: number;
  DurationDays: number;
  models: string[];
};

export default function Packages() {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [models, setModels] = useState<ModelType[]>([]);
  const [newPackage, setNewPackage] = useState<PackageType>({
    Name: "",
    Slug: "",
    Description: "",
    Price: 0,
    Currency: "USD",
    TokensLimit: 0,
    ImagesLimit: 0,
    DurationDays: 30,
    models: [],
  });
  const [modelsCount, setModelsCount] = useState<number>(0);
  const [editingPackage, setEditingPackage] = useState<PackageType | null>(null);
  const [editModelsCount, setEditModelsCount] = useState<number>(0);

  useEffect(() => {
    fetchPackages();
    fetchModels();
  }, []);

  const fetchPackages = async () => {
    try {
      const token=Cookies.get("token")
      const res = await axios.get(`${api_url}/plans`,{
         headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      setPackages(res.data);
    } catch (err) {
      console.error("Failed to fetch packages:", err);
    }
  };

  const fetchModels = async () => {
    try {
      const token=Cookies.get("token")
      const res = await axios.get(`${api_url}/models`,{
         headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      setModels(res.data);
    } catch (err) {
      console.error("Failed to fetch models:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token=Cookies.get("token")
      await axios.post(`${api_url}/plans/`, newPackage,{
         headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      resetForm();
      fetchPackages();
    } catch (err) {
      console.error("Failed to save package:", err);
    }
  };

  const resetForm = () => {
    setNewPackage({
      Name: "",
      Slug: "",
      Description: "",
      Price: 0,
      Currency: "USD",
      TokensLimit: 0,
      ImagesLimit: 0,
      DurationDays: 30,
      models: [],
    });
    setModelsCount(0);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      const token=Cookies.get("token")
      await axios.delete(`${api_url}/plans/${id}`,{
         headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      fetchPackages();
    } catch (err) {
      console.error("Failed to delete package:", err);
    }
  };

  const handleEdit = (pkg: PackageType) => {
    setEditingPackage({ ...pkg });
    setEditModelsCount(pkg.models.length);
  };

  const handleSaveEdit = async () => {
    try {
      const token=Cookies.get("token")
      if (editingPackage?.Id) {
        await axios.put(`${api_url}/plans/${editingPackage.Id}`, editingPackage,{
         headers: {
        Authorization: `Bearer ${token}`,
      },
      });
        setEditingPackage(null);
        fetchPackages();
      }
    } catch (err) {
      console.error("Failed to update package:", err);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Manage Packages
      </h1>

      {/* ADD PACKAGE FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 mb-10 grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-200 dark:border-gray-700"
      >
        {[
          { key: "Name", label: "Name", type: "text" },
          { key: "Slug", label: "Slug", type: "text" },
          { key: "Description", label: "Description", type: "text", full: true },
          { key: "Price", label: "Price", type: "number" },
          { key: "Currency", label: "Currency", type: "text" },
          { key: "TokensLimit", label: "Tokens Limit", type: "number" },
          { key: "ImagesLimit", label: "Images Limit", type: "number" },
          { key: "DurationDays", label: "Duration (Days)", type: "number" },
        ].map((field) => (
          <div key={field.key} className={field.full ? "md:col-span-2" : ""}>
            <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">
              {field.label}
            </label>
            <input
              type={field.type}
              value={(newPackage as any)[field.key]}
              onChange={(e) =>
                setNewPackage({
                  ...newPackage,
                  [field.key]:
                    field.type === "number"
                      ? Number(e.target.value)
                      : e.target.value,
                })
              }
              required={["Name", "Slug"].includes(field.key)}
              className="border border-gray-300 dark:border-gray-700 rounded-xl w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none"
            />
          </div>
        ))}

        {/* MODELS COUNT */}
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">
            How Many Models?
          </label>
          <input
            type="number"
            min="0"
            value={modelsCount}
            onChange={(e) => {
              const count = Number(e.target.value);
              setModelsCount(count);
              const updated = [...newPackage.models];
              while (updated.length < count) updated.push("");
              while (updated.length > count) updated.pop();
              setNewPackage({ ...newPackage, models: updated });
            }}
            className="border border-gray-300 dark:border-gray-700 rounded-xl w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        </div>

        {/* MODEL SELECTORS */}
        {Array.from({ length: modelsCount }).map((_, i) => (
          <div key={i} className="md:col-span-2">
            <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">
              Select Model {i + 1}
            </label>
            <select
              value={newPackage.models[i] || ""}
              onChange={(e) => {
                const updated = [...newPackage.models];
                updated[i] = e.target.value;
                setNewPackage({ ...newPackage, models: updated });
              }}
              className="border border-gray-300 dark:border-gray-700 rounded-xl w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900"
            >
              <option value="">-- Select Model --</option>
              {models.map((m) => (
                <option key={m.Id} value={m.Id}>
                  {m.Name}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl py-3 col-span-1 md:col-span-2 font-semibold shadow-md hover:scale-[1.02] hover:shadow-lg transition"
        >
          ➕ Add Package
        </button>
      </form>

      {/* PACKAGES LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.Id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-6 flex flex-col justify-between hover:scale-[1.02] hover:shadow-xl transition"
          >
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {pkg.Name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
                {pkg.Description}
              </p>
              <p className="mt-3 text-gray-800 dark:text-gray-200">
                💲 {pkg.Price} {pkg.Currency}
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Tokens: {pkg.TokensLimit} | Images: {pkg.ImagesLimit}
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                ⏳ {pkg.DurationDays} days
              </p>
              {pkg.models?.length > 0 && (
                <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
                  <strong>Models:</strong> {pkg.models.join(", ")}
                </p>
              )}
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => handleEdit(pkg)}
                className="flex items-center gap-2 bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition text-sm"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => handleDelete(pkg.Id!)}
                className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition text-sm"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl shadow-xl relative">
            <button
              onClick={() => setEditingPackage(null)}
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-500"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              ✏️ Edit Package
            </h2>

            {[
              { key: "Name", label: "Name", type: "text" },
              { key: "Slug", label: "Slug", type: "text" },
              { key: "Description", label: "Description", type: "text" },
              { key: "Price", label: "Price", type: "number" },
              { key: "Currency", label: "Currency", type: "text" },
              { key: "TokensLimit", label: "Tokens Limit", type: "number" },
              { key: "ImagesLimit", label: "Images Limit", type: "number" },
              { key: "DurationDays", label: "Duration (Days)", type: "number" },
            ].map((field) => (
              <div key={field.key} className="mb-3">
                <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={(editingPackage as any)[field.key]}
                  onChange={(e) =>
                    setEditingPackage({
                      ...editingPackage,
                      [field.key]:
                        field.type === "number"
                          ? Number(e.target.value)
                          : e.target.value,
                    })
                  }
                  className="border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 w-full text-sm bg-gray-50 dark:bg-gray-900"
                />
              </div>
            ))}

            {/* EDIT MODELS COUNT */}
            <div className="mb-3">
              <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1">
                How Many Models?
              </label>
              <input
                type="number"
                min="0"
                value={editModelsCount}
                onChange={(e) => {
                  const count = Number(e.target.value);
                  setEditModelsCount(count);
                  const updated = [...editingPackage.models];
                  while (updated.length < count) updated.push("");
                  while (updated.length > count) updated.pop();
                  setEditingPackage({ ...editingPackage, models: updated });
                }}
                className="border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 w-full text-sm bg-gray-50 dark:bg-gray-900"
              />
            </div>

            {/* EDIT MODEL SELECTS */}
            {Array.from({ length: editModelsCount }).map((_, i) => (
              <div key={i} className="mb-3">
                <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  Select Model {i + 1}
                </label>
                <select
                  value={editingPackage.models[i] || ""}
                  onChange={(e) => {
                    const updated = [...editingPackage.models];
                    updated[i] = e.target.value;
                    setEditingPackage({ ...editingPackage, models: updated });
                  }}
                  className="border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 w-full text-sm bg-gray-50 dark:bg-gray-900"
                >
                  <option value="">-- Select Model --</option>
                  {models.map((m) => (
                    <option key={m.Id} value={m.Id}>
                      {m.Name}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setEditingPackage(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded-xl hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700"
              >
                <FaSave /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
