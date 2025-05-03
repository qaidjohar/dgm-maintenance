import React, { useEffect, useState } from 'react';
import { Facebook, Twitter, Instagram, Github } from 'lucide-react';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  urlToImage: string;
  source: {
    name: string;
  };
}

const MaintenancePage: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/news`,
          {
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setNews(data.articles.filter((article: NewsArticle) => article.urlToImage));
        setError(null);
      } catch (error: any) {
        if (error.name === 'AbortError') {
          setError('Request timed out. Please try again.');
        } else {
          setError('Failed to fetch news. Please try again later.');
        }
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="maintenance-container">
      {/* Top Section with Background */}
      <section className="top-section">
        <div className="top-content">
          <h1 className="maintenance-title">WE'RE UNDER MAINTENANCE</h1>
          <p className="maintenance-subtitle">OUR PLATFORM IS CURRENTLY BEING UPGRADED TO SERVE YOU BETTER.</p>
        </div>
      </section>

      {/* Middle Section with Social Links */}
      <section className="middle-section">
        <h2 className="text-2xl font-semibold mb-4">Stay Connected</h2>
        <div className="social-links">
          <a href="https://www.facebook.com/letsplaylivenz" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
            <Facebook size={24} />
          </a>
          <a href="https://x.com/letsplayliveGG" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
            <Twitter size={24} />
          </a>
          <a href="https://www.instagram.com/letsplaylivehq" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
            <Instagram size={24} />
          </a>
        </div>
      </section>

      {/* Bottom Section for News */}
      <section className="bottom-section">
        <div className="news-container">
          <h2 className="text-2xl font-semibold text-white mb-6 px-4">Latest Esports News</h2>
          <div className="news-grid">
            {loading ? (
              <div className="text-white">Loading news...</div>
            ) : error ? (
              <div className="text-white bg-red-500/20 p-4 rounded-lg">{error}</div>
            ) : (
              news.map((article, index) => (
                <a 
                  key={index} 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="news-card"
                >
                  <div className="news-image">
                    <img 
                      src={article.urlToImage} 
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="news-content">
                    <span className="source-tag">{article.source.name}</span>
                    <h3 className="news-title">{article.title}</h3>
                    <p className="news-description">{article.description}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MaintenancePage;