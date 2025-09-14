interface ChartDataPoint {
	station: string;
	mostFollowedPct: number;
	stationListeners: number;
}

interface CustomTooltipProps {
	active?: boolean;
	payload?: {
		value: number;
		payload: ChartDataPoint;
	}[];
}

export const ChartTooltip = ({ active, payload }: CustomTooltipProps) => {
	if (!active || !payload?.length) return null;

	const data = payload[0].payload;
	const station = data.station;
	const percentage = data.mostFollowedPct;
	const listeners = data.stationListeners;

	return (
		<div className="bg-popover z-50 rounded-md border px-3 py-2 shadow-md">
			<p className="text-foreground text-xs font-medium">{station}</p>
			<p className="text-muted-foreground text-xs">
				{listeners.toLocaleString()} estimated listeners
			</p>
			{percentage !== null && (
				<p className="text-muted-foreground text-xs">
					{percentage.toFixed(1)}% of respondents
				</p>
			)}
		</div>
	);
};
