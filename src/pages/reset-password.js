import React, { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {passwordResetVerify} from "@/components/services/auth";

const ResetPassword = () => {
  const { t } = useTranslation("common");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();
  const { code } = router.query;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await passwordResetVerify({newPassword: new_password , code})
      setSuccessMessage("Password has been reset successfully.");
      router.push("/signin");
    } catch (err) {
      console.log(err)
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-black">
        {t("Reset Password")}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <div className="mb-4">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700"
          >
            {t("New Password")}
          </label>
          <input
            type="password"
            id="newPassword"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm text-black"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ color: "black" }}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            {t("Confirm Password")}
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm text-black"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ color: "black" }}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {successMessage && (
          <p className="text-green-500 text-sm">{successMessage}</p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {t("Reset Password")}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
