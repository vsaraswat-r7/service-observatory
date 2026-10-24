"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  Building2,
  Github,
  Cloud,
  CheckCircle,
  X,
  Plus,
  ArrowRight,
  ArrowLeft,
  SkipForward,
} from "lucide-react";

const STEPS = [
  { label: "Organization", icon: Building2 },
  { label: "GitHub", icon: Github },
  { label: "AWS", icon: Cloud },
  { label: "Summary", icon: CheckCircle },
];

const inputCls =
  "w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]";
const labelCls = "block text-xs text-[var(--text-muted)] mb-1";

export default function OnboardingPage() {
  const router = useRouter();
  const {
    organization,
    updateOrganization,
    addConnection,
    removeConnection,
    connections,
    addAwsAccount,
    awsAccounts,
    completeOnboarding,
  } = useStore();

  const [currentStep, setCurrentStep] = useState(0);

  // Step 1 — Organization
  const [companyName, setCompanyName] = useState(organization.name);
  const [githubOrg, setGithubOrg] = useState(organization.githubOrg);
  const [jiraUrl, setJiraUrl] = useState(organization.jiraBaseUrl);

  // Step 2 — GitHub
  const [repoInput, setRepoInput] = useState("");
  const [githubConnected, setGithubConnected] = useState(false);

  // Step 3 — AWS
  const [awsAccountId, setAwsAccountId] = useState("");
  const [awsAlias, setAwsAlias] = useState("");
  const [awsRegions, setAwsRegions] = useState("");
  const [awsRoleArn, setAwsRoleArn] = useState("");

  const handleNext = () => {
    if (currentStep === 0) {
      updateOrganization({
        name: companyName,
        githubOrg,
        jiraBaseUrl: jiraUrl,
      });
    }
    setCurrentStep((s) => Math.min(s + 1, 3));
  };

  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const handleAddRepo = () => {
    const repo = repoInput.trim();
    if (!repo) return;
    addConnection({ repo, connected: true, addedAt: new Date().toISOString() });
    setRepoInput("");
  };

  const handleAddAwsAccount = () => {
    if (!awsAccountId.trim()) return;
    const regions = awsRegions
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);
    addAwsAccount({
      id: awsAccountId.trim(),
      alias: awsAlias.trim() || awsAccountId.trim(),
      environment: "production",
      regions,
    });
    setAwsAccountId("");
    setAwsAlias("");
    setAwsRegions("");
    setAwsRoleArn("");
  };

  const handleFinish = () => {
    completeOnboarding();
    router.push("/");
  };

  const handleSkip = () => {
    completeOnboarding();
    router.push("/");
  };

  const cfnTemplate = `AWSTemplateFormatVersion: '2010-09-09'
Description: Service Observatory read-only IAM role
Resources:
  ObservatoryRole:
    Type: AWS::IAM::Role
    Properties:
      RoleName: ServiceObservatoryReadOnly
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              AWS: 'arn:aws:iam::root'
            Action: 'sts:AssumeRole'
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/ReadOnlyAccess`;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">Set Up Your Observatory</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Get started in a few steps — you can always change these later in Settings.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const active = i === currentStep;
          const done = i < currentStep;
          return (
            <div key={step.label} className="flex items-center gap-2">
              {i > 0 && (
                <div
                  className={`w-8 h-px ${done ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`}
                />
              )}
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  active
                    ? "bg-[var(--accent)] text-white"
                    : done
                      ? "bg-[var(--accent)]/20 text-[var(--accent)]"
                      : "bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border)]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {step.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
        {/* Step 1: Organization */}
        {currentStep === 0 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[var(--accent)]" />
              Organization Details
            </h2>
            <div>
              <label className={labelCls}>Company Name</label>
              <input
                className={inputCls}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Corp"
              />
            </div>
            <div>
              <label className={labelCls}>GitHub Organization</label>
              <input
                className={inputCls}
                value={githubOrg}
                onChange={(e) => setGithubOrg(e.target.value)}
                placeholder="acme-corp"
              />
            </div>
            <div>
              <label className={labelCls}>Jira URL</label>
              <input
                className={inputCls}
                value={jiraUrl}
                onChange={(e) => setJiraUrl(e.target.value)}
                placeholder="https://acme.atlassian.net"
              />
            </div>
          </div>
        )}

        {/* Step 2: Connect GitHub */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Github className="w-5 h-5 text-[var(--accent)]" />
              Connect GitHub Repositories
            </h2>

            <div className="flex gap-2">
              <input
                className={inputCls}
                value={repoInput}
                onChange={(e) => setRepoInput(e.target.value)}
                placeholder="org/repo"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddRepo();
                  }
                }}
              />
              <button
                onClick={handleAddRepo}
                className="px-4 py-2 text-sm rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors shrink-0 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Repo
              </button>
            </div>

            {connections.length > 0 && (
              <div className="space-y-1.5">
                {connections.map((c) => (
                  <div
                    key={c.repo}
                    className="flex items-center justify-between px-3 py-2 bg-[var(--bg)] rounded-lg border border-[var(--border)]"
                  >
                    <span className="text-sm">{c.repo}</span>
                    <button
                      onClick={() => removeConnection(c.repo)}
                      className="text-[var(--text-muted)] hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setGithubConnected(true)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-[var(--border)] text-[var(--text)] hover:bg-[var(--bg-card-hover)] transition-colors flex items-center justify-center gap-2"
            >
              <Github className="w-4 h-4" />
              Connect GitHub App
            </button>

            {githubConnected && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-sm text-green-400">
                <CheckCircle className="w-4 h-4" />
                GitHub App connected successfully!
              </div>
            )}
          </div>
        )}

        {/* Step 3: Connect AWS */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Cloud className="w-5 h-5 text-[var(--accent)]" />
              Connect AWS Accounts
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Account ID</label>
                <input
                  className={inputCls}
                  value={awsAccountId}
                  onChange={(e) => setAwsAccountId(e.target.value)}
                  placeholder="123456789012"
                />
              </div>
              <div>
                <label className={labelCls}>Alias</label>
                <input
                  className={inputCls}
                  value={awsAlias}
                  onChange={(e) => setAwsAlias(e.target.value)}
                  placeholder="production"
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Regions (comma-separated)</label>
              <input
                className={inputCls}
                value={awsRegions}
                onChange={(e) => setAwsRegions(e.target.value)}
                placeholder="us-east-1, eu-west-1"
              />
            </div>

            <div>
              <button
                onClick={() => {
                  const el = document.getElementById("cfn-block");
                  if (el) el.classList.toggle("hidden");
                }}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-[var(--border)] text-[var(--text)] hover:bg-[var(--bg-card-hover)] transition-colors flex items-center justify-center gap-2"
              >
                <Cloud className="w-4 h-4" />
                Deploy CloudFormation Stack
              </button>
              <pre
                id="cfn-block"
                className="hidden mt-3 p-4 bg-[var(--bg)] rounded-lg border border-[var(--border)] text-xs text-[var(--text-muted)] overflow-x-auto whitespace-pre"
              >
                {cfnTemplate}
              </pre>
            </div>

            <div>
              <label className={labelCls}>Role ARN</label>
              <input
                className={inputCls}
                value={awsRoleArn}
                onChange={(e) => setAwsRoleArn(e.target.value)}
                placeholder="arn:aws:iam::123456789012:role/ServiceObservatoryReadOnly"
              />
            </div>

            <button
              onClick={handleAddAwsAccount}
              className="px-4 py-2 text-sm rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Account
            </button>

            {awsAccounts.length > 0 && (
              <div className="space-y-1.5">
                {awsAccounts.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between px-3 py-2 bg-[var(--bg)] rounded-lg border border-[var(--border)]"
                  >
                    <span className="text-sm">
                      {a.alias} ({a.id}) — {a.regions.join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Summary */}
        {currentStep === 3 && (
          <div className="space-y-5 text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
            <h2 className="text-lg font-semibold">All Set!</h2>
            <div className="space-y-2 text-sm text-[var(--text-muted)]">
              <p>
                Organization: <span className="text-[var(--text)]">{organization.name}</span>
              </p>
              <p>
                GitHub repos connected:{" "}
                <span className="text-[var(--text)]">{connections.length}</span>
              </p>
              <p>
                AWS accounts:{" "}
                <span className="text-[var(--text)]">{awsAccounts.length}</span>
              </p>
            </div>
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 text-sm rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>
          {currentStep > 0 && currentStep < 3 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            <SkipForward className="w-4 h-4" /> Skip Onboarding
          </button>
          {currentStep < 3 && (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
