import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';

interface CityPageProps {
  content: string;
  stateName: string;
  cityName: string;
}

const CityPage: React.FC<CityPageProps> = ({ content, stateName, cityName }) => {
  return (
    <div>
      <Head>
        <title>{cityName}, {stateName} - Detailed Information</title>
        <meta name="description" content={`Information about ${cityName} in ${stateName}`} />
      </Head>
      
      <main>
        <h1>{cityName}, {stateName}</h1>
        <article dangerouslySetInnerHTML={{ __html: content }} />
      </main>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { state: string; city: string } }[] = [];
  
  const statesDir = path.join(process.cwd(), 'content', 'states');
  const states = fs.readdirSync(statesDir)
    .map(filename => path.parse(filename).name);

  states.forEach(state => {
    const citiesDir = path.join(process.cwd(), 'content', 'cities', state);
    const cities = fs.readdirSync(citiesDir)
      .map(filename => path.parse(filename).name);
    
    cities.forEach(city => {
      paths.push({
        params: { 
          state: `${state}.html`, 
          city: `${state}-${city}.html` 
        }
      });
    });
  });

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const stateName = params?.state?.replace('.html', '')
    .replace(/-/g, ' ')
    .replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );

  const cityName = params?.city?.replace('.html', '')
    .replace(/-/g, ' ')
    .replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );

  // Read city content
  const cityFile = path.join(
    process.cwd(), 
    'content', 
    'cities', 
    stateName?.toLowerCase().replace(/\s+/g, '-') || '',
    `${cityName?.toLowerCase().replace(/\s+/g, '-')}.md`
  );
  const fileContents = fs.readFileSync(cityFile, 'utf8');
  const { content } = matter(fileContents);

  return {
    props: {
      content,
      stateName,
      cityName
    }
  };
};

export default CityPage;