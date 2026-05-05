"use client";

import Image from "next/image";
import Link from "next/link";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image?: string;
  category: string;
  date: string;
  slug: string;
}

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-gray-200 p-8 rounded-32"
    >
      {/* Image Container - Light background with rounded corners */}
      <div className="relative h-[280px] rounded-xl overflow-hidden mb-4 bg-[#f5f0eb]">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {/* Arrow Button - Inside image, top right */}
        <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:bg-brand-orange transition-colors">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-600 group-hover:text-white transition-colors"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7,7 17,7 17,17" />
          </svg>
        </div>
      </div>

      {/* Content - Below image */}
      <div>
        <h3 className="font-oswald text-sm font-bold text-gray-900 mb-1 group-hover:text-brand-orange transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="font-poppins text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}
