export interface FormField {
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file';
  control: string;
  label: string;
  placeholder?: string;
  options?: { label: string; value: any; }[];
  error?: string;
}
