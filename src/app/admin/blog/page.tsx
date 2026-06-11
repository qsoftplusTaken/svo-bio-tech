"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { BlogPost } from "@/types";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const q = query(collection(db, "blog"));
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as BlogPost));
        setPosts(fetched);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Blog CMS</h1>
          <p className="text-gray-500">Manage knowledge base articles and farming tips.</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-xl transition flex items-center gap-2">
          <Plus size={20} /> New Post
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Post Title</th>
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Category</th>
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Author</th>
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="py-10 text-center text-gray-500">Loading posts...</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-gray-500">No blog posts found. Create one!</td></tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-bold text-sm text-gray-900">{post.title}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{post.category}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{post.author}</td>
                    <td className="py-4 px-6">
                      {post.isPublished ? (
                        <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">Published</span>
                      ) : (
                        <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-full">Draft</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition"><Edit2 size={18} /></button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
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
