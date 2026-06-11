export async function fetchPincodeDetails(pincode: string) {
  if (pincode.length !== 6) return null;
  
  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await response.json();
    
    if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
      const office = data[0].PostOffice[0];
      return {
        city: office.District,
        state: office.State,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching pincode details", error);
    return null;
  }
}
