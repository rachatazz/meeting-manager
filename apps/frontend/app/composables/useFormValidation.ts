type ValidationRule = (value: unknown) => string | undefined;

interface FieldRules {
  [field: string]: ValidationRule[];
}

export function useFormValidation() {
  const errors = reactive<Record<string, string>>({});

  function validate(form: Record<string, unknown>, rules: FieldRules): boolean {
    // Clear previous errors
    Object.keys(errors).forEach((k) => delete errors[k]);

    for (const [field, fieldRules] of Object.entries(rules)) {
      for (const rule of fieldRules) {
        const message = rule(form[field]);
        if (message) {
          errors[field] = message;
          break; // Stop at first error per field
        }
      }
    }

    return Object.keys(errors).length === 0;
  }

  function clearErrors() {
    Object.keys(errors).forEach((k) => delete errors[k]);
  }

  return { errors, validate, clearErrors };
}

// Common validation rules
export const rules = {
  required: (label: string): ValidationRule => {
    return (value: unknown) => {
      if (typeof value === 'string' && !value.trim()) return `${label} is required`;
      if (typeof value === 'number' && !value) return `${label} is required`;
      if (value === null || value === undefined || value === '') return `${label} is required`;
      return undefined;
    };
  },

  minLength: (label: string, min: number): ValidationRule => {
    return (value: unknown) => {
      if (typeof value === 'string' && value.length < min) {
        return `${label} must be at least ${min} characters`;
      }
      return undefined;
    };
  },

  email: (): ValidationRule => {
    return (value: unknown) => {
      if (typeof value === 'string' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Invalid email format';
      }
      return undefined;
    };
  },

  match: (label: string, getOther: () => unknown): ValidationRule => {
    return (value: unknown) => {
      if (value !== getOther()) return `${label} do not match`;
      return undefined;
    };
  },
};
