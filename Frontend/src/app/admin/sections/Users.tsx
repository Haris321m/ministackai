"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface User {
  Id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  PackageName?: string;
  Tokens?: string | number;
  TokensRemaining ?: string | number;
  PackageStart?: string;
  RemainingTime?: string | number;
  CurrentPlanId?: number;
}

interface Plan {
  Id: number;
  Name: string;
}

interface UserPlanReport {
  userId: number;
  planName: string;
  tokensUsed: number | null;
  tokensRemaining: number | null;
  planStartDate: string;
  daysPassed: number;
  remainingDays: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/users";
const PLANS_API = process.env.NEXT_PUBLIC_API_URL + "/plans";
const USER_PLANS_API = process.env.NEXT_PUBLIC_API_URL + "/userplans";
const TOKEN_PLANS_API = process.env.NEXT_PUBLIC_API_URL + "/limits";

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [userPlans, setUserPlans] = useState<UserPlanReport[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const token=Cookies.get("token")
      const response = await axios.get<User[]>(API_URL,{
         headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users");
    }
  };

  // Fetch all plans
  const fetchPlans = async () => {
    try {
      const token=Cookies.get("token")
      const response = await axios.get<Plan[]>(PLANS_API,{
         headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      setPlans(response.data);
    } catch (error) {
      console.error("Error fetching plans");
    }
  };

  // Fetch user plans report
  const fetchUserPlans = async () => {
    try {
      const token=Cookies.get("token")
      const response = await axios.get(TOKEN_PLANS_API,{
         headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      
      const plansArray: UserPlanReport[] = response.data.report || [];
      setUserPlans(plansArray);

      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          const plan = plansArray.find((up) => up.userId === user.Id);
          return plan
            ? {
                ...user,
                PackageName: plan.planName,
                Tokens: plan.tokensUsed ?? "0",
                TokensRemaining : plan.tokensRemaining ?? 0,
                PackageStart: plan.planStartDate,
                RemainingTime: plan.remainingDays,
              }
            : user;
        })
      );
    } catch (error) {
      console.error("Error fetching user plans");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPlans();
    fetchUserPlans();
  }, []);

  const handleEditChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (user: User) => {
    setEditingId(user.Id);
    setEditFormData({
      FirstName: user.FirstName,
      LastName: user.LastName,
      Email: user.Email,
      PackageName: user.PackageName || "",
    });
  };

  const handleSaveClick = async (id: number) => {
    try {
      const token=Cookies.get("token")
      await axios.put(`${API_URL}/${id}`, editFormData,{
         headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      const selectedPlan = plans.find(
        (p) => p.Name === editFormData.PackageName
      );

      if (selectedPlan) {
        const payload = {
          UserId: id,
          PlanId: selectedPlan.Id,
          Status: "active",
          AutoRenew: false,
        };

        const existingPlan = userPlans.find((up) => up.userId === id);
        if (existingPlan) {
          await axios.put(`${USER_PLANS_API}/${existingPlan.userId}`, payload,{
         headers: {
        Authorization: `Bearer ${token}`,
      },
      });
        } else {
          await axios.post(USER_PLANS_API, payload,{
         headers: {
        Authorization: `Bearer ${token}`,
      },
      });
        }
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.Id === id
            ? {
                ...user,
                ...editFormData,
                CurrentPlanId: selectedPlan?.Id ?? user.CurrentPlanId,
                PackageName: selectedPlan?.Name ?? user.PackageName,
              }
            : user
        )
      );

      setEditingId(null);
      fetchUserPlans();
    } catch (error) {
      console.error("Error updating user and plan");
    }
  };

  const handleDeleteClick = async (id: number) => {
    try {
      const token=Cookies.get("token")
      await axios.delete(`${API_URL}/${id}`,{
         headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      setUsers((prev) => prev.filter((user) => user.Id !== id));
      setUserPlans((prev) => prev.filter((up) => up.userId !== id));
    } catch (error) {
      console.error("Error deleting user");
    }
  };

  return (
    <div className="p-4 md:p-10 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Users Management
      </h1>

      <div className="overflow-x-auto rounded-xl shadow-lg bg-white dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {[
                "ID",
                "Name",
                "Email",
                "Package",
                "Tokens used",
                "Tokens Remaining",
                "Start",
                "Remaining",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="py-3 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr
                key={user.Id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="py-3 px-6">{user.Id}</td>
                <td className="py-3 px-6">
                  {editingId === user.Id ? (
                    <input
                      type="text"
                      name="FirstName"
                      value={editFormData.FirstName || ""}
                      onChange={handleEditChange}
                      className="border rounded-md px-2 py-1 w-full dark:bg-gray-800 dark:border-gray-600"
                    />
                  ) : (
                    <span className="font-medium">{user.FirstName} {user.LastName}</span>
                  )}
                </td>
                <td className="py-3 px-6">
                  {editingId === user.Id ? (
                    <input
                      type="email"
                      name="Email"
                      value={editFormData.Email || ""}
                      onChange={handleEditChange}
                      className="border rounded-md px-2 py-1 w-full dark:bg-gray-800 dark:border-gray-600"
                    />
                  ) : (
                    user.Email
                  )}
                </td>
                <td className="py-3 px-6">
                  {editingId === user.Id ? (
                    <select
                      name="PackageName"
                      value={editFormData.PackageName || ""}
                      onChange={handleEditChange}
                      className="border rounded-md px-2 py-1 w-full dark:bg-gray-800 dark:border-gray-600"
                    >
                      <option value="">-- Select Plan --</option>
                      {plans.map((plan) => (
                        <option key={plan.Id} value={plan.Name}>
                          {plan.Name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    user.PackageName || "-"
                  )}
                </td>
                <td className="py-3 px-6">{user.Tokens ?? "-"}</td>
                <td className="py-3 px-6">{user.TokensRemaining ?? "-"}</td>
                <td className="py-3 px-6">{user.PackageStart || "-"}</td>
                <td className="py-3 px-6">{user.RemainingTime ?? "-"}</td>
                <td className="py-3 px-6 flex flex-wrap gap-2">
                  {editingId === user.Id ? (
                    <button
                      onClick={() => handleSaveClick(user.Id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditClick(user)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteClick(user.Id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
