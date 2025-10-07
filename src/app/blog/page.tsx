'use client';
import { useState } from 'react';
import Link from 'next/link';
import { blogPosts } from './blogData';

const categories = ['All', 'Prayer', 'Bible Study', 'Faith', 'Christian Living', 'Spiritual Growth'];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-bold">✝</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ChristianAI</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/chat" className="text-gray-600 hover:text-gray-900 font-medium">Chat</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</Link>
              <Link href="/blog" className="text-gray-900 font-semibold">Blog</Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              📖 Biblical Wisdom & Spiritual Guidance
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Faith Blog</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover Biblical wisdom, prayer guides, and spiritual insights to deepen your walk with Christ
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pr-12 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
              <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{post.date}</span>
                    <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                      Read more →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Deepen Your Faith?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Chat with our AI pastor for personalized spiritual guidance
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Start Conversation
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-lg font-bold">✝</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">ChristianAI</span>
          </div>
          <p className="text-sm text-slate-500">Built with faith, love, and AI • © 2024 ChristianAI</p>
        </div>
      </footer>
    </div>
  );
}
