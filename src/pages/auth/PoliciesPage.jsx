import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const PoliciesPage = () => {
  const [activePolicy, setActivePolicy] = useState("terms");
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function resize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  const policies = {
    terms: (
      <div>
        <h2 className="text-xl font-semibold">Terms of Service</h2>
        <p className="text-gray-700 mt-2">
          Welcome to Renokon, a next-generation AI-powered platform that integrates social media, e-commerce, real-money quiz gaming, and chess gaming. By using our services, you
          agree to our terms. Please read them carefully before proceeding.
        </p>

        <h3 className="text-lg font-semibold mt-4">1. Acceptance of Terms</h3>
        <p className="text-gray-700">
          By creating an account, browsing, purchasing, playing games, or otherwise using Renokon, you agree to these Terms. If you do not agree, you must discontinue use
          immediately.
        </p>

        <h3 className="text-lg font-semibold mt-4">2. Eligibility</h3>
        <ul className="list-disc pl-5 text-gray-700">
          <li>You must be at least 14 years old to use Renokon.</li>
          <li>If engaging in real-money gaming, you must comply with legal age requirements.</li>
          <li>Users under 18 must have parental or guardian consent.</li>
          <li>You must provide accurate and up-to-date personal information.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4">3. User Accounts & Security</h3>
        <ul className="list-disc pl-5 text-gray-700">
          <li>You are responsible for maintaining account credentials safely.</li>
          <li>Sharing accounts is strictly prohibited.</li>
          <li>Unauthorized access should be reported immediately.</li>
          <li>Renokon reserves the right to suspend accounts involved in security breaches.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4">4. Platform Usage Rules</h3>
        <h4 className="text-md font-semibold mt-3">4.1 General Conduct</h4>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Illegal activities, fraud, or harassment are strictly prohibited.</li>
          <li>Hate speech, threats, or abusive content will not be tolerated.</li>
          <li>Users must not exploit, hack, or manipulate Renokon’s services.</li>
          <li>Bot activity, spamming, or unauthorized automation is not allowed.</li>
        </ul>

        <h4 className="text-md font-semibold mt-3">4.2 Content Guidelines</h4>
        <ul className="list-disc pl-5 text-gray-700">
          <li>You retain ownership of your content but grant Renokon a license to use it.</li>
          <li>Offensive, misleading, violent, or harmful content is prohibited.</li>
          <li>Users may report inappropriate content.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4">5. E-commerce Transactions</h3>
        <ul className="list-disc pl-5 text-gray-700">
          <li>All purchases must comply with consumer protection laws.</li>
          <li>Sellers must deliver products as described.</li>
          <li>Renokon is not liable for third-party disputes.</li>
          <li>Payments must be completed using Renokon’s system.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4">6. Real-Money Quiz & Chess Gaming</h3>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Players must follow fair play policies.</li>
          <li>Cheating, collusion, or hacking will result in bans.</li>
          <li>Entry fees and prizes will be credited to user wallets.</li>
          <li>Withdrawals require identity verification (KYC).</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4">7. Financial Transactions & Wallet System</h3>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Deposits and withdrawals are subject to verification.</li>
          <li>Wallet funds can be used for purchases, gaming, and premium features.</li>
          <li>Withdrawals take 5-7 business days.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4">8. Privacy & Data Protection</h3>
        <p className="text-gray-700">
          User data is collected and protected as per our{" "}
          <span onClick={() => setActivePolicy("privacy")} className="text-blue-500 cursor-pointer">
            Privacy Policy
          </span>
          . Users can manage privacy settings.
        </p>

        <h3 className="text-lg font-semibold mt-4">9. Account Suspension & Termination</h3>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Renokon reserves the right to suspend accounts violating policies.</li>
          <li>Users found engaging in fraud will forfeit any wallet balance.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4">10. Contact Information</h3>
        <p className="text-gray-700">
          For support, contact us at:{" "}
          <strong>
            <a href="mailto:support@renokon.com" className="text-blue-500">
              renokon.team@gmail.com
            </a>
          </strong>
        </p>
      </div>
    ),
    privacy: (
      <div>
        <h2 className="text-xl font-semibold">Privacy Policy</h2>
        <p className="text-gray-700 mt-2">
          At Renokon, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your data. We do not sell your personal
          information to third parties. Your trust is our priority.
        </p>

        <h3 className="text-lg font-semibold mt-4">1. Information We Collect</h3>
        <ul className="list-disc pl-5 mt-3 text-gray-700">
          <li>
            <strong>Account Information:</strong> Name, email address, phone number, and password.
          </li>
          <li>
            <strong>Payment Information:</strong> Transactions, deposits, and withdrawals for e-commerce and gaming.
          </li>
          <li>
            <strong>Device & Log Data:</strong> IP address, browser type, operating system, and activity logs.
          </li>
          <li>
            <strong>Usage Data:</strong> Interactions with the platform, such as posts, likes, and purchases.
          </li>
          <li>
            <strong>Location Data:</strong> If enabled, we collect your location to enhance platform features.
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-4">2. How We Use Your Data</h3>
        <ul className="list-disc pl-5 mt-3 text-gray-700">
          <li>To provide a seamless social media, e-commerce, and gaming experience.</li>
          <li>To personalize content, recommendations, and ads.</li>
          <li>For account verification, security, and fraud prevention.</li>
          <li>To improve platform features and user experience.</li>
          <li>To process payments and withdrawals securely.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4">3. Data Security & Protection</h3>
        <ul className="list-disc pl-5 mt-3 text-gray-700">
          <li>All sensitive data is encrypted and stored securely.</li>
          <li>We use firewalls, access controls, and security audits to protect data.</li>
          <li>Two-factor authentication (2FA) is available for additional security.</li>
          <li>Regular security updates and monitoring are performed to prevent breaches.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4">4. Sharing & Third-Party Services</h3>
        <ul className="list-disc pl-5 mt-3 text-gray-700">
          <li>
            Renokon does <strong>not</strong> sell or trade your personal data.
          </li>
          <li>We may share data with trusted third-party services for payment processing, fraud detection, and analytics.</li>
          <li>All third-party services comply with strict data protection laws.</li>
          <li>Users can control data-sharing preferences in account settings.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4">5. User Rights & Controls</h3>
        <ul className="list-disc pl-5 mt-3 text-gray-700">
          <li>Users can access, update, or delete their personal data at any time.</li>
          <li>Privacy settings allow users to manage visibility of posts and information.</li>
          <li>Users can opt out of personalized ads and data collection.</li>
          <li>Requests to delete accounts or data can be submitted via [Support Email].</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4">6. Data Retention</h3>
        <ul className="list-disc pl-5 mt-3 text-gray-700">
          <li>We retain user data for as long as necessary to provide services.</li>
          <li>Account data is deleted upon request, except where required by law.</li>
          <li>Transaction data may be stored longer for compliance purposes.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4">7. Policy Updates</h3>
        <p className="text-gray-700 mt-2">
          We may update this Privacy Policy periodically. Users will be notified of significant changes. Continued use of Renokon after updates constitutes agreement with the
          revised policy.
        </p>

        <h3 className="text-lg font-semibold mt-4">8. Contact Information</h3>
        <p className="text-gray-700 mt-2">
          If you have questions about our privacy practices, contact us at: <br />
          <strong>
            Email:{" "}
            <a href="mailto:support@renokon.com" className="text-blue-500">
              renokon.team@gmail.com
            </a>{" "}
          </strong>
          <br />
          <strong>
            Website: <a href="https://www.renokon.com">https://www.renokon.com</a>
          </strong>
        </p>
      </div>
    ),
    cookies: (
      <div>
        <h2 className="text-xl font-semibold">Cookies Policy</h2>
        <p className="text-gray-700 mt-2">
          Renokon uses cookies and similar tracking technologies to enhance your experience, analyze platform usage, and improve our services. By using Renokon, you consent to our
          use of cookies in accordance with this policy.
        </p>

        <h3 className="text-lg font-semibold mt-4">1. What Are Cookies?</h3>
        <p className="text-gray-700 mt-2">
          Cookies are small text files stored on your device when you visit a website. They help websites remember information about your visit, such as login details, preferences,
          and interactions, to improve your user experience.
        </p>

        <h3 className="text-lg font-semibold mt-4">2. Types of Cookies We Use</h3>
        <ul className="list-disc pl-5 mt-3 text-gray-700">
          <li>
            <strong>Essential Cookies:</strong> Necessary for core functionalities like authentication and account security.
          </li>
          <li>
            <strong>Performance Cookies:</strong> Help us understand how users interact with Renokon, improving speed and functionality.
          </li>
          <li>
            <strong>Analytical Cookies:</strong> Track platform usage to optimize features and user experience.
          </li>
          <li>
            <strong>Advertising Cookies:</strong> Personalize ads and recommendations based on user activity.
          </li>
          <li>
            <strong>Preference Cookies:</strong> Store user preferences such as theme, language, and notifications.
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-4">3. How We Use Cookies</h3>
        <p className="text-gray-700 mt-2">We use cookies to:</p>
        <ul className="list-disc pl-5 mt-3 text-gray-700">
          <li>Keep users securely signed in.</li>
          <li>Analyze traffic and usage trends to improve our services.</li>
          <li>Personalize content and recommendations.</li>
          <li>Enhance security by detecting fraud or malicious activities.</li>
          <li>Ensure seamless transactions and payment processing.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4">4. Third-Party Cookies</h3>
        <p className="text-gray-700 mt-2">
          We may use third-party services, such as analytics providers and advertisers, which set cookies to collect data on our behalf. These cookies are subject to third-party
          privacy policies.
        </p>

        <h3 className="text-lg font-semibold mt-4">5. Managing Cookies</h3>
        <p className="text-gray-700 mt-2">Users have full control over cookie settings. You can:</p>
        <ul className="list-disc pl-5 mt-3 text-gray-700">
          <li>Adjust browser settings to block or delete cookies.</li>
          <li>Opt-out of third-party cookies for personalized ads.</li>
          <li>Manage cookie preferences within your Renokon account settings.</li>
        </ul>
        <p className="text-gray-700 mt-2">Note: Disabling certain cookies may impact functionality and user experience.</p>

        <h3 className="text-lg font-semibold mt-4">6. Updates to This Policy</h3>
        <p className="text-gray-700 mt-2">Renokon reserves the right to update this Cookies Policy as needed. We encourage users to review it periodically.</p>

        <h3 className="text-lg font-semibold mt-4">7. Contact Us</h3>
        <p className="text-gray-700 mt-2">
          If you have any questions or concerns about our Cookies Policy, contact us at:{" "}
          <strong>
            <a href="mailto:support@renokon.com" className="text-blue-500">
              renokon.team@gmail.com
            </a>
          </strong>
          .
        </p>
      </div>
    ),
  };

  return (
    <div className="w-full inter inter relative mx-auto bg-white rounded-lg p-6">
      <Link to="/">
        <h1 className="logoHead cursor-pointer absolute top-1 left-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600">
          Renokon
        </h1>
      </Link>
      <div className=" absolute top-1 right-2 text-center">
        <Link to="/signup" className="text-blue-600 font-bold hover:underline">
          Sign Up
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-center text-blue-700 my-6">Our Policies</h1>
      <div className={`${width > 500 ? "flex justify-center " : "flex flex-col justify-center "}  mb-6`}>
        <button
          onClick={() => setActivePolicy("terms")}
          className={`px-4 py-2 ${width > 500 ? "mr-2" : "mb-2 "} hover:opacity-90 rounded-md ${activePolicy === "terms" ? "bg-blue-700 text-white" : "bg-gray-200 text-black"}`}
        >
          Terms of Service
        </button>
        <button
          onClick={() => setActivePolicy("privacy")}
          className={`px-4 py-2 ${width > 500 ? "mr-2 " : "mb-2 "} hover:opacity-90 rounded-md ${activePolicy === "privacy" ? "bg-blue-700 text-white" : "bg-gray-200 text-black"}`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setActivePolicy("cookies")}
          className={`px-4 py-2 ${width > 500 ? "" : "mb-2 "} hover:opacity-90 rounded-md ${activePolicy === "cookies" ? "bg-blue-700 text-white" : "bg-gray-200 text-black"}`}
        >
          Cookies Policy
        </button>
      </div>
      <div>{policies[activePolicy]}</div>
    </div>
  );
};

export default PoliciesPage;
