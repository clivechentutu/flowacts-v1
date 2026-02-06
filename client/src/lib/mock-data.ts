import modernSaasHomepage from '@assets/generated_images/modern_saas_homepage_screenshot.png';
import saasPricingPage from '@assets/generated_images/saas_pricing_page_screenshot.png';
import saasSignupForm from '@assets/generated_images/saas_signup_form_screenshot.png';
import saasDashboard from '@assets/generated_images/saas_analytics_dashboard_screenshot.png';
import socialMediaAd from '@assets/generated_images/social_media_ad_50_percent_off.png';
import ecommerceProductPage from '@assets/generated_images/ecommerce_product_page_40_percent_off.png';

export type EventType = 'action' | 'insight' | 'alert' | 'user' | 'ai' | 'file';

export type AgentRole = 'scout' | 'capturer' | 'analyst' | 'comparator' | 'reporter';

export interface ThoughtStep {
  label: string;
  status: 'pending' | 'active' | 'done';
}

export interface ThoughtProcess {
  steps: ThoughtStep[];
}

export interface TaskPlanStep {
  id: string;
  label: string;
  status: "done" | "active" | "pending";
  agentRole: AgentRole;
}

export interface StoryEvent {
  id: string;
  type: EventType;
  role?: 'user' | 'ai'; // Explicit role for chat messages
  agentRole?: AgentRole;
  title?: string;
  content: string; // Text content or Image URL
  messageLevel?: "insight" | "progress" | "process" | "plan";
  thinking?: string; // Legacy simple string thinking
  thoughtProcess?: ThoughtProcess; // New structured thinking
  taskPlan?: TaskPlanStep[]; // For messageLevel="plan"
  actions?: string[]; // Legacy List of actions taken by AI
  phase?: string; // For phase dividers
  image?: string; // For action cards
  timestamp: string;
  metadata?: Record<string, string>;
  parentId?: string; // For branching logic
  fileType?: string; // For file cards
  canvasLinkId?: string;
  canvasCardTitle?: string;
}

export interface Scenario {
  id: string;
  name: string;
  persona: string;
  goal: string;
  events: StoryEvent[];
  thumbnail?: string;
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
    thumbnail: '/thumbnails/dashboard.jpg',
    events: [
        {
          id: "m1",
          type: "ai",
          role: "ai",
          agentRole: "scout",
          content:
            "Your UX analysis team is ready.\nPaste a URL or describe a user flow to get started.",
          messageLevel: "insight",
          phase: undefined,
          timestamp: '10:00 AM'
        },
        {
          id: "m2",
          type: "user",
          role: "user",
          content:
            "Analyze the new user signup and onboarding flow for competitor.com.",
          phase: undefined,
          timestamp: '10:01 AM'
        },
        {
          id: "m2-plan",
          type: "ai",
          role: "ai",
          agentRole: "scout",
          content: "I've created a plan to analyze the onboarding flow.",
          messageLevel: "plan",
          phase: "Planning",
          taskPlan: [
            { id: "tp1", label: "Browse competitor.com homepage", status: "done", agentRole: "scout" },
            { id: "tp2", label: "Navigate to Pricing & Sign Up", status: "done", agentRole: "scout" },
            { id: "tp3", label: "Analyze Pricing Strategy", status: "done", agentRole: "analyst" },
            { id: "tp4", label: "Complete Signup Process", status: "active", agentRole: "scout" },
            { id: "tp5", label: "Generate UX Audit Report", status: "pending", agentRole: "reporter" }
          ],
          timestamp: '10:01 AM'
        },
        {
          id: "m3",
          type: "ai",
          role: "ai",
          agentRole: "scout",
          content:
            "Understood. Simulating a new user signing up for competitor.com...",
          messageLevel: "process",
          phase: "Browsing competitor.com",
          thoughtProcess: {
            steps: [
              { label: "Preparing to visit competitor.com...", status: "done" },
              { label: "Simulating a first-time visitor", status: "done" },
            ],
          },
          timestamp: '10:01 AM'
        },
        {
          id: "m4",
          type: "ai",
          role: "ai",
          agentRole: "scout",
          content:
            "Landed on the homepage. Found navigation with Pricing, Features, and Sign Up links.",
          messageLevel: "progress",
          phase: "Browsing competitor.com",
          timestamp: '10:02 AM'
        },
        {
          id: "m5",
          type: "user",
          role: "user",
          content:
            "Okay, find their pricing and then sign up for the free trial.",
          phase: "Browsing competitor.com",
          timestamp: '10:03 AM'
        },
        {
          id: "m6",
          type: "ai",
          role: "ai",
          agentRole: "scout",
          content: "Reached the pricing page.",
          messageLevel: "process",
          phase: "Analyzing Pricing",
          thoughtProcess: {
            steps: [
              { label: "Looking through the navigation...", status: "done" },
              { label: "Found the pricing page", status: "done" },
              { label: "Heading to pricing...", status: "done" },
            ],
          },
          timestamp: '10:03 AM'
        },
        {
          id: "m7",
          type: "ai",
          role: "ai",
          agentRole: "analyst",
          content:
            "Found 3 pricing tiers: Free, Pro ($29/mo), and Enterprise.\n\nThe free trial requires a credit card — this is a potential friction point for new users.",
          messageLevel: "insight",
          phase: "Analyzing Pricing",
          canvasLinkId: "card-pricing",
          canvasCardTitle: "Pricing Analysis",
          timestamp: '10:04 AM'
        },
        {
          id: "m8",
          type: "ai",
          role: "ai",
          agentRole: "scout",
          content: "Now proceeding to sign up for the free trial...",
          messageLevel: "process",
          phase: "Signing Up",
          thoughtProcess: {
            steps: [
              { label: "Clicking 'Start Free Trial'...", status: "done" },
              { label: "Filling in registration form...", status: "active" },
              { label: "Checking for friction points", status: "pending" },
            ],
          },
          timestamp: '10:05 AM'
        },
        // Restoring Canvas Action Events
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
          id: 'evt-13',
          type: 'action',
          title: '4. Dashboard Loaded',
          content: 'Signup successful. Redirected to main dashboard.',
          image: saasDashboard,
          timestamp: '10:05 AM',
          metadata: { 'Redirect': '302 Found', 'TTFB': '1.2s' },
          parentId: 'evt-8'
        },
        {
          id: 'evt-branch-3',
          type: 'action',
          title: '3b. Enterprise Contact',
          content: 'Clicked "Contact Sales". Loaded HubSpot form.',
          image: modernSaasHomepage,
          timestamp: '10:07 AM',
          metadata: { 'Form Fields': '7', 'Type': 'HubSpot Embed' },
          parentId: 'evt-6'
        },
        {
          id: 'evt-branch-6',
          type: 'action',
          title: '3c. Form Submitted',
          content: 'Success message displayed. "Thanks for contacting us!"',
          image: saasSignupForm,
          timestamp: '10:09 AM',
          metadata: { 'Response': '200 OK', 'Lead ID': '12345' },
          parentId: 'evt-branch-3'
        },
        {
          id: 'evt-branch-9',
          type: 'action',
          title: '3d. Email Received',
          content: 'Subject: "Welcome to Enterprise Sales". Contains calendar link.',
          image: saasDashboard,
          timestamp: '10:11 AM',
          metadata: { 'Sender': 'sales@competitor.com', 'DKIM': 'Pass' },
          parentId: 'evt-branch-6'
        },
        {
          id: 'evt-16',
          type: 'action',
          title: '5. Profile Settings',
          content: 'Opened settings page. "Profile" tab active.',
          image: saasDashboard,
          timestamp: '10:12 AM',
          metadata: { 'Page': '/settings/profile', 'Load': '0.5s' },
          parentId: 'evt-13'
        },
        {
          id: 'evt-18',
          type: 'action',
          title: '6. Avatar Uploaded',
          content: 'File "avatar.jpg" uploaded successfully.',
          image: saasDashboard,
          timestamp: '10:13 AM',
          metadata: { 'Size': '240KB', 'Type': 'image/jpeg' },
          parentId: 'evt-16'
        },
        {
          id: 'evt-20',
          type: 'action',
          title: '7. Team Invitation',
          content: 'Invitation email sent to jane@acme.com',
          image: saasDashboard,
          timestamp: '10:14 AM',
          metadata: { 'Role': 'Editor', 'Status': 'Pending' },
          parentId: 'evt-18'
        },
        {
           id: 'evt-21',
           type: 'action',
           title: '8. Session Ended',
           content: 'User logged out.',
           image: modernSaasHomepage,
           timestamp: '10:15 AM',
           metadata: { 'Duration': '15m 20s' },
           parentId: 'evt-20'
        }
    ]
  },
  {
    id: 'ad-consistency',
    name: 'Ad Campaign Consistency Check',
    persona: 'David, Digital Marketing',
    goal: 'Verify Facebook ad consistency',
    thumbnail: '/thumbnails/landing.jpg',
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
