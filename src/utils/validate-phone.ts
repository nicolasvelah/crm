const validatePhone = (phone: string): boolean => {
  try {
    if (phone.charAt(0) === '0') {
      const number = phone.substring(1);
      let pass = false;
      if (phone.charAt(1) === '9') {
        if (number.length === 9 && parseInt(number).toString().length === 9) {
          pass = true;
        }
      } else if (
        number.length === 8 &&
        parseInt(number).toString().length === 8
      ) {
        pass = true;
      }
      return pass;
    }
    return false;
  } catch (error) {
    //console.log('validatePhone', error.message);
    return false;
  }
};

export default validatePhone;
