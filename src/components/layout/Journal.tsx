import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, ArrowUpRight } from 'lucide-react';

const HealthJournalSection = () => {
  const articles = [
    {
      id: 1,
      author: {
        name: "Dr Markus Sterl",
        credentials: "PhD. Nutrition",
        avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face"
      },
      title: "The Science of GLP-1s: How They Really Work",
      readTime: "5 min read"
    },
    {
      id: 2,
      author: {
        name: "Dr Sarah Anderson",
        credentials: "MD. Endocrinology",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face"
      },
      title: "A Patient's Story: My First 3 Months on the Program",
      readTime: "12 min read"
    },
    {
      id: 3,
      author: {
        name: "Dr Erik Lindqvist",
        credentials: "PhD. Behavioral Science",
        avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face"
      },
      title: "5 Healthy Swedish Habits for a Balanced Life",
      readTime: "3 min read"
    }
  ];

  const ArticleCard = ({ article, className = "" }) => (
    <Card className={`bg-white rounded-[20px] shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group ${className}`}>
      <CardContent className="p-0 h-full flex flex-col">
        {/* Author Section */}
        <div className="p-6 flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <img 
              className="w-full h-full object-cover" 
              src={article.author.avatar}
              alt={article.author.name}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-black text-base font-bold font-manrope leading-snug truncate">
              {article.author.name}
            </h3>
            <p className="text-zinc-800 text-base font-normal font-manrope leading-snug truncate">
              {article.author.credentials}
            </p>
          </div>
        </div>

        {/* Title Section */}
        <div className="px-6 py-3 flex-1 flex items-center">
          <h2 className="text-black text-xl lg:text-2xl font-bold font-sora leading-relaxed lg:leading-loose group-hover:text-teal-600 transition-colors duration-300">
            {article.title}
          </h2>
        </div>

        {/* Footer Section */}
        <div className="p-6 flex justify-between items-center">
          <div className="px-3 py-1 bg-emerald-50 rounded-full flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-zinc-600" />
            <span className="text-zinc-800 text-base font-normal font-manrope leading-snug">
              {article.readTime}
            </span>
          </div>
          <div className="w-6 h-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <ArrowUpRight className="w-4 h-4 text-black group-hover:text-teal-600 transition-colors duration-300" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-emerald-50 py-8 px-4 sm:py-12 sm:px-6 lg:py-20 lg:px-14">
      <div className="max-w-7xl mx-auto">
        <div className="p-6 sm:p-10 lg:p-14 rounded-3xl">
          
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-sora leading-tight lg:leading-[56.40px]">
              <span className="text-zinc-800">From Our </span>
              <span className="text-teal-600">Health Journal</span>
            </h1>
          </div>

          {/* Desktop Layout - 3 columns */}
          <div className="hidden lg:flex justify-start items-start gap-8">
            {articles.map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                className="flex-1 h-80"
              />
            ))}
          </div>

          {/* Tablet Layout - 2 columns */}
          <div className="hidden sm:grid lg:hidden grid-cols-2 gap-6 mb-6">
            {articles.slice(0, 2).map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article}
                className="h-72"
              />
            ))}
          </div>
          <div className="hidden sm:block lg:hidden">
            <ArticleCard 
              article={articles[2]} 
              className="h-72 max-w-md mx-auto"
            />
          </div>

          {/* Mobile Layout - 1 column */}
          <div className="sm:hidden flex flex-col gap-6">
            {articles.map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article}
                className="min-h-[280px]"
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default HealthJournalSection;