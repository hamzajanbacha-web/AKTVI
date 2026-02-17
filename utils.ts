
export const formatNIC = (val: string): string => {
  const cleaned = val.replace(/\D/g, '');
  let formatted = cleaned;
  if (cleaned.length > 5 && cleaned.length <= 12) {
    formatted = `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  } else if (cleaned.length > 12) {
    formatted = `${cleaned.slice(0, 5)}-${cleaned.slice(5, 12)}-${cleaned.slice(12, 13)}`;
  }
  return formatted.slice(0, 15);
};

export const formatMobile = (val: string): string => {
  // If the user clears the input, we keep the prefix
  if (!val || val.length < 3) return '+92';

  // Extract digits only, but preserve the leading plus if it exists
  const hasPlus = val.startsWith('+');
  let cleaned = val.replace(/\D/g, '');
  
  // If user typed 92... or 03... or just 3...
  // We want to normalize everything to +92XXXXXXXXXX
  if (cleaned.startsWith('92')) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }
  
  // Re-attach +92 and limit to 10 digits for the actual number
  const digits = cleaned.slice(0, 10);
  return `+92${digits}`;
};

export const isValidNIC = (nic: string): boolean => {
  return /^\d{5}-\d{7}-\d{1}$/.test(nic);
};

export const isValidMobile = (mobile: string): boolean => {
  // Validates +92 followed by exactly 10 digits
  return /^\+92\d{10}$/.test(mobile);
};
