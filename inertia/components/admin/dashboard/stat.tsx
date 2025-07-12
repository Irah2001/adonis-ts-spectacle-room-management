import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

interface DashboardStatProps {
	title: string;
	value: number | string;
	Icon: React.ComponentType<{ className?: string }>;
	description?: string;
}

export function AdminDashboardStat({ title, value, Icon, description }: DashboardStatProps) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<Icon className="text-muted-foreground h-4 w-4" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				<p className="text-muted-foreground text-xs">{description}</p>
			</CardContent>
		</Card>
	);
}
