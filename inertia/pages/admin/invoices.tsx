import { useState } from 'react';

import { Download, Plus, Search } from 'lucide-react';

import { AdminMenu } from '~/components/admin/menu';
import { Button } from '~/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Textarea } from '~/components/ui/textarea';
import { cn } from '~/lib/utils';

export default function Invoices() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const invoices = [
		{
			id: 'INV-001',
			client: 'Acme Inc.',
			event: 'Tech Conference 2023',
			date: 'Oct 15, 2023',
			amount: '$12,500.00',
			status: 'Paid',
			dueDate: 'Oct 1, 2023',
		},
		{
			id: 'INV-002',
			client: 'Globex Corp',
			event: 'Corporate Workshop',
			date: 'Oct 28, 2023',
			amount: '$4,500.00',
			status: 'Pending',
			dueDate: 'Oct 14, 2023',
		},
		{
			id: 'INV-003',
			client: 'Stark Industries',
			event: 'Product Launch',
			date: 'Nov 5, 2023',
			amount: '$8,800.00',
			status: 'Paid',
			dueDate: 'Oct 22, 2023',
		},
		{
			id: 'INV-004',
			client: 'Wayne Enterprises',
			event: 'Charity Gala',
			date: 'Nov 12, 2023',
			amount: '$15,300.00',
			status: 'Overdue',
			dueDate: 'Oct 29, 2023',
		},
		{
			id: 'INV-005',
			client: 'Umbrella Corporation',
			event: 'Science Symposium',
			date: 'Nov 18, 2023',
			amount: '$6,200.00',
			status: 'Draft',
			dueDate: 'Nov 4, 2023',
		},
	];

	// eslint-disable-next-line unicorn/consistent-function-scoping
	function getColorByStatus(status: string) {
		switch (status) {
			case 'Paid': {
				return 'bg-green-100 text-green-800';
			}

			case 'Pending': {
				return 'bg-yellow-100 text-yellow-800';
			}

			case 'Overdue': {
				return 'bg-red-100 text-red-800';
			}

			case 'Draft': {
				return 'bg-gray-100 text-gray-800';
			}

			default: {
				return 'bg-gray-100 text-gray-800';
			}
		}
	}

	return (
		<div className="grid flex-1">
			<div className="flex flex-col md:flex-row">
				<AdminMenu />
				<div className="flex-1 p-6">
					<div className="grid gap-6">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-2xl font-bold tracking-tight">Invoice Management</h1>
								<p className="text-muted-foreground">Create and manage invoices for your events.</p>
							</div>
							<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
								<DialogTrigger asChild>
									<Button>
										<Plus className="mr-2 h-4 w-4" />
										Create Invoice
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-[600px]">
									<DialogHeader>
										<DialogTitle>Create New Invoice</DialogTitle>
										<DialogDescription>Enter the details for the new invoice.</DialogDescription>
									</DialogHeader>
									<div className="grid gap-4 py-4">
										<div className="grid grid-cols-2 gap-4">
											<div className="grid gap-2">
												<Label htmlFor="client">Client</Label>
												<Select>
													<SelectTrigger id="client">
														<SelectValue placeholder="Select client" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="acme">Acme Inc.</SelectItem>
														<SelectItem value="globex">Globex Corp</SelectItem>
														<SelectItem value="stark">Stark Industries</SelectItem>
														<SelectItem value="wayne">Wayne Enterprises</SelectItem>
														<SelectItem value="umbrella">Umbrella Corporation</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div className="grid gap-2">
												<Label htmlFor="event">Event</Label>
												<Select>
													<SelectTrigger id="event">
														<SelectValue placeholder="Select event" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="tech-conf">Tech Conference 2023</SelectItem>
														<SelectItem value="workshop">Corporate Workshop</SelectItem>
														<SelectItem value="product">Product Launch</SelectItem>
														<SelectItem value="charity">Charity Gala</SelectItem>
														<SelectItem value="science">Science Symposium</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>
										<div className="grid grid-cols-2 gap-4">
											<div className="grid gap-2">
												<Label htmlFor="invoice-date">Invoice Date</Label>
												<Input id="invoice-date" type="date" />
											</div>
											<div className="grid gap-2">
												<Label htmlFor="due-date">Due Date</Label>
												<Input id="due-date" type="date" />
											</div>
										</div>
										<div className="grid gap-2">
											<Label>Invoice Items</Label>
											<div className="rounded-md border">
												<Table>
													<TableHeader>
														<TableRow>
															<TableHead>Description</TableHead>
															<TableHead>Quantity</TableHead>
															<TableHead>Unit Price</TableHead>
															<TableHead>Total</TableHead>
														</TableRow>
													</TableHeader>
													<TableBody>
														<TableRow>
															<TableCell>
																<Input placeholder="Item description" />
															</TableCell>
															<TableCell>
																<Input type="number" min="1" defaultValue="1" />
															</TableCell>
															<TableCell>
																<Input type="number" min="0" step="0.01" placeholder="0.00" />
															</TableCell>
															<TableCell>$0.00</TableCell>
														</TableRow>
														<TableRow>
															<TableCell colSpan={3} className="text-right font-medium">
																Subtotal
															</TableCell>
															<TableCell>$0.00</TableCell>
														</TableRow>
														<TableRow>
															<TableCell colSpan={3} className="text-right font-medium">
																Tax (10%)
															</TableCell>
															<TableCell>$0.00</TableCell>
														</TableRow>
														<TableRow>
															<TableCell colSpan={3} className="text-right font-medium">
																Total
															</TableCell>
															<TableCell className="font-bold">$0.00</TableCell>
														</TableRow>
													</TableBody>
												</Table>
											</div>
										</div>
										<div className="grid gap-2">
											<Label htmlFor="notes">Notes</Label>
											<Textarea id="notes" placeholder="Enter any additional notes" />
										</div>
									</div>
									<DialogFooter>
										<Button variant="outline" onClick={() => setIsDialogOpen(false)}>
											Cancel
										</Button>
										<Button onClick={() => setIsDialogOpen(false)}>Save as Draft</Button>
										<Button onClick={() => setIsDialogOpen(false)}>Save and Send</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
						<div className="flex items-center gap-4">
							<div className="relative flex-1">
								<Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
								<Input
									type="search"
									placeholder="Search invoices..."
									className="bg-background w-full appearance-none pl-8"
								/>
							</div>
							<Select defaultValue="all">
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Filter by status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Statuses</SelectItem>
									<SelectItem value="paid">Paid</SelectItem>
									<SelectItem value="pending">Pending</SelectItem>
									<SelectItem value="overdue">Overdue</SelectItem>
									<SelectItem value="draft">Draft</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Tabs defaultValue="all" className="w-full">
								<TabsList className="grid w-full grid-cols-5">
									<TabsTrigger value="all">All</TabsTrigger>
									<TabsTrigger value="draft">Draft</TabsTrigger>
									<TabsTrigger value="pending">Pending</TabsTrigger>
									<TabsTrigger value="paid">Paid</TabsTrigger>
									<TabsTrigger value="overdue">Overdue</TabsTrigger>
								</TabsList>
								<TabsContent value="all" className="mt-4">
									<div className="rounded-md border">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Invoice #</TableHead>
													<TableHead>Client</TableHead>
													<TableHead>Event</TableHead>
													<TableHead>Date</TableHead>
													<TableHead>Amount</TableHead>
													<TableHead>Status</TableHead>
													<TableHead>Actions</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{invoices.map((invoice) => (
													<TableRow key={invoice.id}>
														<TableCell className="font-medium">{invoice.id}</TableCell>
														<TableCell>{invoice.client}</TableCell>
														<TableCell>{invoice.event}</TableCell>
														<TableCell>{invoice.date}</TableCell>
														<TableCell>{invoice.amount}</TableCell>
														<TableCell>
															<div
																className={cn(
																	'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
																	getColorByStatus(invoice.status),
																)}
															>
																{invoice.status}
															</div>
														</TableCell>
														<TableCell>
															<div className="flex items-center gap-2">
																<Button variant="ghost" size="icon">
																	<Download className="h-4 w-4" />
																	<span className="sr-only">Download</span>
																</Button>
																<Button variant="ghost" size="sm">
																	View
																</Button>
																<Button variant="ghost" size="sm">
																	Edit
																</Button>
															</div>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								</TabsContent>
								<TabsContent value="draft" className="mt-4">
									<div className="rounded-md border">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Invoice #</TableHead>
													<TableHead>Client</TableHead>
													<TableHead>Event</TableHead>
													<TableHead>Date</TableHead>
													<TableHead>Amount</TableHead>
													<TableHead>Actions</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{invoices
													.filter((invoice) => invoice.status === 'Draft')
													.map((invoice) => (
														<TableRow key={invoice.id}>
															<TableCell className="font-medium">{invoice.id}</TableCell>
															<TableCell>{invoice.client}</TableCell>
															<TableCell>{invoice.event}</TableCell>
															<TableCell>{invoice.date}</TableCell>
															<TableCell>{invoice.amount}</TableCell>
															<TableCell>
																<div className="flex items-center gap-2">
																	<Button variant="ghost" size="sm">
																		View
																	</Button>
																	<Button variant="ghost" size="sm">
																		Edit
																	</Button>
																</div>
															</TableCell>
														</TableRow>
													))}
											</TableBody>
										</Table>
									</div>
								</TabsContent>
								<TabsContent value="pending" className="mt-4">
									<div className="rounded-md border">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Invoice #</TableHead>
													<TableHead>Client</TableHead>
													<TableHead>Event</TableHead>
													<TableHead>Date</TableHead>
													<TableHead>Amount</TableHead>
													<TableHead>Due Date</TableHead>
													<TableHead>Actions</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{invoices
													.filter((invoice) => invoice.status === 'Pending')
													.map((invoice) => (
														<TableRow key={invoice.id}>
															<TableCell className="font-medium">{invoice.id}</TableCell>
															<TableCell>{invoice.client}</TableCell>
															<TableCell>{invoice.event}</TableCell>
															<TableCell>{invoice.date}</TableCell>
															<TableCell>{invoice.amount}</TableCell>
															<TableCell>{invoice.dueDate}</TableCell>
															<TableCell>
																<div className="flex items-center gap-2">
																	<Button variant="ghost" size="icon">
																		<Download className="h-4 w-4" />
																		<span className="sr-only">Download</span>
																	</Button>
																	<Button variant="ghost" size="sm">
																		View
																	</Button>
																	<Button variant="ghost" size="sm">
																		Mark as Paid
																	</Button>
																</div>
															</TableCell>
														</TableRow>
													))}
											</TableBody>
										</Table>
									</div>
								</TabsContent>
								<TabsContent value="paid" className="mt-4">
									<div className="rounded-md border">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Invoice #</TableHead>
													<TableHead>Client</TableHead>
													<TableHead>Event</TableHead>
													<TableHead>Date</TableHead>
													<TableHead>Amount</TableHead>
													<TableHead>Actions</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{invoices
													.filter((invoice) => invoice.status === 'Paid')
													.map((invoice) => (
														<TableRow key={invoice.id}>
															<TableCell className="font-medium">{invoice.id}</TableCell>
															<TableCell>{invoice.client}</TableCell>
															<TableCell>{invoice.event}</TableCell>
															<TableCell>{invoice.date}</TableCell>
															<TableCell>{invoice.amount}</TableCell>
															<TableCell>
																<div className="flex items-center gap-2">
																	<Button variant="ghost" size="icon">
																		<Download className="h-4 w-4" />
																		<span className="sr-only">Download</span>
																	</Button>
																	<Button variant="ghost" size="sm">
																		View
																	</Button>
																</div>
															</TableCell>
														</TableRow>
													))}
											</TableBody>
										</Table>
									</div>
								</TabsContent>
								<TabsContent value="overdue" className="mt-4">
									<div className="rounded-md border">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Invoice #</TableHead>
													<TableHead>Client</TableHead>
													<TableHead>Event</TableHead>
													<TableHead>Date</TableHead>
													<TableHead>Amount</TableHead>
													<TableHead>Due Date</TableHead>
													<TableHead>Actions</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{invoices
													.filter((invoice) => invoice.status === 'Overdue')
													.map((invoice) => (
														<TableRow key={invoice.id}>
															<TableCell className="font-medium">{invoice.id}</TableCell>
															<TableCell>{invoice.client}</TableCell>
															<TableCell>{invoice.event}</TableCell>
															<TableCell>{invoice.date}</TableCell>
															<TableCell>{invoice.amount}</TableCell>
															<TableCell>{invoice.dueDate}</TableCell>
															<TableCell>
																<div className="flex items-center gap-2">
																	<Button variant="ghost" size="icon">
																		<Download className="h-4 w-4" />
																		<span className="sr-only">Download</span>
																	</Button>
																	<Button variant="ghost" size="sm">
																		View
																	</Button>
																	<Button variant="ghost" size="sm">
																		Send Reminder
																	</Button>
																	<Button variant="ghost" size="sm">
																		Mark as Paid
																	</Button>
																</div>
															</TableCell>
														</TableRow>
													))}
											</TableBody>
										</Table>
									</div>
								</TabsContent>
							</Tabs>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
