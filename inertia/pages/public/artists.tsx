import React from 'react';

import { Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

interface ArtistProps {
	id: number;
	businessName: string;
	siret: string;
	email: string;
	phoneNumber: string;
	createdAt: string;
	updatedAt: string;
}

interface ArtistsProps {
	artists: ArtistProps[];
}

export default function Artists({ artists }: ArtistsProps) {
	return (
		<div className="flex min-h-screen w-full flex-col">
			<main className="flex-1">
				<section className="bg-muted/30 py-8">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div>
								<h1 className="text-3xl font-bold tracking-tight">Artists</h1>
								<p className="text-muted-foreground">Discover all our talented artists</p>
							</div>
							<div className="flex items-center gap-2">
								<Link href="/">
									<Button variant="ghost" size="sm">
										<ChevronLeft className="mr-1 h-4 w-4" />
										Back to Home
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</section>

				<section className="py-8">
					<div className="container px-4 md:px-6">
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{artists.map((artist) => (
								<Card key={artist.id} className="overflow-hidden">
									<CardHeader className="p-4">
										<CardTitle className="text-lg">{artist.businessName}</CardTitle>
										<CardDescription>{artist.email}</CardDescription>
									</CardHeader>
									<CardContent className="p-4 pt-0">
										<p className="text-muted-foreground text-sm">{artist.phoneNumber}</p>
										<p className="text-muted-foreground text-sm">{artist.siret}</p>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
