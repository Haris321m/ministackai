"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { PlusCircle, Trash2 } from "lucide-react";
import Cookies from "js-cookie";

interface Model {
  Id: number;
  Name: string;
  Company: string;
  Type: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/models";

const Models: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    type: "",
    ModelFamily: "",
  });

  // Fetch all models
  const fetchModels = async () => {
    try {
      const token=Cookies.get("token")
      const response = await axios.get<Model[]>(API_URL,{
         headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      setModels(response.data);
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.company.trim() || !formData.type.trim()) return;

    try {
      const token=Cookies.get("token")
      await axios.post(API_URL, {
        Name: formData.name,
        Provider: formData.company,
        Type: formData.type,
        ModelFamily: formData.ModelFamily
      },{
         headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      setFormData({ name: "", company: "", type: "", ModelFamily: "" });
      fetchModels();
    } catch (error) {
      console.error("Error adding model:", error);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this model?")) return;
    try {
      const token=Cookies.get("token")
      await axios.delete(`${API_URL}/${id}`,{
         headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      setModels((prev) => prev.filter((m) => m.Id !== id));
    } catch (error) {
      console.error("Error deleting model:", error);
    }
  };

  return (
    <div className="p-4 md:p-10 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-center mb-10 text-blue-700 dark:text-blue-400">
        Manage AI Models
      </h1>

      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        {/* Form Section */}
        <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <PlusCircle className="text-blue-600 dark:text-blue-400" /> Add New Model
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                Model Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter model name"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 
                           dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                Company Name
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter company name"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 
                           dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                Type
              </label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Enter type"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 
                           dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                ModelFamily
              </label>
              <input
                type="text"
                name="ModelFamily"
                value={formData.ModelFamily}
                onChange={handleChange}
                placeholder="ModelFamily"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 
                           dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg 
                         hover:opacity-90 transition font-semibold shadow-md"
            >
              Add Model
            </button>
          </form>
        </div>

        {/* Models List Section */}
        <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Models List <span className="text-blue-600 dark:text-blue-400">({models.length})</span>
          </h2>

          <ul className="space-y-3">
            {models.map((model) => (
              <li
                key={model.Id}
                className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg p-3 
                           hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{model.Name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {model.Company} • {model.Type}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(model.Id)}
                  className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </li>
            ))}
            {models.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No models available.
              </p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Models;
