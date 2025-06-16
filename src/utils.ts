export const currencyFormatter = (amount:any) => `ZAR ${parseFloat(amount).toFixed(2)}`

export const phoneNoValidation = (phone: string, countryCode: string): string | false => {
  // Clean up inputs
  let cleanPhone = phone.replace(/[^0-9+]/g, ''); // Remove all non-numeric characters except +
  let cleanCountryCode = countryCode.replace(/[^0-9+]/g, ''); // Remove all non-numeric characters except +

  // Remove + from country code if present
  if (cleanCountryCode.startsWith('+')) {
    cleanCountryCode = cleanCountryCode.slice(1);
  }

  // Check if phone number already has country code
  const hasCountryCode = cleanPhone.startsWith('+') ||
                        cleanPhone.startsWith(cleanCountryCode) ||
                        (cleanPhone.startsWith('00') && cleanPhone.slice(2, 2 + cleanCountryCode.length) === cleanCountryCode);

  // If phone number already has country code, validate and return it
  if (hasCountryCode) {
    let finalNumber = cleanPhone;

    // Remove + if present
    if (finalNumber.startsWith('+')) {
      finalNumber = finalNumber.slice(1);
    }

    // Remove 00 prefix if present
    if (finalNumber.startsWith('00')) {
      finalNumber = finalNumber.slice(2);
    }

    // Validate length (country code + number)
    if (finalNumber.length >= 10 && finalNumber.length <= 15) {
      return finalNumber; // Return without + prefix
    }
    return false;
  }

  // If phone number doesn't have country code, add it
  let finalNumber = cleanPhone;

  // Remove leading 0 if present
  if (finalNumber.startsWith('0')) {
    finalNumber = finalNumber.slice(1);
  }

  // Combine country code and number
  finalNumber = cleanCountryCode + finalNumber;

  // Validate final length
  if (finalNumber.length >= 10 && finalNumber.length <= 15) {
    return finalNumber; // Return without + prefix
  }

  return false;
};