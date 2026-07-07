
'use client'
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Users, Globe2 } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { NewsCard } from './NewsCard';
import { NewsFilter } from './NewsFilter';
import { getTopHeadlines, getNewsByCountry } from '@/services/newsApi';
import { NewsArticle } from '@/types';

export const CountryPanel = () => {
  const {
    selectedCountry,
    setSelectedCountry,
    activeCategory,
    setActiveCategory,
    isDarkMode
  } = useAppContext();

  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCountry) fetchNews();
  }, [selectedCountry, activeCategory]);

  const fetchNews = async () => {
    if (!selectedCountry) return;

    setLoading(true);
    setError(null);

    try {
      let articles: NewsArticle[];

      try {
        articles = await getTopHeadlines(
          selectedCountry.iso2.toLowerCase(),
          activeCategory === 'general' ? undefined : activeCategory,
          25
        );

        if (articles.length === 0) {
          throw new Error('No articles');
        }

      } catch {
        articles = await getNewsByCountry(
          selectedCountry.name,
          activeCategory === 'general' ? undefined : activeCategory,
          25
        );
      }

      console.log("Articles:", articles);
      console.log("Count:", articles.length);

      console.log("BEFORE SET NEWS:", articles);
console.log("FIRST ARTICLE:", articles[0]);

setNews(articles);

      if (articles.length === 0) {
        setError('No news for this category.');
      }

    } catch (err: any) {

      const msg = err.message || 'Failed to load news';

      setError(
        msg.includes('rate')
          ? 'Rate limit. Try later.'
          : msg.includes('API')
          ? 'API key error.'
          : msg
      );

      setNews([]);

    } finally {
      setLoading(false);
    }
  };


  if (!selectedCountry) return null;


  const fmt = (n: number) =>
    new Intl.NumberFormat().format(n);


  return (
    <AnimatePresence>

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 250
        }}

        style={{
          position:'fixed',
          top:0,
          right:0,
          width:'100%',
          maxWidth:600,
          height:'100vh',
          zIndex:10000,
          overflowY:'auto',

          background:isDarkMode
            ? 'rgba(15,23,42,0.97)'
            : 'rgba(255,255,255,0.97)',

          backdropFilter:'blur(16px)',
          WebkitBackdropFilter:'blur(16px)',

          boxShadow:'-8px 0 32px rgba(0,0,0,0.3)'
        }}
      >

        <div
          style={{
            padding:'24px 20px 16px',
            borderBottom:isDarkMode
              ? '1px solid rgba(255,255,255,0.08)'
              : '1px solid rgba(0,0,0,0.08)',
            position:'sticky',
            top:0,
            zIndex:10,
            background:isDarkMode
              ? 'rgba(15,23,42,0.97)'
              : 'rgba(255,255,255,0.97)'
          }}
        >

          <div
            style={{
              display:'flex',
              alignItems:'center',
              justifyContent:'space-between',
              marginBottom:16
            }}
          >

            <div
              style={{
                display:'flex',
                alignItems:'center',
                gap:12
              }}
            >

              <span style={{fontSize:44}}>
                {selectedCountry.flag}
              </span>

              <div>

                <h2
                  style={{
                    fontSize:26,
                    fontWeight:800,
                    margin:0,
                    color:isDarkMode?'#fff':'#000'
                  }}
                >
                  {selectedCountry.name}
                </h2>

                <p
                  style={{
                    fontSize:13,
                    color:isDarkMode?'#94a3b8':'#64748b',
                    margin:0
                  }}
                >
                  {selectedCountry.region}
                </p>

              </div>

            </div>


            <motion.button
              whileHover={{scale:1.1}}
              whileTap={{scale:0.9}}
              onClick={() => setSelectedCountry(null)}

              style={{
                width:38,
                height:38,
                borderRadius:10,
                border:'none',
                cursor:'pointer',

                background:isDarkMode
                  ? 'rgba(255,255,255,0.06)'
                  : 'rgba(0,0,0,0.04)',

                display:'flex',
                alignItems:'center',
                justifyContent:'center',

                color:isDarkMode
                  ? '#cbd5e1'
                  : '#475569'
              }}
            >
              <X size={18}/>
            </motion.button>

          </div>


          <div
            style={{
              display:'grid',
              gridTemplateColumns:'repeat(3,1fr)',
              gap:10,
              marginBottom:16
            }}
          >

            <InfoTag
              icon={MapPin}
              label="Capital"
              value={selectedCountry.capital}
              dark={isDarkMode}
            />

            <InfoTag
              icon={Users}
              label="Population"
              value={fmt(selectedCountry.population)}
              dark={isDarkMode}
            />

            <InfoTag
              icon={Globe2}
              label="Currency"
              value={selectedCountry.currency}
              dark={isDarkMode}
            />

          </div>


          <NewsFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

        </div>


        <div style={{padding:20}}>

          {loading ? (

            <div style={{textAlign:'center',paddingTop:60}}>
              Loading news...
            </div>

          ) : error ? (

            <div style={{textAlign:'center',paddingTop:60}}>
              <h3>Unable to Load</h3>
              <p>{error}</p>

              <button onClick={fetchNews}>
                Retry
              </button>
            </div>

          ) : news.length === 0 ? (

            <div style={{textAlign:'center',paddingTop:60}}>
              No News
            </div>

          ) : (

            <div style={{display:'grid',gap:12}}>

              {news.map((article,index)=>(
                <NewsCard
                  key={article.id}
                  article={article}
                  index={index}
                />
              ))}

            </div>

          )}

        </div>


      </motion.div>

    </AnimatePresence>
  );
};



const InfoTag = ({
  icon:Icon,
  label,
  value,
  dark
}:{
  icon:any;
  label:string;
  value:string;
  dark:boolean;
}) => (

<div
style={{
padding:10,
borderRadius:12,

background:dark
?'rgba(255,255,255,0.04)'
:'rgba(0,0,0,0.03)',

border:dark
?'1px solid rgba(255,255,255,0.06)'
:'1px solid rgba(0,0,0,0.06)'
}}
>

<div
style={{
display:'flex',
alignItems:'center',
gap:6,
marginBottom:4
}}
>

<Icon
style={{
width:12,
height:12,
color:'#3b82f6'
}}
/>

<span
style={{
fontSize:10,
color:dark?'#94a3b8':'#64748b',
fontWeight:600
}}
>
{label}
</span>

</div>


<p
style={{
fontSize:13,
fontWeight:700,
color:dark?'#fff':'#000',
margin:0
}}
>
{value}
</p>

</div>

);
