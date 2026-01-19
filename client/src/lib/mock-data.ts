import modernSaasHomepage from '@assets/generated_images/modern_saas_homepage_screenshot.png';
import saasPricingPage from '@assets/generated_images/saas_pricing_page_screenshot.png';
import saasSignupForm from '@assets/generated_images/saas_signup_form_screenshot.png';
import saasDashboard from '@assets/generated_images/saas_analytics_dashboard_screenshot.png';
import socialMediaAd from '@assets/generated_images/social_media_ad_50_percent_off.png';
import ecommerceProductPage from '@assets/generated_images/ecommerce_product_page_40_percent_off.png';

export type EventType = 'action' | 'insight' | 'alert' | 'user' | 'ai';

export interface StoryEvent {
  id: string;
  type: EventType;
  title?: string;
  content: string; // Text content or Image URL
  image?: string; // For action cards
  timestamp: string;
  metadata?: Record<string, string>;
}

export interface Scenario {
  id: string;
  name: string;
  persona: string;
  goal: string;
  events: StoryEvent[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'competitor-analysis',
    name: 'Competitor Onboarding Analysis',
    persona: 'Alex, Product Manager',
    goal: 'Analyze competitor.com onboarding flow',
    events: [
      {
        id: 'evt-1',
        type: 'user',
        content: 'Analyze the new user signup and onboarding flow for competitor.com.',
        timestamp: '10:00 AM'
      },
      {
        id: 'evt-2',
        type: 'ai',
        content: 'Understood. Simulating a new user signing up for competitor.com...',
        timestamp: '10:00 AM'
      },
      {
        id: 'evt-3',
        type: 'action',
        title: '1. Visited Homepage',
        content: 'Navigated to https://competitor.com',
        image: modernSaasHomepage,
        timestamp: '10:01 AM',
        metadata: { 'Load Time': '0.8s', 'Status': '200 OK' }
      },
      {
        id: 'evt-4',
        type: 'user',
        content: 'Okay, find their pricing and then sign up for the free trial.',
        timestamp: '10:02 AM'
      },
      {
        id: 'evt-5',
        type: 'ai',
        content: 'Searching for pricing... Found it. Now proceeding to sign up...',
        timestamp: '10:02 AM'
      },
      {
        id: 'evt-6',
        type: 'action',
        title: '2. Analyzed Pricing',
        content: 'Identified 3 tiers. "Pro" plan is highlighted.',
        image: saasPricingPage,
        timestamp: '10:02 AM',
        metadata: { 'Elements': '3 Cards', 'CTA': 'Start Free Trial' }
      },
      {
        id: 'evt-7',
        type: 'insight',
        title: 'INSIGHT',
        content: 'The pricing page uses social proof effectively by showing logos of well-known customers directly below the CTA.',
        timestamp: '10:02 AM'
      },
      {
        id: 'evt-8',
        type: 'action',
        title: '3. Started Signup Process',
        content: 'Clicked "Start Free Trial"',
        image: saasSignupForm,
        timestamp: '10:03 AM'
      },
      {
        id: 'evt-9',
        type: 'user',
        content: 'What happens if I enter a weak password?',
        timestamp: '10:04 AM'
      },
      {
        id: 'evt-10',
        type: 'ai',
        content: 'Good question. Testing with a weak password... The system provided an inline validation error.',
        timestamp: '10:04 AM'
      },
      {
        id: 'evt-11',
        type: 'alert',
        title: 'UX FRICTION',
        content: 'Password strength requirement is not explicitly stated, only shown after a failed attempt. This could cause minor friction.',
        timestamp: '10:04 AM'
      },
      {
        id: 'evt-12',
        type: 'user',
        content: 'Okay, use a strong password and complete the onboarding.',
        timestamp: '10:05 AM'
      },
      {
        id: 'evt-13',
        type: 'action',
        title: '4. Dashboard Loaded',
        content: 'Signup successful. Redirected to main dashboard.',
        image: saasDashboard,
        timestamp: '10:05 AM',
        metadata: { 'Redirect': '302 Found', 'TTFB': '1.2s' }
      }
    ]
  },
  {
    id: 'ad-consistency',
    name: 'Ad Campaign Consistency Check',
    persona: 'David, Digital Marketing',
    goal: 'Verify Facebook ad consistency',
    events: [
      {
        id: 'ad-1',
        type: 'user',
        content: 'Inspect this ad campaign. Landing page is our-brand.com/promo. Ad promises "50% OFF".',
        timestamp: '2:00 PM'
      },
      {
        id: 'ad-2',
        type: 'ai',
        content: 'Got it. Inspecting the funnel for the "50% OFF" campaign...',
        timestamp: '2:00 PM'
      },
      {
        id: 'ad-3',
        type: 'action',
        title: '1. Ad Creative Analyzed',
        content: 'Detected text: "50% OFF"',
        image: socialMediaAd,
        timestamp: '2:01 PM'
      },
      {
        id: 'ad-4',
        type: 'ai',
        content: 'I\'ve landed on the page. I\'ve found a critical inconsistency.',
        timestamp: '2:01 PM'
      },
      {
        id: 'ad-5',
        type: 'action',
        title: '2. Landed on Page',
        content: 'Navigated to target URL.',
        image: ecommerceProductPage,
        timestamp: '2:01 PM'
      },
      {
        id: 'ad-6',
        type: 'alert',
        title: 'CRITICAL MISMATCH',
        content: 'Ad promises "50% OFF" but landing page headline says "up to 40%". This is a major trust-breaker and potential legal risk.',
        timestamp: '2:01 PM'
      },
      {
        id: 'ad-7',
        type: 'insight',
        title: 'Recommendation',
        content: 'Update the landing page header immediately to match the ad creative, or pause the ad campaign.',
        timestamp: '2:02 PM'
      }
    ]
  }
];
