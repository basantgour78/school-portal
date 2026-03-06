export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhoneNumber = (phone) => {
  return phone.length === 10 && /^\d+$/.test(phone);
};

export const validateAadhar = (aadhar) => {
  return aadhar.length === 12 && /^\d+$/.test(aadhar);
};

export const validateIFSC = (ifsc) => {
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
};

export const validateAccountNumber = (accountNumber) => {
  return accountNumber.length >= 9 && accountNumber.length <= 18 && /^\d+$/.test(accountNumber);
};

export const validateDOB = (dob, minAge = 3) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= minAge;
};
