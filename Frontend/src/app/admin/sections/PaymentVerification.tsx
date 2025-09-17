"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const api_image = process.env.NEXT_PUBLIC_API_IMAGE_URL;

interface PaymentProof {
  id: number;
  imageUrl: string;
  uploadedAt: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  paymentProofs: PaymentProof[];
}

export default function PaymentVerification() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token=Cookies.get("token")
      setLoading(true);
      const res = await axios.get(`${API_URL}/limits/getpayments`,{
         headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      console.log(res.data);
      setUsers(res.data.users || []);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const deleteProof = async (userId: number, proofId: number) => {
    try {
      const token=Cookies.get("token")
      await axios.delete(`${API_URL}/limits/${proofId}`,{
         headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      // update UI by removing proof locally
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                paymentProofs: user.paymentProofs.filter(
                  (proof) => proof.id !== proofId
                ),
              }
            : user
        )
      );
      alert("Payment proof deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting proof:", err);
      alert("Failed to delete payment proof");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading Users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-10">
        Payment Verification
      </h1>

      {users.length === 0 ? (
        <p className="text-center text-gray-500">No users found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 flex flex-col items-center hover:scale-[1.02] transition"
            >
              <h2 className="text-xl font-semibold text-center">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-500 text-sm">{user.email}</p>

              {user.paymentProofs && user.paymentProofs.length > 0 ? (
                <div className="relative w-full mt-4 space-y-4">
                  {user.paymentProofs.map((proof) => (
                    <div
                      key={proof.id}
                      className="flex flex-col items-center space-y-2"
                    >
                      <Image
                        src={`${api_image}${proof.imageUrl}`}
                        alt="Payment Proof"
                        width={300}
                        height={300}
                        className="rounded-lg object-contain mx-auto"
                      />

                      {/* Delete button */}
                      <button
                        onClick={() => deleteProof(user.id, proof.id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-yellow-600">No payment proof uploaded</p>
              )}

              {/* Verification Button */}
              <button
                onClick={() =>
                  alert(
                    `Verified payment for ${user.firstName} ${user.lastName} (ID: ${user.id})`
                  )
                }
                disabled={!user.paymentProofs || user.paymentProofs.length === 0}
                className={`mt-4 w-full py-2 rounded-lg font-semibold transition ${
                  user.paymentProofs && user.paymentProofs.length > 0
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {user.paymentProofs && user.paymentProofs.length > 0
                  ? "Verify Payment"
                  : "Awaiting Proof"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
