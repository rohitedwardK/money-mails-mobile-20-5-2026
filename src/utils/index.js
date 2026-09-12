export const converToWordCase = str =>
  `${str?.substring(0, 1).toUpperCase()}${str?.substring(1)}`;

  export const zipFormat = (value) => {
    if (!value) {return value;}
        const ssn = value.replace(/[^\d]/g, '');
        const ssnLength = ssn.length;
        if (ssnLength < 6) {return ssn;}
        return `${ssn.slice(0, 5)}-${ssn.slice(5, 9)}`;
  };
  export const IdProofFormat = (value) => {
    if (!value) {return value;}
        const ssn = value.replace(/[^\d]/g, '');
        const ssnLength = ssn.length;
        if (ssnLength < 4) {return ssn;}
        if (ssnLength < 9) {
          return `${ssn.slice(0, 4)}-${ssn.slice(4)}`;
        }
        if (ssnLength < 13) {
          return `${ssn.slice(0, 4)}-${ssn.slice(4, 8)}-${ssn.slice(8, 12)}`;
        }
        return `${ssn.slice(0, 4)}-${ssn.slice(4, 8)}-${ssn.slice(8, 12)}-${ssn.slice(12, 16)}`;
  };
