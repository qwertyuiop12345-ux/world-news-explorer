'use client';

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

    if (selectedCountry) {
      fetchNews();
    }

  }, [selectedCountry, activeCategory]);



  const fetchNews = async () => {

    if (!selectedCountry) return;


    setLoading(true);
    setError(null);


    try {

      let articles: NewsArticle[] = [];


      try {

        articles = await getTopHeadlines(
          selectedCountry.iso2.toLowerCase(),
          activeCategory === 'general'
            ? undefined
            : activeCategory,
          25
        );


        if (!articles.length) {
          throw new Error('No headlines');
        }


      } catch {

        articles = await getNewsByCountry(
          selectedCountry.name,
          activeCategory === 'general'
            ? undefined
            : activeCategory,
          25
        );

      }



      console.log("NEWS DATA:", articles);


      setNews(articles);



      if (!articles.length) {

        setError(
          'No news available for this country/category.'
        );

      }



    } catch (err: any) {


      console.error(err);


      const message =
        err?.message || 'Failed to load news';



      setError(message);


      setNews([]);



    } finally {

      setLoading(false);

    }

  };



  if (!selectedCountry) {
    return null;
  }



  const formatNumber = (value:number) =>
    new Intl.NumberFormat().format(value);



  return (

    <AnimatePresence>


      <motion.div

        initial={{
          x:'100%'
        }}

        animate={{
          x:0
        }}

        exit={{
          x:'100%'
        }}

        transition={{
          type:'spring',
          damping:30,
          stiffness:250
        }}


        style={{

          position:'fixed',
          right:0,
          top:0,

          width:'100%',
          maxWidth:600,

          height:'100vh',

          overflowY:'auto',

          zIndex:10000,


          background:isDarkMode
            ? '#0f172a'
            : '#ffffff',


          boxShadow:
            '-8px 0 32px rgba(0,0,0,.25)'

        }}

      >



        <div

          style={{

            padding:'24px 20px 16px',

            position:'sticky',
            top:0,

            zIndex:20,


            background:isDarkMode
              ? '#0f172a'
              : '#ffffff',


            borderBottom:
              isDarkMode
              ? '1px solid rgba(255,255,255,.08)'
              : '1px solid rgba(0,0,0,.08)'

          }}

        >



          <div

            style={{

              display:'flex',

              justifyContent:'space-between',

              alignItems:'center',

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

              <span style={{
                fontSize:44
              }}>

                {selectedCountry.flag}

              </span>



              <div>


                <h2

                  style={{

                    margin:0,

                    fontSize:26,

                    fontWeight:800,

                    color:isDarkMode
                      ? '#fff'
                      : '#000'

                  }}

                >

                  {selectedCountry.name}

                </h2>



                <p

                  style={{

                    margin:0,

                    color:isDarkMode
                    ? '#94a3b8'
                    : '#64748b'

                  }}

                >

                  {selectedCountry.region}

                </p>



              </div>


            </div>




            <button

              onClick={() =>
                setSelectedCountry(null)
              }


              style={{

                width:38,
                height:38,

                borderRadius:10,

                border:'none',

                cursor:'pointer',

                background:
                  isDarkMode
                  ? 'rgba(255,255,255,.06)'
                  : 'rgba(0,0,0,.05)'

              }}

            >

              <X size={18}/>

            </button>


          </div>




          <div

            style={{

              display:'grid',

              gridTemplateColumns:
                'repeat(3,1fr)',

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
              value={formatNumber(selectedCountry.population)}
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





        <div

          style={{

            padding:20,

            display:'grid',

            gap:14

          }}

        >



          {loading && (

            <p style={{
              textAlign:'center'
            }}>

              Loading news...

            </p>

          )}






          {error && !loading && (

            <div style={{
              textAlign:'center'
            }}>


              <h3>
                Unable to Load
              </h3>


              <p>
                {error}
              </p>


              <button onClick={fetchNews}>
                Retry
              </button>


            </div>

          )}







          {!loading &&
          !error &&
          news.length > 0 && (


            <>


            <h2

              style={{

                fontSize:18,

                color:isDarkMode
                ? '#fff'
                : '#000'

              }}

            >

              Total Articles: {news.length}

            </h2>



            {news.map((article,index)=>(


              <NewsCard

                key={
                  article.id ||
                  `${article.url}-${index}`
                }

                article={article}

                index={index}

              />


            ))}


            </>


          )}






          {!loading &&
          !error &&
          news.length===0 && (

            <p style={{
              textAlign:'center'
            }}>

              No News Found

            </p>

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


background:
dark
?'rgba(255,255,255,.04)'
:'rgba(0,0,0,.03)',


border:
dark
?'1px solid rgba(255,255,255,.06)'
:'1px solid rgba(0,0,0,.06)'


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

size={12}

color="#3b82f6"

/>


<span

style={{

fontSize:10,

fontWeight:600,

color:dark
?'#94a3b8'
:'#64748b'

}}

>

{label}

</span>


</div>



<p

style={{

margin:0,

fontSize:13,

fontWeight:700,

color:dark
?'#fff'
:'#000'

}}

>

{value}

</p>



</div>


);
