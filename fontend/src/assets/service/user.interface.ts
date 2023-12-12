interface ContactInfo {
    fullName: string;
    phone: string;
    address: string;
    country: string;
    province: string;
    district: string;
    ward: string;
    zipCode: string;
    isDefault: boolean;
    _id: string;
  }
  
  interface User {
    _id:string;
    userId?: string;
    email: string;
    phone: string;
    name: string;
    password: string;
    isAdmin?: boolean;
    contactInfo: ContactInfo[];
  }
  
  export { User, ContactInfo };
  