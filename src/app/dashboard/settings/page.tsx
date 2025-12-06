"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaSave, FaCheckCircle } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    paystackSplitCode: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      
      if (parsedUser.accountType === "attendee") {
        router.push("/dashboard/attendee");
        return;
      }
      
      setUser(parsedUser);
      setFormData({
        firstName: parsedUser.firstName || "",
        lastName: parsedUser.lastName || "",
        email: parsedUser.email || "",
        paystackSplitCode: parsedUser.paystackSplitCode || "",
      });
      setIsLoading(false);
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update localStorage with new user data
        const updatedUser = { ...user, ...formData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        toast.success("Settings updated successfully!");
      } else {
        toast.error(data.error || "Failed to update settings");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#353595]"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-[#353595] hover:text-[#2a276f] mb-4"
            >
              <FaArrowLeft />
              Back to Dashboard
            </Link>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-[#353595]">Settings</h1>
              <p className="text-gray-600 mt-2">
                Manage your account and payment settings
              </p>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Profile Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#353595] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#353595] focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>
            </div>

            {/* Payment Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Payment Settings
                </h2>
                <Link
                  href="/dashboard/kyc"
                  className="px-4 py-2 bg-[#353595] text-white rounded-lg hover:bg-[#2a276f] transition-colors text-sm font-medium"
                >
                  Manage KYC
                </Link>
              </div>
              
              {/* KYC Status Display */}
              {user && (
                <div className="mb-6">
                  {user.kycStatus === 'not_submitted' && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <h3 className="font-semibold text-amber-900 mb-2">
                        ⚠️ KYC Verification Required
                      </h3>
                      <p className="text-sm text-amber-800 mb-3">
                        You need to complete KYC verification to receive a split code and start receiving payments.
                      </p>
                      <Link
                        href="/dashboard/kyc"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                      >
                        Submit KYC Verification →
                      </Link>
                    </div>
                  )}
                  {user.kycStatus === 'pending' && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">
                        🕐 KYC Under Review
                      </h3>
                      <p className="text-sm text-blue-800">
                        Your KYC verification is being reviewed by our admin team. You'll receive your split code once approved.
                      </p>
                    </div>
                  )}
                  {user.kycStatus === 'rejected' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="font-semibold text-red-900 mb-2">
                        ❌ KYC Rejected
                      </h3>
                      <p className="text-sm text-red-800 mb-2">
                        Reason: {user.kycRejectionReason}
                      </p>
                      <Link
                        href="/dashboard/kyc"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Resubmit KYC →
                      </Link>
                    </div>
                  )}
                  {user.kycStatus === 'approved' && user.paystackSplitCode && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2">
                        ✅ KYC Approved
                      </h3>
                      <p className="text-sm text-green-800">
                        Your split code has been assigned and you can now receive payments!
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paystack Split Code
                  {formData.paystackSplitCode && (
                    <span className="ml-2 text-green-600 inline-flex items-center gap-1">
                      <FaCheckCircle className="text-sm" />
                      Connected
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  name="paystackSplitCode"
                  value={formData.paystackSplitCode}
                  readOnly
                  disabled
                  placeholder={user?.kycStatus === 'approved' ? formData.paystackSplitCode || "Will be assigned after KYC approval" : "Complete KYC verification first"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Split codes are assigned by admin after KYC approval
                </p>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#353595] text-white rounded-lg hover:bg-[#2a276f] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
