"use client";

import React, { useState, useCallback } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import axios from "axios";
import { useAuth } from "@/components/ContextAPI";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function Jazzcash() {
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setScreenshot(file);
        setPreview(URL.createObjectURL(file));
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!screenshot) {
        alert("Please upload your JazzCash screenshot before submitting!");
        return;
      }

      if (!user?.id) {
        alert("User not logged in!");
        return;
      }

      if (!API_URL) {
        alert("API URL is not configured!");
        return;
      }

      try {
        setLoading(true);

        const formData = new FormData();
        formData.append("easypaisa", screenshot);

        await axios.post(`${API_URL}/limits/${user.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        alert("JazzCash payment proof submitted successfully!");
        setScreenshot(null);
        setPreview(null);
      } catch (err: unknown) {
        console.error("Upload error:", err);
        alert("Failed to upload proof. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [screenshot, user, API_URL]
  );

  return (
    <div className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-2xl rounded-2xl p-6 w-full max-w-md mx-auto transition-all duration-500">
      {/* Title */}
      <h2 className="text-3xl font-extrabold text-center text-orange-600 dark:text-orange-400 mb-3">
        JazzCash Payment Proof
      </h2>

      {/* Info Section */}
      <div className="my-10">
        <h1 className="text-xl font-bold">Unlock the Power of AI with Our Simple Plans</h1>
        <p>
          Ready to dive into the world of AI? We've made it easy to get started.
          Just pick the plan that fits your needs and we’ll handle the rest.
        </p>

        <div className="my-5">
          <h1 className="text-xl font-bold">Our Plans:</h1>
          <h2 className="text-xl font-bold ml-10">Basic Access: $6</h2>
          <h2 className="text-xl font-bold ml-10">Full Access: $40</h2>
        </div>

        <h1 className="text-xl font-bold">Here’s How to Get Started:</h1>
        <p>
          Simply pay for your chosen plan through JazzCash. Once you've paid,
          send us a screenshot of the payment confirmation. Our team will quickly
          verify it and activate your plan on your account within one hour.
        </p>

        <h1 className="mt-4 font-bold">JazzCash:</h1>
        <p className="mt-2 text-xl">03043133339</p>
      </div>

      <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
        Upload your JazzCash payment screenshot to confirm your payment.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <label className="text-gray-700 dark:text-gray-300 font-medium">
          Upload Screenshot
        </label>

        {/* Upload Area */}
        <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-orange-400 rounded-xl p-6 text-center hover:bg-orange-50 dark:hover:bg-gray-700 transition cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <FiUpload className="text-4xl text-orange-500 mb-2" />
          <p className="text-gray-700 dark:text-gray-300">
            Drag & drop or click to upload
          </p>
        </div>

        {/* Preview Section */}
        {preview && (
          <div className="relative group">
            <img
              src={preview}
              alt="JazzCash Payment Screenshot"
              className="rounded-xl border border-gray-300 dark:border-gray-600 shadow-md max-h-64 object-contain w-full transition-transform duration-300 group-hover:scale-105"
            />
            <button
              type="button"
              onClick={() => {
                setScreenshot(null);
                setPreview(null);
              }}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-md transition"
              aria-label="Remove screenshot"
            >
              <FiX />
            </button>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 px-6 rounded-xl shadow-lg text-lg font-semibold transition transform hover:scale-105 active:scale-95 disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Proof"}
        </button>
      </form>
    </div>
  );
}
