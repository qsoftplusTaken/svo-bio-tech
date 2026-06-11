"use client";

import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { Star } from "lucide-react";
import { toast } from "sonner";

export default function ReviewForm({ productId }: { productId: string }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }
    
    setLoading(true);
    try {
      await addDoc(collection(db, "reviews"), {
        productId,
        userId: user.uid,
        userName: user.displayName || "Anonymous User",
        rating,
        comment,
        isApproved: false, // Requires admin approval
        createdAt: new Date().toISOString()
      });
      toast.success("Review submitted! It will appear after moderation.");
      setComment("");
      setRating(5);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-100 p-6 rounded-2xl max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button 
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star 
                size={28} 
                className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Experience</label>
        <textarea 
          required
          rows={4}
          className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          placeholder="How did this product help your crops?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
      </div>

      <button 
        type="submit" 
        disabled={loading || !user}
        className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "Submitting..." : user ? "Submit Review" : "Login to Review"}
      </button>
    </form>
  );
}
