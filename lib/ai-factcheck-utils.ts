// Utility functions for AI FactCheck storage
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { normalizeVerdict, VerdictValue } from "./utils";

export interface AIFactCheck {
  id: string;
  query: string;
  result: string;
  timestamp: number;
  verdict: VerdictValue;
  sources: Array<{
    id: number;
    title: string;
    url: string;
    snippet: string;
    language?: string;
  }>;
  sourceInfo?: {
    hasBengaliSources: boolean;
    hasEnglishSources: boolean;
    totalSources: number;
    geography?: "bangladesh" | "international";
    tierBreakdown?: {
      tier1: number;
      tier2: number;
      tier3: number;
      tier4: number;
      tier5: number;
      general: number;
    };
  };
  generatedAt: string;
  pageUrl: string;
}

export const addAIFactCheck = async (
  query: string,
  result: string,
  verdict: string,
  sources?: any[],
  sourceInfo?: any,
  createFactCheckMutation?: ReturnType<
    typeof useMutation<typeof api.factChecks.create>
  >
): Promise<boolean> => {
  try {
    const stored = localStorage.getItem("ai-fact-checks");
    const existingChecks: AIFactCheck[] = stored ? JSON.parse(stored) : [];

    // Check duplicates in localStorage
    const existingCheck = existingChecks.find((check) => check.query === query);
    if (existingCheck) {
      console.log(
        "Fact check for this query already exists in localStorage, skipping localStorage update"
      );
      return true;
    }

    const fiveSecondsAgo = Date.now() - 5000;
    const recentDuplicate = existingChecks.find(
      (check) => check.query === query && check.timestamp > fiveSecondsAgo
    );
    if (recentDuplicate) {
      console.log(
        "Recent duplicate detected in localStorage, skipping localStorage update"
      );
      return true;
    }

    // Create new fact-check
    const normalizedVerdict = normalizeVerdict(verdict);

    const newFactCheck: AIFactCheck = {
      id: Date.now().toString(),
      query,
      result,
      timestamp: Date.now(),
      verdict: normalizedVerdict,
      sources: sources || [],
      sourceInfo: sourceInfo || {
        hasBengaliSources: false,
        hasEnglishSources: false,
        totalSources: 0,
      },
      generatedAt: new Date().toISOString(),
      pageUrl: window.location.href,
    };

    // Save to localStorage
    const updatedChecks = [newFactCheck, ...existingChecks.slice(0, 9)];
    localStorage.setItem("ai-fact-checks", JSON.stringify(updatedChecks));

    // Save to Convex DB if mutation is provided
    if (createFactCheckMutation) {
      // Note: useQuery cannot be called here directly because addAIFactCheck is not a React component.
      // Instead, the query should be handled in the component (e.g., page.tsx) before calling addAIFactCheck.
      try {
        await createFactCheckMutation({
          ...newFactCheck,
          verdict: normalizedVerdict,
        });
        console.log("Successfully saved fact check to Convex DB");
      } catch (error) {
        console.error("Error saving to Convex DB:", error);
      }
    }

    return true;
  } catch (error) {
    console.error("Error adding AI fact check:", error);
    return false;
  }
};

export const getAIFactChecks = (): AIFactCheck[] => {
  try {
    const stored = localStorage.getItem("ai-fact-checks");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error getting AI fact checks:", error);
    return [];
  }
};

export const clearAIFactChecks = () => {
  try {
    localStorage.removeItem("ai-fact-checks");
    return true;
  } catch (error) {
    console.error("Error clearing AI fact checks:", error);
    return false;
  }
};
