import React from 'react';

const Privacy = () => (
  <div className="max-w-3xl mx-auto my-10 p-6 bg-white text-black font-light leading-relaxed">
    <h1 className="text-3xl font-thin mb-2">Privacy Policy</h1>
    <p className="text-sm mb-6">Last updated: 4 October 2026</p>

    <p className="mb-4">
      Tech Blog is a personal portfolio project by Yolanda Mejane. This page explains what
      information the site collects when you sign in and how it is used.
    </p>

    <h2 className="text-xl mt-6 mb-2">What we collect</h2>
    <p className="mb-2">When you sign in with Google, we receive and store:</p>
    <ul className="list-disc ml-6 mb-4">
      <li>your name, email address and profile picture from your Google account</li>
      <li>an internal Google account identifier</li>
      <li>the time you last signed in</li>
    </ul>
    <p className="mb-4">
      If you publish a post, we also store its title, text, the display name you choose, an
      optional cover image, and the date, linked to your account. Posts are public.
    </p>

    <h2 className="text-xl mt-6 mb-2">How we use it</h2>
    <p className="mb-4">
      Only to run the site: to sign you in, show your name and photo, and make sure you can edit
      and delete your own posts. We do not sell your data, show ads, or use analytics or tracking.
    </p>

    <h2 className="text-xl mt-6 mb-2">Cookies</h2>
    <p className="mb-4">
      After you sign in, the site stores one cookie that keeps you signed in for up to 7 days. It
      cannot be read by scripts on the page, and it is deleted when you sign out. We do not use any
      other cookies.
    </p>

    <h2 className="text-xl mt-6 mb-2">Who handles the data</h2>
    <p className="mb-4">
      Google provides the sign-in. The site is hosted by Vercel and the data is stored in a MongoDB
      Atlas database. These services process data on our behalf under their own privacy policies.
    </p>

    <h2 className="text-xl mt-6 mb-2">Your choices</h2>
    <p className="mb-4">
      You can delete your own posts at any time while signed in. To have your account and its data
      removed, contact me through my GitHub profile at github.com/YolandaMejane1 and I will delete
      it. You can also remove this site&apos;s access from your Google account settings.
    </p>

    <h2 className="text-xl mt-6 mb-2">Changes</h2>
    <p>If this policy changes, the date at the top of this page will be updated.</p>
  </div>
);

export default Privacy;