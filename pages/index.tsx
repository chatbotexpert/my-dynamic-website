import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GetStaticProps } from 'next';
import Head from 'next/head';

interface HomeProps {
  content: string;
  states: string[];
}

const Home: React.FC<HomeProps> = ({ content, states }) => {
  return (
    <div>
      <Head>
        <title>My Dynamic Website</title>
        <meta name="description" content="Dynamic content website" />
      </Head>
      
      <main>
        <article dangerouslySetInnerHTML={{ __html: content }} />
        
        <div className="state-list">
          <h2>Our States</h2>
          {states.map((state) => (
            <a 
              key={state} 
              href={`/${state.toLowerCase().replace(/\s+/g, '-')}.html`}
            >
              {state}
            </a>
          ))}
        </div>
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // Read homepage content
  const homepageFile = path.join(process.cwd(), 'content', 'homepage.md');
  const fileContents = fs.readFileSync(homepageFile, 'utf8');
  const { content } = matter(fileContents);

  // Get list of states
  const statesDir = path.join(process.cwd(), 'content', 'states');
  const states = fs.readdirSync(statesDir)
    .map(filename => path.parse(filename).name)
    .map(state => state.replace(/-/g, ' '))
    .map(state => state.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    ));

  return {
    props: {
      content,
      states
    }
  };
};

export default Home;