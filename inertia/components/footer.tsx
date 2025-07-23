import { Link } from '@inertiajs/react';
import { route } from '@izzyjs/route/client';
import { Ticket } from 'lucide-react';

export function Footer() {
	return (
		<footer className="bg-muted/30 border-t py-8">
			<div className="container mx-auto px-4 md:px-6">
				<div className="grid gap-8 md:grid-cols-4">
					<div>
						<div className="mb-4 flex items-center gap-2 font-semibold">
							<Ticket className="h-6 w-6" />
							<span>Venue Name</span>
						</div>
						<p className="text-muted-foreground text-sm">
							Your premier destination for live music, events, and unforgettable experiences.
						</p>
					</div>
					<div>
						<h3 className="mb-4 font-semibold">Quick Links</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link href={route('home').path} className="text-muted-foreground hover:text-foreground">
									Home
								</Link>
							</li>
							<li>
								<Link href={route('events').path} className="text-muted-foreground hover:text-foreground">
									Events
								</Link>
							</li>
							<li>
								<Link href="#" className="text-muted-foreground hover:text-foreground">
									Venues
								</Link>
							</li>
							<li>
								<Link href={route('artists').path} className="text-muted-foreground hover:text-foreground">
									Artists
								</Link>
							</li>
							<li>
								<Link href="#" className="text-muted-foreground hover:text-foreground">
									About Us
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="mb-4 font-semibold">Contact</h3>
						<address className="text-muted-foreground space-y-2 text-sm not-italic">
							<p>10 Rue René Viviani</p>
							<p>44200 Nantes, France</p>
							<p>Email: contact@venue-name.com</p>
							<p>Phone: 0123456789</p>
						</address>
					</div>
					<div>
						<h3 className="mb-4 font-semibold">Follow Us</h3>
						<div className="flex gap-4">
							<a href="#" className="text-muted-foreground hover:text-foreground">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="h-5 w-5"
								>
									<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
								</svg>
								<span className="sr-only">Facebook</span>
							</a>
							<a href="#" className="text-muted-foreground hover:text-foreground">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="h-5 w-5"
								>
									<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
									<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
									<line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
								</svg>
								<span className="sr-only">Instagram</span>
							</a>
							<a href="#" className="text-muted-foreground hover:text-foreground">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="h-5 w-5"
								>
									<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
								</svg>
								<span className="sr-only">Twitter</span>
							</a>
						</div>
					</div>
				</div>
				<div className="text-muted-foreground mt-8 border-t pt-8 text-center text-sm">
					<p>© {new Date().getFullYear()} EventUp. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
