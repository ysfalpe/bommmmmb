'use client';
import { use } from 'react';
import Link from 'next/link';
import { blogPosts } from '../blogData';
import { notFound } from 'next/navigation';

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const post = blogPosts.find(p => p.slug === slug);
  
  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts.filter(p => post.relatedPosts.includes(p.slug));

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
              <Link href="/blog" className="text-gray-600 hover:text-gray-900 font-medium">← Back to Blog</Link>
              <Link href="/chat" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all">
                Chat Now
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Back to all articles
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {post.category}
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">{post.readTime}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">{post.date}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed mb-6">
            {post.excerpt}
          </p>

          <div className="flex items-center space-x-4 pb-8 border-b border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">✝</span>
            </div>
            <div>
              <div className="font-semibold text-gray-900">{post.author}</div>
              <div className="text-sm text-gray-500">Spiritual Guidance Team</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
            {post.content.split('\n').map((paragraph, index) => {
              // Check if it's a heading
              if (paragraph.startsWith('# ')) {
                return <h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{paragraph.substring(2)}</h1>;
              } else if (paragraph.startsWith('## ')) {
                return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{paragraph.substring(3)}</h2>;
              } else if (paragraph.startsWith('### ')) {
                return <h3 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">{paragraph.substring(4)}</h3>;
              } 
              // Check if it's a list item
              else if (paragraph.startsWith('- ')) {
                return <li key={index} className="text-gray-700 ml-6 mb-2">{paragraph.substring(2)}</li>;
              }
              // Check if it's bold text indicator
              else if (paragraph.startsWith('**')) {
                const text = paragraph.replace(/\*\*/g, '');
                return <p key={index} className="font-bold text-gray-900 mb-4">{text}</p>;
              }
              // Check if it's italic (prayer)
              else if (paragraph.startsWith('*"') && paragraph.endsWith('"*')) {
                const text = paragraph.substring(2, paragraph.length - 2);
                return <blockquote key={index} className="border-l-4 border-blue-600 pl-6 py-4 my-6 bg-blue-50 rounded-r-xl italic text-gray-700">{text}</blockquote>;
              }
              // Regular paragraph
              else if (paragraph.trim()) {
                return <p key={index} className="text-gray-700 mb-4 leading-relaxed">{paragraph}</p>;
              }
              return null;
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Personalized Spiritual Guidance?
          </h2>
          <p className="text-xl text-blue-100 mb-6">
            Chat with our AI pastor for personalized prayer and Biblical guidance
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

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {relatedPost.category}
                    </span>
                    <span className="text-sm text-gray-500">{relatedPost.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {relatedPost.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8">
          <p className="text-center text-gray-600">
            Have more questions? Chat with our AI pastor for personalized guidance.
          </p>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-12">
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
