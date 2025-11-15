"use client";

import React from "react";
import { TrendingUp } from "lucide-react";

import { Survey } from "@/lib/types/survey";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SurveyInfo } from "@/components/survey-results/survey-info";
import { SurveyMostFollowedTab } from "@/components/survey-results/survey-most-followed-tab";
import { SurveyOverviewTab } from "@/components/survey-results/survey-overview-tab";

interface TabConfig {
	value: string;
	label: string;
}

const SURVEY_TABS: TabConfig[] = [
	{ value: "overview", label: "Overview" },
	{ value: "followers", label: "Most Followed" },
	{ value: "audience", label: "Daily Audience" },
	{ value: "share", label: "Audience Share" },
	{ value: "programs", label: "Programs" },
	{ value: "reception", label: "Reception" },
] as const;

export default function SurveyResults({ survey }: { survey: Survey }) {
	return (
		<div className="container mx-auto px-4 py-6 md:py-8 lg:py-12">
			<div className="mb-6">
				<div className="mb-4 flex items-center gap-3">
					<div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full">
						<TrendingUp className="text-primary-foreground h-5 w-5" />
					</div>
					<h1 className="text-3xl font-bold">
						{survey.meta.title ??
							"Malta Radio - Audience Survey Results"}
					</h1>
				</div>
				<p className="text-muted-foreground max-w-3xl">
					{survey.meta.notes?.[0] ??
						"Official radio listenership findings from the Broadcasting Authority of Malta. See reach, audience share and timeband peaks."}
				</p>
			</div>

			<Tabs defaultValue="overview" className="w-full">
				<TabsList className="bg-input/30 mb-12 flex w-full flex-wrap gap-2 rounded-md border p-0 md:mb-4 md:flex-nowrap">
					{SURVEY_TABS.map((tab) => (
						<TabsTrigger
							key={tab.value}
							value={tab.value}
							className="data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground flex cursor-pointer rounded-md px-3 py-1.5 text-sm"
						>
							{tab.label}
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value="overview" className="space-y-6">
					<SurveyOverviewTab survey={survey} />
				</TabsContent>

				<TabsContent value="followers" className="space-y-6">
					<SurveyMostFollowedTab survey={survey} />
				</TabsContent>

				{/* TODO: Placeholder tabs */}
				<TabsContent value="audience" className="space-y-6">
					<div className="text-muted-foreground py-8 text-center">
						Daily Audience data coming soon...
					</div>
				</TabsContent>

				<TabsContent value="share" className="space-y-6">
					<div className="text-muted-foreground py-8 text-center">
						Audience Share data coming soon...
					</div>
				</TabsContent>

				<TabsContent value="programs" className="space-y-6">
					<div className="text-muted-foreground py-8 text-center">
						Programs data coming soon...
					</div>
				</TabsContent>

				<TabsContent value="reception" className="space-y-6">
					<div className="text-muted-foreground py-8 text-center">
						Reception data coming soon...
					</div>
				</TabsContent>
			</Tabs>

			<SurveyInfo survey={survey} />
		</div>
	);
}
