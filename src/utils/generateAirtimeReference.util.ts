export const generateReference = (): string => {
    // Get current time in Africa/Lagos timezone.
    // Using toLocaleString and creating a Date from it ensures the correct timezone.
    const now = new Date();
    const lagosString = now.toLocaleString('en-US', { timeZone: 'Africa/Lagos', hour12: false });
    const lagosDate = new Date(lagosString);
  
    const year = lagosDate.getFullYear();
    const month = (lagosDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed.
    const day = lagosDate.getDate().toString().padStart(2, '0');
    const hour = lagosDate.getHours().toString().padStart(2, '0');
    const minute = lagosDate.getMinutes().toString().padStart(2, '0');
  
    const prefix = `${year}${month}${day}${hour}${minute}`;
  
    const randomSuffix = Math.random().toString(16).substring(2, 10);
  
    return prefix + randomSuffix;
  };
  