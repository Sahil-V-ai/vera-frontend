import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button, RadioGroup, Input, Select, SelectItem } from "@heroui/react";
import { Card } from "@/components/Card";
import { Mail, CheckSquare, Globe, Briefcase, Building2, ChevronRight, ChevronLeft, Target } from "lucide-react";
import { OnboardingRadio } from "./_protected/-components/onboardRadio";
import { timezones } from "@/lib/utils";

const primaryUseCaseOptions = [
  { key: "sales", label: "Sales Calls", description: 'Track deals and sales performance' },
  { key: "customer_support", label: "Customer Support", description: "Monitor support quality and CSAT" },
  { key: "operational_calls", label: "Operational Calls", description: "Improve operational efficiency" },
  { key: "all_of_the_above", label: "All of the above", description: "Multi-purpose usage" },
];

const industryOptions = [
  { key: "technology_software", label: "Technology / Software" },
  { key: "e_commerce_retail", label: "E-commerce / Retail" },
  { key: "finance", label: "Finance" },
  { key: "healthcare", label: "Healthcare" },
  { key: "education", label: "Education" },
  { key: "real_estate", label: "Real Estate" },
  { key: "telecommunication", label: "Telecommunication" },
  { key: "manufacturing", label: "Manufacturing" },
  { key: "professional_services", label: "Professional Services" },
  { key: "others", label: "Others" },
];



interface OnboardingData {
  organization_name?: string;
  primary_use_case?: string;
  timezone?: string;
  industry?: string;
}

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"login" | "onboarding" | "success">("login");
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [currentStep, setCurrentStep] = useState(0);

  const totalSteps = 3;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const steps = [
    {
      title: "Organization Name",
      icon: Building2,
      description: "What's the name of your organization?",
      content: (
        <div className="space-y-4">
          <Input
            placeholder="Enter your organization name"
            value={onboardingData.organization_name || ""}
            onChange={(e) => handleOnboardingChange('organization_name', e.target.value)}
            variant="bordered"
            size="lg"
            className="w-full"
            description='This will appear in your dashboard and reports'
          />
        </div>
      ),
    },
    {
      title: "Primary Use Case",
      icon: Target,
      description: "What will you primarily use Vera for?",
      content: (
        <div className="flex flex-col gap-1 w-full">
          <RadioGroup
            classNames={{
              base: "w-full",
            }}
            className="oboarding-primary-usecase"
            onChange={(e) => handleOnboardingChange('primary_use_case', e.target.value)}
          >

            {primaryUseCaseOptions.map(usecase =>

            (

              <OnboardingRadio
                description={usecase.description}
                title={usecase.label}
                value={usecase.key}
              />
            )
            )}
          </RadioGroup>
        </div>
      ),
    },
    {
      title: "Regional Settings",
      icon: Globe,
      description: "Configure timezone and industry",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Timezone
            </label>
            <Select
              placeholder="Select your timezone"
              selectedKeys={onboardingData.timezone ? [onboardingData.timezone] : []}
              onChange={(e) => handleOnboardingChange('timezone', e.target.value)}
              className="w-full"
              variant="bordered"
              size="lg"
            >
              {timezones.map((option) => (
                <SelectItem key={option.key}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Industry
            </label>
            <Select
              placeholder="Select your industry"
              selectedKeys={onboardingData.industry ? [onboardingData.industry] : []}
              onChange={(e) => handleOnboardingChange('industry', e.target.value)}
              className="w-full"
              variant="bordered"
              size="lg"
            >
              {industryOptions.map((option) => (
                <SelectItem key={option.key}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      ),
    },
  ];

  const checkEmail = async (emailToCheck: string) => {
    try {
      const response = await fetch('/api/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToCheck }),
      });
      return await response.json();
    } catch {
      throw new Error('Failed to check email');
    }
  };

  const saveOnboarding = async (emailToSave: string, data: OnboardingData) => {
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToSave, ...data }),
      });
      return await response.json();
    } catch {
      throw new Error('Failed to save onboarding');
    }
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await checkEmail(email);

      if (result.exists && result.onboardingComplete) {
        const magicResult = await authClient.signIn.magicLink({ email });
        if (magicResult.error) {
          setError(magicResult.error.message || "Failed to send magic link");
        } else {
          setView("success");
        }
      } else {
        setView("onboarding");
        setCurrentStep(0);
      }
    } catch (error) {
      console.log(error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      await saveOnboarding(email, onboardingData);
      const result = await authClient.signIn.magicLink({ email });
      if (result.error) {
        setError(result.error.message || "Failed to send magic link");
      } else {
        setView("success");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingChange = (field: keyof OnboardingData, value: string) => {
    setOnboardingData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleOnboardingSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      setView("login");
      setCurrentStep(0);
    }
  };

  const canProceed = () => {
    if (currentStep === 0) return !!onboardingData.organization_name?.trim();
    if (currentStep === 1) return !!onboardingData.primary_use_case;
    if (currentStep === 2) return !!onboardingData.timezone && !!onboardingData.industry;
    return false;
  };

  if (view === "success") {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md p-8 space-y-6 rounded-2xl shadow-lg">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Check your email</h1>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Magic link sent to <strong className="text-gray-900 dark:text-white">{email}</strong>
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Click the link in the email to sign in. The link expires in 5 minutes.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md p-8 space-y-6 rounded-2xl shadow-lg">
        <div className="text-center">
          <div className="flex gap-4 items-center justify-center">
            <img src="/logo.png" alt="logo" className="h-10 w-10" />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Welcome to Vera Intelligence
            </h1>
          </div>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            {view === "onboarding"
              ? "Let's set up your account in just a few steps"
              : "Sign in with magic link sent to your email"}
          </p>
        </div>

        {view === "login" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="bordered"
                placeholder="you@example.com"
                size="lg"
                className="w-full"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <Button
              type="button"
              isLoading={loading}
              className="w-full"
              color="primary"
              size="lg"
              startContent={<Mail className="h-5 w-5" />}
              onPress={handleLogin}
            >
              {loading ? "Checking..." : "Continue"}
            </Button>
          </div>
        )}

        {view === "onboarding" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Step {currentStep + 1} of {totalSteps}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-4">
              {(() => {
                const step = steps[currentStep];
                const Icon = step.icon;
                return (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>
                    {step.content}
                  </>
                );
              })()}
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="light"
                className="flex-1"
                startContent={<ChevronLeft className="h-4 w-4" />}
                onPress={prevStep}
              >
                {currentStep === 0 ? "Cancel" : "Back"}
              </Button>
              <Button
                type="button"
                className="flex-1"
                color="primary"
                isDisabled={!canProceed()}
                isLoading={loading}
                endContent={currentStep < totalSteps - 1 ? <ChevronRight className="h-4 w-4" /> : <CheckSquare className="h-4 w-4" />}
                onPress={nextStep}
              >
                {currentStep < totalSteps - 1 ? "Continue" : "Complete"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
