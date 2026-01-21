import modernSaasHomepage from '@assets/generated_images/modern_saas_homepage_screenshot.png';
import saasPricingPage from '@assets/generated_images/saas_pricing_page_screenshot.png';
import saasSignupForm from '@assets/generated_images/saas_signup_form_screenshot.png';
import saasDashboard from '@assets/generated_images/saas_analytics_dashboard_screenshot.png';
import socialMediaAd from '@assets/generated_images/social_media_ad_50_percent_off.png';
import ecommerceProductPage from '@assets/generated_images/ecommerce_product_page_40_percent_off.png';

export type EventType = 'action' | 'insight' | 'alert' | 'user' | 'ai';

export interface ThinkingStep {
  id: string;
  content: string;
  status: 'pending' | 'active' | 'complete';
  duration?: string;
}

export interface AgentAction {
  id: string;
  type: 'browser' | 'analysis' | 'input';
  description: string;
  status: 'running' | 'done' | 'failed';
  result?: string;
}

export interface StoryEvent {
  id: string;
  type: EventType;
  title?: string;
  content: string; // Text content or Image URL
  image?: string; // For action cards
  timestamp: string;
  metadata?: Record<string, string>;
  parentId?: string; // For branching logic
  thoughts?: ThinkingStep[];
  agentActions?: AgentAction[];
  files?: GeneratedFile[];
}

export interface Scenario {
  id: string;
  name: string;
  persona: string;
  goal: string;
  events: StoryEvent[];
}

export interface GeneratedFile {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'json' | 'video';
  size: string;
  timestamp: string;
  url: string;
}

export const GENERATED_FILES: GeneratedFile[] = [
    { id: 'f1', name: 'Competitor_Analysis_Report.pdf', type: 'pdf', size: '2.4 MB', timestamp: '2025-01-21 14:30', url: '#' },
    { id: 'f2', name: 'User_Flow_Diagram.png', type: 'image', size: '1.2 MB', timestamp: '2025-01-21 14:28', url: '#' },
    { id: 'f3', name: 'Market_Research_Data.json', type: 'json', size: '45 KB', timestamp: '2025-01-21 14:25', url: '#' },
    { id: 'f4', name: 'Onboarding_Session_Recording.mp4', type: 'video', size: '15.8 MB', timestamp: '2025-01-21 14:15', url: '#' },
    { id: 'f5', name: 'Competitor_Pricing_Screenshot.png', type: 'image', size: '850 KB', timestamp: '2025-01-21 14:10', url: '#' },
];

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
        timestamp: '10:00 AM',
        thoughts: [
          { id: 't1', content: 'Identifying core user journey for signup flow', status: 'complete', duration: '1.2s' },
          { id: 't2', content: 'Analyzing pricing structure and entry points', status: 'complete', duration: '0.8s' },
          { id: 't3', content: 'Determining optimal path for free trial validation', status: 'complete', duration: '0.5s' }
        ],
        agentActions: [
          { id: 'a1', type: 'browser', description: 'Navigating to competitor.com homepage', status: 'done', result: 'Loaded 200 OK' },
          { id: 'a2', type: 'analysis', description: 'Scanning DOM for "Sign Up" or "Start Trial" CTAs', status: 'done', result: 'Found 3 primary CTAs' },
          { id: 'a3', type: 'input', description: 'Clicking main hero CTA', status: 'done' }
        ]
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
        metadata: { 'Elements': '3 Cards', 'CTA': 'Start Free Trial' },
        parentId: 'evt-3'
      },
      {
        id: 'evt-8',
        type: 'action',
        title: '3. Started Signup Process',
        content: 'Clicked "Start Free Trial"',
        image: saasSignupForm,
        timestamp: '10:03 AM',
        parentId: 'evt-6'
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
        metadata: { 'Redirect': '302 Found', 'TTFB': '1.2s' },
        parentId: 'evt-8'
      },
      // BRANCHING SCENARIO EVENTS
      {
        id: 'evt-branch-1',
        type: 'user',
        content: 'Wait, go back to pricing. What if I click the Enterprise Contact button instead?',
        timestamp: '10:06 AM'
      },
      {
        id: 'evt-branch-2',
        type: 'ai',
        content: 'Checking the Enterprise flow...',
        timestamp: '10:06 AM'
      },
      {
        id: 'evt-branch-3',
        type: 'action',
        title: '3b. Enterprise Contact',
        content: 'Clicked "Contact Sales". Loaded HubSpot form.',
        image: modernSaasHomepage, // Reusing generic image for demo
        timestamp: '10:07 AM',
        metadata: { 'Form Fields': '7', 'Type': 'HubSpot Embed' },
        parentId: 'evt-6' // BRANCHES FROM PRICING (evt-6)
      },
      {
        id: 'evt-branch-4',
        type: 'user',
        content: 'Fill out the form with test data: "John Doe", "Acme Corp", "john@acme.com".',
        timestamp: '10:08 AM'
      },
      {
        id: 'evt-branch-5',
        type: 'ai',
        content: 'Filling form... Submitting...',
        timestamp: '10:08 AM'
      },
      {
        id: 'evt-branch-6',
        type: 'action',
        title: '3c. Form Submitted',
        content: 'Success message displayed. "Thanks for contacting us!"',
        image: saasSignupForm, // Reusing generic
        timestamp: '10:09 AM',
        metadata: { 'Response': '200 OK', 'Lead ID': '12345' },
        parentId: 'evt-branch-3'
      },
      {
        id: 'evt-branch-7',
        type: 'user',
        content: 'Did I get a confirmation email?',
        timestamp: '10:10 AM'
      },
      {
        id: 'evt-branch-8',
        type: 'ai',
        content: 'Checking inbox... Yes, email received.',
        timestamp: '10:10 AM'
      },
      {
        id: 'evt-branch-9',
        type: 'action',
        title: '3d. Email Received',
        content: 'Subject: "Welcome to Enterprise Sales". Contains calendar link.',
        image: saasDashboard, // Reusing generic
        timestamp: '10:11 AM',
        metadata: { 'Sender': 'sales@competitor.com', 'DKIM': 'Pass' },
        parentId: 'evt-branch-6'
      },
      {
        id: 'evt-completion',
        type: 'ai',
        content: 'Analysis complete. I have compiled all findings into a comprehensive report.',
        timestamp: '10:12 AM',
        files: [GENERATED_FILES[0]]
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
      // REMOVED standalone Alert
      // {
      //   id: 'ad-6',
      //   type: 'alert',
      //   title: 'CRITICAL MISMATCH',
      //   content: 'Ad promises "50% OFF" but landing page headline says "up to 40%". This is a major trust-breaker and potential legal risk.',
      //   timestamp: '2:01 PM'
      // },
      // REMOVED standalone Insight
      // {
      //   id: 'ad-7',
      //   type: 'insight',
      //   title: 'Recommendation',
      //   content: 'Update the landing page header immediately to match the ad creative, or pause the ad campaign.',
      //   timestamp: '2:02 PM'
      // }
    ]
  }
];
