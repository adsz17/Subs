export type FormErrors = {
  name?: string;
  slug?: string;
  general?: string;
};

export type FormValues = {
  name: string;
  slug: string;
  description: string;
  currency: string;
  amount: string;
};

export type FormState = {
  errors: FormErrors;
  values: FormValues;
};

export const initialFormState: FormState = {
  errors: {},
  values: {
    name: '',
    slug: '',
    description: '',
    currency: 'USD',
    amount: '',
  },
};
