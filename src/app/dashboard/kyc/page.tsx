"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaUser, FaBriefcase, FaUpload } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function KYCPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kycType, setKycType] = useState<"personal" | "business">("personal");
  const [idDocumentFile, setIdDocumentFile] = useState<File | null>(null);
  const [cacDocumentFile, setCacDocumentFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    // Personal fields
    fullName: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
    idType: "",
    idNumber: "",
    
    // Business fields
    businessName: "",
    businessRegNumber: "",
    businessAddress: "",
    businessType: "",
    
    // Bank details
    bankName: "",
    accountNumber: "",
    accountName: "",
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
      fetchKYCStatus(parsedUser.id);
    } else {
      router.push("/login");
    }
  }, [router]);

  const fetchKYCStatus = async (userId: number) => {
    try {
      const response = await fetch(`/api/kyc/status?userId=${userId}`);
      const data = await response.json();
      
      if (data.kycRequest) {
        // Pre-fill form with existing data
        setKycType(data.kycRequest.kycType);
        setFormData({
          fullName: data.kycRequest.fullName || "",
          dateOfBirth: data.kycRequest.dateOfBirth?.split("T")[0] || "",
          phoneNumber: data.kycRequest.phoneNumber || "",
          address: data.kycRequest.address || "",
          idType: data.kycRequest.idType || "",
          idNumber: data.kycRequest.idNumber || "",
          businessName: data.kycRequest.businessName || "",
          businessRegNumber: data.kycRequest.businessRegNumber || "",
          businessAddress: data.kycRequest.businessAddress || "",
          businessType: data.kycRequest.businessType || "",
          bankName: data.kycRequest.bankName || "",
          accountNumber: data.kycRequest.accountNumber || "",
          accountName: data.kycRequest.accountName || "",
        });
      }
    } catch (error) {
      console.error("Error fetching KYC status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'cac') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'id') {
        setIdDocumentFile(file);
      } else {
        setCacDocumentFile(file);
      }
    }
  };

  const uploadDocument = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload document');
    }

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let idDocumentUrl = "";
      let cacDocumentUrl = "";

      // Upload documents
      if (idDocumentFile) {
        toast.loading('Uploading ID document...');
        idDocumentUrl = await uploadDocument(idDocumentFile, 'kyc/documents');
        toast.dismiss();
      }

      if (cacDocumentFile) {
        toast.loading('Uploading business document...');
        cacDocumentUrl = await uploadDocument(cacDocumentFile, 'kyc/documents');
        toast.dismiss();
      }

      const response = await fetch("/api/kyc/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          kycType,
          ...formData,
          idDocumentUrl,
          cacDocumentUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("KYC submitted successfully! Awaiting admin approval.");
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        toast.error(data.error || "Failed to submit KYC");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#353595]"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
              <h1 className="text-3xl font-bold text-[#353595]">KYC Verification</h1>
              <p className="text-gray-600 mt-2">
                Complete your verification to receive payment split code
              </p>
            </div>
          </div>
        </div>

        {/* KYC Form */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* KYC Type Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Select KYC Type
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setKycType("personal")}
                className={`p-6 rounded-lg border-2 transition-all ${
                  kycType === "personal"
                    ? "border-[#353595] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <FaUser className="text-3xl mx-auto mb-3 text-[#353595]" />
                <h3 className="font-semibold text-gray-900">Personal</h3>
                <p className="text-sm text-gray-600 mt-1">Individual organizer</p>
              </button>
              <button
                type="button"
                onClick={() => setKycType("business")}
                className={`p-6 rounded-lg border-2 transition-all ${
                  kycType === "business"
                    ? "border-[#353595] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <FaBriefcase className="text-3xl mx-auto mb-3 text-[#353595]" />
                <h3 className="font-semibold text-gray-900">Business</h3>
                <p className="text-sm text-gray-600 mt-1">Registered company</p>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal KYC Fields */}
            {kycType === "personal" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#353595] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#353595] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#353595] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID Type *
                    </label>
                    <select
                      name="idType"
                      value={formData.idType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#353595] focus:border-transparent"
                    >
                      <option value="">Select ID Type</option>
                      <option value="nin">National ID (NIN)</option>
                      <option value="drivers_license">Driver's License</option>
                      <option value="international_passport">International Passport</option>
                      <option value="voters_card">Voter's Card</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID Number *
                    </label>
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#353595] focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#353595] focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID Document (PDF/Image) *
                    </label>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) => handleFileChange(e, 'id')}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#353595] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Business KYC Fields */}
            {kycType === "business" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Business Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#353595] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Number *
                    </label>
                    <input
                      type="text"
                      name="businessRegNumber"
                      value={formData.businessRegNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#353595] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type *
                    </label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#353595] focus:border-transparent"
                    >
                      <option value="">Select Type</option>
                      <option value="sole_proprietorship">Sole Proprietorship</option>
                      <option value="partnership">Partnership</option>
                      <option value="limited_company">Limited Company</option>
                      <option value="ngo">NGO</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#353595] focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address *
                    </label>
                    <textarea
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#353595] focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CAC Document (PDF/Image) *
                    </label>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) => handleFileChange(e, 'cac')}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#353595] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bank Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Bank Account Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#353595] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#353595] focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Name *
                  </label>
                  <input
                    type="text"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#353595] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#353595] text-white rounded-lg hover:bg-[#2a276f] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaUpload />
                    Submit KYC
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
