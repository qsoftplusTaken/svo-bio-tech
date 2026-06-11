"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, query } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Review } from "@/types";
import { Star, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const q = query(collection(db, "reviews"));
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Review));
      // Sort newest first
      fetched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setReviews(fetched);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleApproval = async (reviewId: string, isApproved: boolean) => {
    try {
      await updateDoc(doc(db, "reviews", reviewId), { isApproved });
      setReviews(reviews.map(r => r.id === reviewId ? { ...r, isApproved } : r));
      toast.success(isApproved ? "Review Approved" : "Review Rejected/Hidden");
    } catch (error) {
      toast.error("Failed to update review status");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Moderation</h1>
      <p className="text-gray-500 mb-8">Approve or reject customer reviews before they appear on the site.</p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Rating & Review</th>
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="py-10 text-center text-gray-500">Loading reviews...</td></tr>
              ) : reviews.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-gray-500">No reviews found.</td></tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-900">{review.userName}</td>
                    <td className="py-4 px-6 max-w-md">
                      <div className="flex gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                    </td>
                    <td className="py-4 px-6">
                      {review.isApproved ? (
                        <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">Approved</span>
                      ) : (
                        <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2 py-1 rounded-full">Pending</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleApproval(review.id, true)}
                          disabled={review.isApproved}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
                          title="Approve"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button 
                          onClick={() => handleApproval(review.id, false)}
                          disabled={!review.isApproved}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                          title="Reject"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
