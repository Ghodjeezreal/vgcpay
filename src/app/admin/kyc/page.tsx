"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaCheck, FaTimes, FaEye, FaUser, FaBriefcase } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function AdminKYCPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [kycRequests, setKycRequests] = useState<any[]>([]);
  const [selectedKyc, setSelectedKyc] = useState<any>(null);
  const [splitCode, setSplitCode] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      
      if (!parsedUser.isAdmin) {
        toast.error("Unauthorized access");
        router.push("/admin/login");
        return;
      }
      
      setUser(parsedUser);
      fetchKYCRequests(parsedUser.id);
    } else {
      router.push("/login");
    }
  }, [router]);

  const fetchKYCRequests = async (adminId: number) => {
    try {
      const response = await fetch(`/api/admin/kyc?adminId=${adminId}`);
      const data = await response.json();
      
      if (response.ok) {
        setKycRequests(data.kycRequests);
      }
    } catch (error) {
      console.error("Error fetching KYC requests:", error);
      toast.error("Failed to load KYC requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (kycRequest: any) => {
    if (!splitCode) {
      toast.error("Please enter split code");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/admin/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: user.id,
          userId: kycRequest.userId,
          action: "approve",
          splitCode,
        }),
      });

      if (response.ok) {
        toast.success("KYC approved successfully!");
        setSplitCode("");
        setSelectedKyc(null);
        fetchKYCRequests(user.id);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to approve KYC");
      }
    } catch (error) {
      console.error("Approve error:", error);
      toast.error("An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (kycRequest: any) => {
    if (!rejectionReason) {
      toast.error("Please enter rejection reason");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/admin/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: user.id,
          userId: kycRequest.userId,
          action: "reject",
          rejectionReason,
        }),
      });

      if (response.ok) {
        toast.success("KYC rejected");
        setRejectionReason("");
        setSelectedKyc(null);
        fetchKYCRequests(user.id);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to reject KYC");
      }
    } catch (error) {
      console.error("Reject error:", error);
      toast.error("An error occurred");
    } finally {
      setIsProcessing(false);
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
          <div className="max-w-7xl mx-auto px-6 py-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-[#353595] hover:text-[#2a276f] mb-4"
            >
              <FaArrowLeft />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-[#353595]">KYC Management</h1>
            <p className="text-gray-600 mt-2">
              Review and approve organizer verification requests
            </p>
          </div>
        </div>

        {/* KYC Requests List */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {kycRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500">No KYC requests found</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {kycRequests.map((kyc) => (
                <div
                  key={kyc.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${kyc.kycType === 'personal' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                        {kyc.kycType === 'personal' ? (
                          <FaUser className="text-2xl text-blue-600" />
                        ) : (
                          <FaBriefcase className="text-2xl text-purple-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {kyc.user.firstName} {kyc.user.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{kyc.user.email}</p>
                        <div className="mt-2 flex items-center gap-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            kyc.user.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            kyc.user.kycStatus === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {kyc.user.kycStatus}
                          </span>
                          <span className="text-xs text-gray-500">
                            {kyc.kycType === 'personal' ? 'Personal' : 'Business'} KYC
                          </span>
                          <span className="text-xs text-gray-500">
                            Submitted: {new Date(kyc.user.kycSubmittedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedKyc(kyc)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#353595] text-white rounded-lg hover:bg-[#2a276f] transition-colors"
                    >
                      <FaEye />
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* KYC Detail Modal */}
        {selectedKyc && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    KYC Review - {selectedKyc.user.firstName} {selectedKyc.user.lastName}
                  </h2>
                  <button
                    onClick={() => setSelectedKyc(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes className="text-2xl" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Personal/Business Details */}
                {selectedKyc.kycType === 'personal' ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                        <p className="text-gray-900">{selectedKyc.fullName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                        <p className="text-gray-900">{new Date(selectedKyc.dateOfBirth).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone Number</label>
                        <p className="text-gray-900">{selectedKyc.phoneNumber}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">ID Type</label>
                        <p className="text-gray-900 capitalize">{selectedKyc.idType?.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">ID Number</label>
                        <p className="text-gray-900">{selectedKyc.idNumber}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-500">Address</label>
                        <p className="text-gray-900">{selectedKyc.address}</p>
                      </div>
                      {selectedKyc.idDocumentUrl && (
                        <div className="col-span-2">
                          <label className="text-sm font-medium text-gray-500">ID Document</label>
                          <a
                            href={selectedKyc.idDocumentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#353595] hover:underline block"
                          >
                            View Document
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Business Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Business Name</label>
                        <p className="text-gray-900">{selectedKyc.businessName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Registration Number</label>
                        <p className="text-gray-900">{selectedKyc.businessRegNumber}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Business Type</label>
                        <p className="text-gray-900 capitalize">{selectedKyc.businessType?.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone Number</label>
                        <p className="text-gray-900">{selectedKyc.phoneNumber}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-500">Business Address</label>
                        <p className="text-gray-900">{selectedKyc.businessAddress}</p>
                      </div>
                      {selectedKyc.cacDocumentUrl && (
                        <div className="col-span-2">
                          <label className="text-sm font-medium text-gray-500">CAC Document</label>
                          <a
                            href={selectedKyc.cacDocumentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#353595] hover:underline block"
                          >
                            View Document
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Bank Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Bank Account Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Bank Name</label>
                      <p className="text-gray-900">{selectedKyc.bankName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Account Number</label>
                      <p className="text-gray-900">{selectedKyc.accountNumber}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-500">Account Name</label>
                      <p className="text-gray-900">{selectedKyc.accountName}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedKyc.user.kycStatus === 'pending' && (
                  <div className="border-t pt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Split Code (for approval)
                      </label>
                      <input
                        type="text"
                        value={splitCode}
                        onChange={(e) => setSplitCode(e.target.value)}
                        placeholder="SPL_xxxxxxxxxx"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#353595] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rejection Reason (if rejecting)
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Enter reason for rejection..."
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#353595] focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleApprove(selectedKyc)}
                        disabled={isProcessing || !splitCode}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <FaCheck />
                        Approve & Assign Split Code
                      </button>
                      <button
                        onClick={() => handleReject(selectedKyc)}
                        disabled={isProcessing || !rejectionReason}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <FaTimes />
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
