import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';

interface StatePageProps {
  content: string;
  stateName: string;
  cities: string[];
}

const StatePage: React.FC<StatePageProps> = ({ content, stateName, cities }) => {
  return (
    <div>
      <Head>
        <title>{stateName} - Detailed Information</title>
        <meta name="description" content={`Information about ${stateName}`} />
      </Head>
      
      <main>
        <h1>{stateName}</h1>
        <article dangerouslySetInnerHTML={{ __html: content }} />
        
        <div className="city-list">
          <h2>Cities in {stateName}</h2>
          {cities.map((city) => (
            <a 
              key={city} 
              href={`/${stateName.toLowerCase().replace(/\s+/g, '-')}-${city.toLowerCase().replace(/\s+/g, '-')}.html`}
            >
              {city}
            </a>
          ))}
        </div>
      </main>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const statesDir = path.join(process.cwd(), 'content', 'states');
  const states = fs.readdirSync(statesDir)
    .map(filename => path.parse(filename).name);

  const paths = states.map(state => ({
    params: { state: `${state}.html` }
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const stateName = params?.state?.replace('.html', '')
    .replace(/-/g, ' ')
    .replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );

  // Read state content
  const stateFile = path.join(process.cwd(), 'content', 'states', `${stateName?.toLowerCase().replace(/\s+/g, '-')}.md`);
  const fileContents = fs.readFileSync(stateFile, 'utf8');
  const { content } = matter(fileContents);

  // Get cities for this state
  const citiesDir = path.join(process.cwd(), 'content', 'cities', stateName?.toLowerCase().replace(/\s+/g, '-') || '');
  const cities = fs.readdirSync(citiesDir)
    .map(filename => path.parse(filename).name)
    .map(city => city.replace(/-/g, ' '))
    .map(city => city.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    ));

  return {
    props: {
      content,
      stateName,
      cities
    }
  };
};

export default StatePage;