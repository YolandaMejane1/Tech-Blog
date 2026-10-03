import React from 'react';
import usePosts from '../hooks/usePosts';
import { getImageSrc, handleImageError } from '../utils/image';

const About = () => {
  const { posts } = usePosts();

  return (
    <div className="container">
      <section
        className="relative h-[70vh] w-screen bg-cover bg-no-repeat bg-center text-white py-10 px-10"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1484807352052-23338990c6c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmxhY2slMjBhbmQlMjB3aGl0ZSUyMHRlY2h8ZW58MHwwfDB8fHww')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="max-w-6xl mx-auto mt-20 text-center relative z-10">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-semibold">
            Explore. Create. <br /> Code. Innovate.
          </h1>
          <p className="text-lg md:text-2xl mt-4 font-light">
            Our blog is a space for innovators, developers, and tech enthusiasts to  
            share ideas, explore the latest technology trends, and dive deep into  
            the world of all things code.
          </p>
        </div>
      </section>

      <section className="flex flex-col lg:flex-row mb-8 w-screen">
        <div className="lg:w-2/3">
          <img 
            src="https://images.unsplash.com/39/lIZrwvbeRuuzqOoWJUEn_Photoaday_CSD%20%281%20of%201%29-5.jpg?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJsYWNrJTIwYW5kJTIwd2hpdGUlMjBvZmZpY2UlMjBtZWV0aW5nfGVufDB8MHwwfHx8MA%3D%3D" 
            alt="People meeting in an office" 
            className="w-full h-full py-5 px-5"
          />
        </div>
        <div className="lg:w-screen pl-4 mt-4 lg:mt-0 py-5 w-screen">
          <h3 className="text-3xl font-normal">Our Story...</h3>
          <p className="mt-2 text-gray-600 font-light">
            At KODEMOR, we are committed to providing valuable insights and fostering a community focused on tech education and development.
          </p>

          <h4 className="text-l font-normal mt-6">Who We Are</h4>
          <p className="mt-2 text-gray-600 font-light">
            We are a passionate group of developers and tech enthusiasts dedicated to empowering individuals with the knowledge and tools to thrive in tech.
          </p>

          <h4 className="text-l mt-6 font-normal">Mission</h4>
          <p className="mt-2 text-gray-600 font-light">
            Our mission is to form a supportive community to help individuals develop their skills and unlock new opportunities in the tech industry.
          </p>

          <h4 className="text-l font-normal mt-6">Vision</h4>
          <p className="mt-2 text-gray-600 font-light">
            We envision a future where everyone has access to the tools, knowledge, and networks they need to succeed in the tech world.
          </p>
        </div>
      </section>

      <section className="mb-8 w-screen">
        <h3 className="text-3xl font-normal mb-4 ml-5">Latest Posts</h3>
        <div className="overflow-hidden relative ">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-marquee px-4">
            {posts.length > 0 ? (
              posts.slice(0, 4).map((post) => (
                <div key={post.id} className="bg-gray-100 p-2 border border-black">
                  {post.image_url && (
                    <img
                      src={getImageSrc(post)}
                      alt={post.title}
                      className="w-full h-40 object-cover mb-4"
                      onError={handleImageError}
                    />
                  )}
                  <h4 className="font-semibold">{post.title}</h4>
                  <p className="text-sm">{post.content.slice(0, 100)}...</p>
                </div>
              ))
            ) : (
              <p>No posts available.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
