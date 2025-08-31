import { Info, LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface SurveyMetricCardProps {
	icon: LucideIcon;
	title: string;
	value: string | number;
	subtitle: string;
	tooltip: string;
}

export function SurveyMetricCard({
	icon: Icon,
	title,
	value,
	subtitle,
	tooltip,
}: SurveyMetricCardProps) {
	return (
		<Card>
			<CardHeader className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Icon className="h-4 w-4" />
					<CardTitle className="text-sm font-medium">
						{title}
					</CardTitle>
				</div>
				<Tooltip>
					<TooltipTrigger asChild>
						<Info className="text-muted-foreground h-5 w-5 cursor-pointer" />
					</TooltipTrigger>
					<TooltipContent>{tooltip}</TooltipContent>
				</Tooltip>
			</CardHeader>
			<CardContent>
				<div className="text-3xl font-bold">{value}</div>
				<p className="text-muted-foreground mt-1 text-xs">{subtitle}</p>
			</CardContent>
		</Card>
	);
}
