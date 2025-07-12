import { useState } from 'react';

import { EyeSlashIcon } from '@heroicons/react/24/outline';
import { EyeIcon } from 'lucide-react';
import type { ControllerRenderProps } from 'react-hook-form';

import { Button } from './ui/button';
import { FormControl } from './ui/form';
import { Input } from './ui/input';

interface PasswordInputProps<FieldValues extends object> {
	placeholder?: string;
	autoComplete: 'current-password' | 'new-password';
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	field: ControllerRenderProps<FieldValues>;
}

export function PasswordInput<FieldValues extends object>({
	field,
	onChange,
	...props
}: PasswordInputProps<FieldValues>) {
	const [isPasswordHidden, setPasswordHidden] = useState(true);

	const PasswordVisibilityIcon = isPasswordHidden ? EyeIcon : EyeSlashIcon;

	return (
		<div className="relative">
			<FormControl onChange={onChange}>
				<Input
					className="bg-muted w-full text-base"
					required
					type={isPasswordHidden ? 'password' : 'text'}
					placeholder="********"
					{...props}
					{...field}
				/>
			</FormControl>
			<Button
				variant="link"
				type="button"
				onClick={() => setPasswordHidden(!isPasswordHidden)}
				className="absolute top-0 -right-2"
				title={isPasswordHidden ? 'Show password' : 'Hide password'}
			>
				<PasswordVisibilityIcon className="stroke-foreground/50 h-5 w-5" />
				<span className="sr-only">Toggle password visibility</span>
			</Button>
		</div>
	);
}
