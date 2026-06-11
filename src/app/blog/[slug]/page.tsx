"use client";

import { useEffect, useState, use } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { BlogPost } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ChevronLeft } from "lucide-react";

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const q = query(
          collection(db, "blog"), 
          where("slug", "==", resolvedParams.slug),
          where("isPublished", "==", true)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setPost({ ...snapshot.docs[0].data(), id: snapshot.docs[0].id } as BlogPost);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [resolvedParams.slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div></div>;
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
        <Link href="/blog" className="text-primary-600 hover:underline">Return to Blog</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Image */}
      <div className="relative h-[40vh] md:h-[60vh] w-full bg-gray-900">
        <Image 
          src={post.coverImage || "/placeholder.png"} 
          alt={post.title} 
          fill 
          className="object-cover opacity-60" 
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto max-w-4xl">
            <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition">
              <ChevronLeft size={16} /> Back to Blog
            </Link>
            <div className="flex gap-3 mb-4">
              <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                {post.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <User size={18} /> <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} /> <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-4 py-12 md:py-20">
        <div 
          className="prose prose-lg md:prose-xl max-w-none text-gray-700 prose-headings:text-gray-900 prose-a:text-primary-600"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
        
        {/* Tags */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
